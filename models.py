from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    theme_preference = db.Column(db.String(10), default='dark')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class EnergyData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    solar_production = db.Column(db.Float, default=0.0)  # kW
    home_consumption = db.Column(db.Float, default=0.0)  # kW
    grid_import = db.Column(db.Float, default=0.0)  # kW
    grid_export = db.Column(db.Float, default=0.0)  # kW
    battery_level = db.Column(db.Float, default=50.0)  # percentage
    battery_charge_rate = db.Column(db.Float, default=0.0)  # kW
