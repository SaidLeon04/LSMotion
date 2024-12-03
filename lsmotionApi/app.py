from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS  # Importa Flask-CORS
from dotenv import load_dotenv
from bson import ObjectId
import os
import hashlib
import jwt
import datetime


app = Flask(__name__)

# Habilitar CORS para todas las rutas
CORS(app, resources={r"/*": {"origins": "*"}})

# Cargar las variables del archivo .env
load_dotenv()
KEY = os.getenv("SECRET_KEY")

# Conectar a MongoDB Atlas
app.config['MONGO_URI'] = os.getenv("MONGO_URI")  # Asegúrate de definir esta variable en tu .env
client = MongoClient(app.config['MONGO_URI'])

# Selecciona la base de datos y colección
db = client['users_db']
collection = db['users']

# Seleccionar la base de datos y colección para levels_db
levels_db = client['levels_db']
levels_collection = levels_db['levels']

# Seleccionar la base de datos y colección para glosary_db
glosary_db = client['glossary_db']
glosary_collection = glosary_db['alphabet']

@app.route('/', methods=['GET'])
def home():
    try:
        client.admin.command('ping')
        return jsonify({"success": True, "message": "Conexión exitosa a MongoDB Atlas"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error al conectar a MongoDB Atlas", "error": str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        nombre_usuario = data.get("nombre_usuario")
        email = data.get("email")
        password = data.get("password")

        if not nombre_usuario or not email or not password:
            return jsonify({"success": False, "message": "Faltan datos obligatorios"}), 400

        if collection.find_one({"email": email}):
            return jsonify({"success": False, "message": "El email ya está registrado"}), 400

        if collection.find_one({"nombre_usuario": nombre_usuario}):
            return jsonify({"success": False, "message": "El nombre de usuario ya está registrado"}), 400

        password_encriptada = hashlib.sha256(password.encode()).hexdigest()

        usuario = {
            "nombre_usuario": nombre_usuario,
            "email": email,
            "password": password_encriptada,
            "avatar": "default_avatar.png",
            "edad": 0,
            "progreso": {
                "niveles_completados": 0,
                "horas_dedicadas": 0,
                "curva_aprendizaje": []
            },
            "logros": [],
            "fecha_registro": datetime.datetime.utcnow()
        }

        resultado = collection.insert_one(usuario)

        return jsonify({
            "success": True,
            "message": "Usuario registrado exitosamente",
            "user_id": str(resultado.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        # Obtener los datos enviados por el cliente
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Validar que ambos datos se proporcionen
        if not email or not password:
            return jsonify({"success": False, "message": "Correo o contraseña faltante"}), 400

        # Encriptar la contraseña
        password_encriptada = hashlib.sha256(password.encode()).hexdigest()

        # Buscar al usuario en la base de datos por el correo
        user = collection.find_one({"email": email})

        if not user:
            return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

        if user["password"] != password_encriptada:
            return jsonify({"success": False, "message": "Contraseña incorrecta"}), 401

        # Generar el token JWT
        payload = {
            "user_id": str(user["_id"]),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token válido por 1 hora
        }
        token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm="HS256")

        # Devolver el token junto con el nombre del usuario
        return jsonify({
            "success": True,
            "message": "Login exitoso",
            "token": token,
            "name": user.get("nombre_usuario", "Usuario")  # Devuelve el nombre o un valor predeterminado
        }), 200

    except Exception as e:
        print("Error en el servidor:", str(e))  # Imprime el error detallado
        return jsonify({"success": False, "error": str(e)}), 500

# Decorador para proteger rutas con JWT
def token_required(f):
    def wrapper(*args, **kwargs):
        # Obtener el token directamente desde las cabeceras
        token = request.headers.get("Authorization")

        # Si el token está presente, puedes verificar si tiene el prefijo 'Bearer'
        if token and token.startswith("Bearer "):
            token = token.split(" ")[1]  # Extraer el token después de "Bearer"
        
        if not token:
            return jsonify({"success": False, "message": "Token faltante"}), 403

        try:
            decoded = jwt.decode(token, KEY, algorithms=["HS256"])
            request.user_id = decoded["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token expirado"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Token inválido"}), 403

        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__  # Esto es necesario para evitar conflictos en Flask
    return wrapper

@app.route('/profile', methods=['GET'])
@token_required
def profile():
    # Imprimir el user_id para ver si el token se está procesando correctamente
    print("user_id:", request.user_id)

    # Intentar obtener los datos del usuario con el ObjectId
    try:
        user_id = request.user_id
        print("Buscando usuario con ID:", user_id)
        
        user = collection.find_one({"_id": ObjectId(user_id)})
        
        # Imprimir si el usuario fue encontrado o no
        if not user:
            print("Usuario no encontrado.")
            return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
        
        # Imprimir los datos del usuario obtenidos
        print("Datos del usuario:", user)

        user_data = {
            "nombre_usuario": user["nombre_usuario"],
            "email": user["email"],
            "avatar": user["avatar"],
            "edad": user["edad"],
            "progreso": user["progreso"],
            "logros": user["logros"]
        }

        return jsonify({"success": True, "user": user_data}), 200
    
    except Exception as e:
        # En caso de error, imprimir el mensaje de error
        print("Error al procesar la solicitud:", e)
        return jsonify({"success": False, "message": "Error al procesar la solicitud"}), 500


@app.route('/get_levels', methods=['GET'])
def get_levels():
    try:
        levels = []
        # Obtener todos los documentos de la colección levels
        levels_cursor = levels_collection.find()  # Obtener todos los niveles

        for level in levels_cursor:
            # Convertir ObjectId a string
            level['_id'] = str(level['_id'])

            # Inicializar la estructura del nivel
            level_data = {
                "nombre_nivel": level['nombre_nivel'],
                "dificultad": level['dificultad'],
                "estado": level['estado'],
                "contenido": []  # Contendrá las letras con los puntos
            }

            # Buscar las letras en la colección alphabet
            for letra in level.get('contenido', []):  # Iterar sobre las letras en el contenido
                letra_data = glosary_collection.find_one({"letra": letra})  # Buscar la letra en glosary_db
                if letra_data:
                    # Agregar la letra y los puntos al contenido
                    level_data['contenido'].append({
                        "letra": letra,
                        "puntos": letra_data.get('puntos', [])  # Asegurar que existan puntos
                    })

            # Agregar el nivel completo a la lista de niveles
            levels.append(level_data)

        return jsonify({"levels": levels}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/play_level/<level_id>', methods=['POST'])
@token_required
def play_level(level_id):
    try:
        # Obtener usuario
        user = collection.find_one({"_id": ObjectId(request.user_id)})
        if not user:
            return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

        # Verificar si tiene vidas
        if user["vidas"] <= 0:
            return jsonify({"success": False, "message": "Sin vidas disponibles"}), 403

        # Obtener el nivel
        level = levels_collection.find_one({"_id": ObjectId(level_id)})
        if not level:
            return jsonify({"success": False, "message": "Nivel no encontrado"}), 404

        if level["estado"] != "activo":
            return jsonify({"success": False, "message": "El nivel no está activo"}), 403

        # Resta una vida y guarda
        collection.update_one(
            {"_id": ObjectId(request.user_id)},
            {"$inc": {"vidas": -1}}
        )
        return jsonify({"success": True, "message": "Comienza el nivel"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host='http://192.168.137.232', port=5000, debug=True)
