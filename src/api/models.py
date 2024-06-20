from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "telefono": self.telefono,
            "email": self.email,
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=False)
    title = db.Column(db.String(50), nullable=False)
    subtitle = db.Column(db.String(50), nullable=True)
    type = db.Column(db.String(20), nullable=False, default='Venta')  # Venta, Intercambio, Donación
    category = db.Column(db.String(50), nullable=False, default='Electrodomésticos')  # Electrodomésticos, Muebles, Vestimenta
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('posts', lazy=True))

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
            "user_id": self.user_id
        }

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('favorites', lazy=True))
    post = db.relationship('Post', backref=db.backref('favorites', lazy=True))

    def __repr__(self):
        return f'<Favorite user_id={self.user_id} post_id={self.post_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "post": self.post.serialize()
        }