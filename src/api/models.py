from datetime import datetime  # Asegúrate de tener esta línea
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)  # Añadir este campo
    is_active = db.Column(db.Boolean(), default=True, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "telefono": self.telefono,
            "email": self.email,
            "image_url": self.image_url,  # Añadir este campo
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=False)
    title = db.Column(db.String(50), nullable=False)
    subtitle = db.Column(db.String(50), nullable=True)
    type = db.Column(db.String(20), nullable=False, default='Venta')
    category = db.Column(db.String(50), nullable=False, default='Electrodomésticos')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    user = db.relationship('User', backref=db.backref('posts', lazy=True, cascade="all, delete-orphan"))

    def __repr__(self):
        return f'<Post {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "description": self.description,
            "title": self.title,
            "subtitle": self.subtitle,
            "type": self.type,
            "category": self.category,
            "user_id": self.user_id,
            "user": self.user.serialize()
        }

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id', ondelete='CASCADE'), nullable=False)
    user = db.relationship('User', backref=db.backref('favorites', lazy=True, cascade="all, delete-orphan"))
    post = db.relationship('Post', backref=db.backref('favorited_by', lazy=True, cascade="all, delete-orphan"))

    def __repr__(self):
        return f'<Favorite user_id={self.user_id} post_id={self.post_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "post": self.post.serialize()
        }

class ContactRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id', ondelete='CASCADE'), nullable=False)
    message = db.Column(db.String(500), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    sender = db.relationship('User', foreign_keys=[sender_id])
    receiver = db.relationship('User', foreign_keys=[receiver_id])
    post = db.relationship('Post', backref=db.backref('contact_requests', lazy=True, cascade="all, delete-orphan"))

    def serialize(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "post_id": self.post_id,
            "post": self.post.serialize(),
            "message": self.message,
            "timestamp": self.timestamp.isoformat()
        }
