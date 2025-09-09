from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app import app, db, socketio
from models import User, EnergyData
from energy_simulator import EnergySimulator
import json
import logging
from datetime import datetime, timedelta

# Initialize energy simulator
energy_sim = EnergySimulator()

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        logging.info(f"Login attempt for {email}")
        
        if user and user.check_password(password):
            login_user(user)
            logging.info(f"Login successful for {email}")
            return redirect(url_for('dashboard'))
        else:
            logging.warning(f"Login failed for {email}")
            flash('Invalid email or password', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    
    if User.query.filter_by(email=email).first():
        flash('Email already registered', 'error')
        return redirect(url_for('login'))
    
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    login_user(user)
    return redirect(url_for('dashboard'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/solar')
@login_required
def solar():
    return render_template('solar.html', user=current_user)

@app.route('/home')
@login_required
def home():
    return render_template('home.html', user=current_user)

@app.route('/grid')
@login_required
def grid():
    return render_template('grid.html', user=current_user)

@app.route('/battery')
@login_required
def battery():
    return render_template('battery.html', user=current_user)

@app.route('/savings')
@login_required
def savings():
    return render_template('savings.html', user=current_user)

@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html', user=current_user)

@app.route('/api/energy/current')
@login_required
def get_current_energy():
    data = energy_sim.get_current_data()
    return jsonify(data)

@app.route('/api/energy/history/<period>')
@login_required
def get_energy_history(period):
    # Generate historical data based on period
    data = energy_sim.get_historical_data(period)
    return jsonify(data)

@app.route('/api/weather/forecast')
@login_required
def get_weather_forecast():
    forecast = energy_sim.get_weather_forecast()
    return jsonify(forecast)

@app.route('/api/recommendations')
@login_required
def get_recommendations():
    recommendations = energy_sim.get_smart_recommendations()
    return jsonify(recommendations)

@app.route('/api/theme', methods=['POST'])
@login_required
def update_theme():
    theme = request.json.get('theme')
    if theme in ['dark', 'light']:
        current_user.theme_preference = theme
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False})

# SocketIO events for real-time updates
@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        print(f'User {current_user.username} connected')

@socketio.on('disconnect')
def handle_disconnect():
    if current_user.is_authenticated:
        print(f'User {current_user.username} disconnected')

@socketio.on('request_energy_update')
def handle_energy_update():
    if current_user.is_authenticated:
        data = energy_sim.get_current_data()
        socketio.emit('energy_update', data)
