from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    password = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "age": self.age,
            "phone_number": self.phone_number,
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(255), nullable=True)
    short_description = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    title = db.Column(db.String(50), nullable=False)
    subtitle = db.Column(db.String(50), nullable=True)
    type = db.Column(db.String(20), nullable=False, default='Venta')  # Venta, Intercambio, Donación
    category = db.Column(db.String(50), nullable=False, default='Electrodomésticos')  # Electrodomésticos, Muebles, Vestimenta
    price = db.Column(db.Float, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def __repr__(self):
        return f'<Post {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "short_description": self.short_description,
            "description": self.description,
            "title": self.title,
            "subtitle": self.subtitle,
            "type": self.type,
            "category": self.category,
            "price": self.price,
            "user_id": self.user_id
        }
