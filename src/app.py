import os
from flask import Flask, request, jsonify, url_for, send_from_directory, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from api.models import db, User, Post
from api.utils import APIException, generate_sitemap
from api.admin import setup_admin
from api.commands import setup_commands
import bcrypt

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

db.init_app(app)
Migrate(app, db)
CORS(app)
JWTManager(app)
setup_admin(app)
setup_commands(app)

# Blueprint
api = Blueprint('api', __name__)

# Crear datos de prueba
def create_hardcoded_data():
    if not User.query.filter_by(email="testuser@example.com").first():
        hashed_password = bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt())
        user = User(first_name="Test", last_name="User", email="testuser@example.com", password=hashed_password.decode('utf-8'))
        db.session.add(user)
        db.session.commit()
        print("Hardcoded user created")

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    return generate_sitemap(app)

# Rutas 
@api.route('/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')

    if not first_name or not last_name or not email or not password:
        return jsonify({"msg": "Missing first_name, last_name, email or password"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(
        email=email, 
        password=hashed_password.decode('utf-8'), 
        first_name=first_name, 
        last_name=last_name
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return jsonify(access_token=access_token), 201

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad email or password"}), 401

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.email), 200

@api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

@api.route('/posts', methods=['GET'])
def get_all_posts():
    posts = Post.query.all()
    return jsonify([post.serialize() for post in posts]), 200

@api.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if data.get('type') not in ['Venta', 'Intercambio', 'Donación']:
        return jsonify({"msg": "Invalid type. Must be one of ['Venta', 'Intercambio', 'Donación']"}), 400

    if data.get('category') not in ['Electrodomésticos', 'Muebles', 'Vestimenta']:
        return jsonify({"msg": "Invalid category. Must be one of ['Electrodomésticos', 'Muebles', 'Vestimenta']"}), 400

    new_post = Post(
        image=data.get('image'),
        short_description=data['short_description'],
        description=data['description'],
        title=data['title'],
        subtitle=data.get('subtitle'),
        type=data['type'],
        category=data['category'],
        price=data['price'],
        user_id=current_user_id
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201

# Registrar el Blueprint
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        create_hardcoded_data()
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
