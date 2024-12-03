import secrets

# Generar una clave secreta segura
secret_key = secrets.token_urlsafe(32)

# Especificar el nombre del archivo .env
env_file = ".env"

# Escribir la clave en el archivo .env
with open(env_file, "w") as file:
    file.write(f"SECRET_KEY={secret_key}\n")

print(f"Clave secreta generada y guardada en {env_file}: {secret_key}")
