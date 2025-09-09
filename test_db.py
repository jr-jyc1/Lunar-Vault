#!/usr/bin/env python3
"""
Test script to check database and create test user
"""
import os
import sys
sys.path.append('.')

from app import app, db
from models import User

def test_database():
    with app.app_context():
        # Check if database exists and has tables
        try:
            users = User.query.all()
            print(f"Found {len(users)} users in database")

            if len(users) == 0:
                print("No users found. Creating test user...")
                test_user = User(username='testuser', email='test@example.com')
                test_user.set_password('password123')
                db.session.add(test_user)
                db.session.commit()
                print("Test user created: test@example.com / password123")
            else:
                for user in users:
                    print(f"User: {user.username} ({user.email})")

        except Exception as e:
            print(f"Database error: {e}")
            # Try to create tables
            print("Creating database tables...")
            db.create_all()
            print("Tables created. Creating test user...")
            test_user = User(username='testuser', email='test@example.com')
            test_user.set_password('password123')
            db.session.add(test_user)
            db.session.commit()
            print("Test user created: test@example.com / password123")

if __name__ == '__main__':
    test_database()