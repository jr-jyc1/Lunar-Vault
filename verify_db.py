from sqlalchemy import create_engine, inspect

engine = create_engine("sqlite:///instance/lunar_vault.db")
inspector = inspect(engine)

print("Tables in the database:")
print(inspector.get_table_names())

print("\nColumns in 'user' table:")
for column in inspector.get_columns('user'):
    print(f"  {column['name']}")

print("\nColumns in 'device_command_logs' table:")
try:
    for column in inspector.get_columns('device_command_logs'):
        print(f"  {column['name']}")
except Exception as e:
    print(f"Could not inspect 'device_command_logs': {e}")
