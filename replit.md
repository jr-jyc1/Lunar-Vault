# Lunar Vault - Energy Management System

## Overview

Lunar Vault is a futuristic energy management web application built with Flask that provides real-time monitoring and control of home energy systems. The app features a "Living Interface" design philosophy with 3D animations, glassmorphism UI elements, and holographic data visualization. Users can monitor solar production, home consumption, grid interactions, and battery levels through an immersive, space-themed dashboard that makes energy data feel alive and responsive.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend follows a futuristic "Living Interface" design with several key architectural decisions:

- **3D Animated Background**: Uses Three.js to create dynamic celestial backgrounds with particles, nebulae, and stars that respond to user interactions
- **Glassmorphism UI**: Implements translucent panels with frosted glass effects for all major components, creating depth and visual hierarchy
- **Holographic Elements**: KPI indicators and data points appear as floating, backgroundless elements that seem to hover over the interface
- **Responsive Design**: Dual-mode navigation system with vertical rail for desktop and bottom tab bar for mobile
- **Real-time Visualizations**: Chart.js integration for energy trend analysis with interactive, scrubbable charts

### Backend Architecture
Built on Flask with a modular, extension-based structure:

- **Application Factory Pattern**: Uses Flask application factory with extension initialization in `app.py`
- **Blueprint Architecture**: Routes are separated into logical modules for authentication, dashboard, and analytics
- **Real-time Communication**: Flask-SocketIO enables live energy data streaming to connected clients
- **Energy Simulation**: Custom `EnergySimulator` class generates realistic energy production and consumption data based on time-of-day patterns

### Authentication System
Simple session-based authentication with Flask-Login:

- **User Management**: SQLAlchemy models for user accounts with password hashing
- **Session Security**: Configurable session secrets with development fallbacks
- **Login Flow**: Traditional email/password authentication with provisions for social login integration

### Data Architecture
SQLAlchemy ORM with declarative base model structure:

- **User Model**: Stores account information, preferences, and theme settings
- **EnergyData Model**: Time-series storage for solar production, consumption, grid interactions, and battery data
- **Database Flexibility**: Supports both SQLite for development and PostgreSQL for production via environment configuration

### Theme System
Dual-mode theming with CSS custom properties:

- **Dark Mode Default**: Space-themed dark interface optimized for reduced eye strain
- **Light Mode Alternative**: High-contrast light theme for daytime usage
- **Theme Persistence**: User preferences stored in both database and localStorage
- **Dynamic Switching**: Runtime theme changes without page refresh

## External Dependencies

### Core Framework Stack
- **Flask**: Web application framework with SQLAlchemy ORM integration
- **Flask-Login**: Session management and user authentication
- **Flask-SocketIO**: Real-time bidirectional communication for live energy data
- **SQLAlchemy**: Database ORM with support for SQLite and PostgreSQL

### Frontend Libraries
- **Three.js**: 3D graphics library for animated backgrounds and energy flow visualizations
- **Chart.js**: Interactive charting with time-series support and date adapters
- **Bootstrap 5**: Responsive grid system and utility classes
- **Font Awesome**: Icon library for UI elements and navigation

### Development Tools
- **Socket.IO**: WebSocket communication library for real-time features
- **Werkzeug**: WSGI middleware including ProxyFix for deployment behind reverse proxies

### Typography & Design
- **Google Fonts**: Montserrat for headings, Roboto for body text
- **Custom CSS**: Extensive glassmorphism and holographic effect implementations

### Deployment Considerations
- **Environment Configuration**: Database URLs and session secrets via environment variables
- **Connection Pooling**: SQLAlchemy engine optimization with connection recycling
- **CORS Support**: Configured for cross-origin WebSocket connections
- **Proxy Support**: Werkzeug ProxyFix middleware for reverse proxy deployments