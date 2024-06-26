import os
from flask import Flask, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from api.models import db, User, Post, Favorite, ContactRequest
from api.utils import APIException, generate_sitemap
from api.admin import setup_admin
from api.commands import setup_commands
import bcrypt
from datetime import datetime
import cloudinary
import cloudinary.uploader

# Configuración de Cloudinary
cloudinary.config(
    cloud_name = 'djpifu0cl', 
    api_key = '728872235866552',
    api_secret = '-ZWCi3RFfneVx4FS4L1jp8sKyOE'
)

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración de CORS para permitir solicitudes desde tu frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

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
JWTManager(app)
setup_admin(app)
setup_commands(app)

# Blueprint
api = Blueprint('api', __name__)

# Crear datos de prueba
def create_hardcoded_data():
    if not User.query.filter_by(email="testuser@example.com").first():
        hashed_password = bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt())
        user = User(nombre="Test User", email="testuser@example.com", password=hashed_password.decode('utf-8'))
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

 
# Ruta para subir imagen
@api.route('/upload', methods=['POST'])
def upload_image():
    file_to_upload = request.files['file']
    if file_to_upload:
        upload_result = cloudinary.uploader.upload(file_to_upload)
        return jsonify(upload_result), 200
    return jsonify({"msg": "No file uploaded"}), 400

# Rutas

# En la ruta de registro
@api.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        nombre = request.json.get('nombre')
        telefono = request.json.get('telefono')
        image_data = request.json.get('image')

        if not nombre or not email or not password:
            return jsonify({"msg": "Missing nombre, email, or password"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "User already exists"}), 409

        # Subir la imagen a Cloudinary
        image_url = None
        if image_data:
            try:
                upload_result = cloudinary.uploader.upload(image_data)
                image_url = upload_result.get("url")
            except Exception as e:
                print(f"Error uploading image to Cloudinary: {e}")
                return jsonify({"msg": f"Failed to upload image: {e}"}), 500

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(
            email=email,
            password=hashed_password.decode('utf-8'),
            nombre=nombre,
            telefono=telefono,
            image_url=image_url
        )
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)
        return jsonify(access_token=access_token, user=new_user.serialize()), 201
    except Exception as e:
        print(f"Error during user registration: {e}")
        return jsonify({"msg": f"Internal server error: {e}"}), 500

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user=user.serialize()), 200
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

@api.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    nombre = request.form.get('nombre')
    telefono = request.form.get('telefono')
    email = request.form.get('email')
    image_file = request.files.get('image')

    if nombre:
        user.nombre = nombre
    if telefono:
        user.telefono = telefono
    if email:
        user.email = email
    if image_file:
        upload_result = cloudinary.uploader.upload(image_file)
        user.image_url = upload_result.get("url")

    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route('/posts', methods=['GET'])
@jwt_required()
def get_all_posts():
    user_id = get_jwt_identity()
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
        description=data['description'],
        title=data['title'],
        subtitle=data.get('subtitle'),
        type=data['type'],
        category=data['category'],
        user_id=current_user_id
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201

@api.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"msg": "Post not found"}), 404
    return jsonify(post.serialize()), 200

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    current_user_id = get_jwt_identity()
    post_id = request.json.get('post_id')

    if not post_id:
        return jsonify({"msg": "Missing post_id"}), 400

    new_favorite = Favorite(user_id=current_user_id, post_id=post_id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify(new_favorite.serialize()), 201

@api.route('/all-posts', methods=['GET'])
def get_all_posts_unrestricted():
    posts = Post.query.all()
    return jsonify([post.serialize() for post in posts]), 200

@api.route('/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    current_user_id = get_jwt_identity()
    post = Post.query.get(post_id)

    if not post:
        return jsonify({"msg": "Post not found"}), 404

    if post.user_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.get_json()
    post.image = data.get('image', post.image)
    post.description = data.get('description', post.description)
    post.title = data.get('title', post.title)
    post.subtitle = data.get('subtitle', post.subtitle)
    post.type = data.get('type', post.type)
    post.category = data.get('category', post.category)

    db.session.commit()
    return jsonify(post.serialize()), 200

@api.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    current_user_id = get_jwt_identity()
    post = Post.query.get(post_id)

    if not post:
        return jsonify({"msg": "Post not found"}), 404

    if post.user_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    try:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"msg": "Post deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error deleting post", "error": str(e)}), 500

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=current_user_id).all()
    return jsonify([favorite.serialize() for favorite in favorites]), 200

@api.route('/favorites/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(post_id):
    current_user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(user_id=current_user_id, post_id=post_id).first()

    if not favorite:
        return jsonify({"msg": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"msg": "Favorite deleted"}), 200

@api.route('/contact-requests', methods=['POST'])
@jwt_required()
def create_contact_request():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    post_id = data.get('post_id')

    if not post_id:
        return jsonify({"msg": "Missing post_id"}), 400

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    if post.user_id == current_user_id:
        return jsonify({"msg": "Cannot request contact for your own post"}), 400

    existing_request = ContactRequest.query.filter_by(sender_id=current_user_id, post_id=post_id).first()
    if existing_request:
        return jsonify({"msg": "Contact request already sent"}), 400

    new_request = ContactRequest(
        sender_id=current_user_id,
        receiver_id=post.user_id,
        post_id=post_id,
        message=data.get('message', '')
    )
    db.session.add(new_request)
    db.session.commit()

    return jsonify(new_request.serialize()), 201

@api.route('/contact-requests', methods=['GET'])
@jwt_required()
def get_contact_requests():
    current_user_id = get_jwt_identity()
    requests = ContactRequest.query.filter_by(receiver_id=current_user_id).all()
    return jsonify([request.serialize() for request in requests]), 200

@api.route('/contact-requests/sent', methods=['GET'])
@jwt_required()
def get_sent_contact_requests():
    current_user_id = get_jwt_identity()
    requests = ContactRequest.query.filter_by(sender_id=current_user_id).all()
    return jsonify([request.serialize() for request in requests]), 200

# Registrar el Blueprint
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        create_hardcoded_data()
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
