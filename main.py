from app import app, socketio
import logging

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    logging.info("Starting Lunar Vault application...")
    socketio.run(app, host='0.0.0.0', port=5001, debug=True, use_reloader=True, log_output=True)
