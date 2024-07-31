from flask import Flask
from models import db, Booking, Itinerary, TravelJournal, Activity, User
import random
from flask import  request, jsonify
from flask_migrate import Migrate
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required,  get_jwt
from datetime import timedelta
from flask_cors import CORS
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app  = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh"+str(random.randint(1,1000000000000)) 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV"+str(random.randint(1,1000000000000))


bcrypt = Bcrypt(app)
jwt = JWTManager(app)

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

@app.route("/")
def index():
    return "<h1>Travel Agency</h1>"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 409

    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')


    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token":access_token})

    else:
        return jsonify({"message":"Invalid email or password"}), 401


@app.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id =  get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user:
        return jsonify({"id":current_user.id, "name":current_user.name, "email":current_user.email}), 200
    else:
        jsonify({"error":"User not found"}), 404


BLACKLIST = set()
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success":"Successfully logged out"}), 200





@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'], password=bcrypt.generate_password_hash( data['password'] ).decode("utf-8") ) 
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': 'User created successfully'}), 201


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'id': user.id, 'name': user.name, 'email': user.email})


@app.route('/users/<int:user_id>', methods=['PUT'])

def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    user.name = data['name']
    user.email = data['email']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})
@app.route('/itineraries', methods=['POST'])
@jwt_required()
def create_itinerary():
    data = request.get_json()
    current_user = get_jwt_identity()
    new_itinerary = Itinerary(name=data['name'], description=data['description'], start_date=data['start_date'], end_date=data['end_date'], user_id=current_user['id'])
    db.session.add(new_itinerary)
    db.session.commit()
    return jsonify({'message': 'Itinerary created successfully'}), 201

@app.route('/itineraries/<int:id>', methods=['PUT'])
@jwt_required()
def update_itinerary(id):
    data = request.get_json()
    itinerary = Itinerary.query.get_or_404(id)
    itinerary.name = data['name']
    itinerary.description = data['description']
    itinerary.start_date = data['start_date']
    itinerary.end_date = data['end_date']
    db.session.commit()
    return jsonify({'message': 'Itinerary updated successfully'}), 200

@app.route('/itineraries/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_itinerary(id):
    itinerary = Itinerary.query.get_or_404(id)
    db.session.delete(itinerary)
    db.session.commit()
    return jsonify({'message': 'Itinerary deleted successfully'}), 200

@app.route('/itineraries/<int:id>', methods=['GET'])
@jwt_required()
def get_itinerary(id):
    itinerary = Itinerary.query.get_or_404(id)
    return jsonify({
        'id': itinerary.id,
        'name': itinerary.name,
        'description': itinerary.description,
        'start_date': itinerary.start_date,
        'end_date': itinerary.end_date,
        'activities': [{'id': a.id, 'name': a.name, 'description': a.description, 'date': a.date, 'time': a.time} for a in itinerary.activities]
    }), 200

@app.route('/itineraries/<int:id>/activities', methods=['POST'])
@jwt_required()
def add_activity_to_itinerary(id):
    data = request.get_json()
    new_activity = Activity(name=data['name'], description=data['description'], date=data['date'], time=data['time'], itinerary_id=id)
    db.session.add(new_activity)
    db.session.commit()
    return jsonify({'message': 'Activity added to itinerary successfully'}), 201

@app.route('/bookings', methods=['POST'])
@jwt_required()
def add_booking():
    data = request.get_json()
    new_booking = Booking(itinerary_id=data['itinerary_id'], activity_id=data['activity_id'], booking_details=data['booking_details'])
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({'message': 'Booking added successfully'}), 201

@app.route('/bookings/<int:id>', methods=['PUT'])
@jwt_required()
def update_booking(id):
    data = request.get_json()
    booking = Booking.query.get_or_404(id)
    booking.booking_details = data['booking_details']
    db.session.commit()
    return jsonify({'message': 'Booking updated successfully'}), 200

@app.route('/bookings/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_booking(id):
    booking = Booking.query.get_or_404(id)
    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted successfully'}), 200

@app.route('/bookings/<int:id>', methods=['GET'])
@jwt_required()
def get_booking(id):
    booking = Booking.query.get_or_404(id)
    return jsonify({
        'id': booking.id,
        'itinerary_id': booking.itinerary_id,
        'activity_id': booking.activity_id,
        'booking_details': booking.booking_details
    }), 200
    
@app.route('/journals', methods=['POST'])
@jwt_required()
def create_journal_entry():
    data = request.get_json()
    current_user = get_jwt_identity()
    new_entry = TravelJournal(title=data['title'], content=data['content'], user_id=current_user['id'])
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Journal entry created successfully'}), 201

@app.route('/journals/<int:id>', methods=['PUT'])
@jwt_required()
def update_journal_entry(id):
    data = request.get_json()
    entry = TravelJournal.query.get_or_404(id)
    entry.title = data['title']
    entry.content = data['content']
    db.session.commit()
    return jsonify({'message': 'Journal entry updated successfully'}), 200

@app.route('/journals/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_journal_entry(id):
    entry = TravelJournal.query.get_or_404(id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'message': 'Journal entry deleted successfully'}), 200

@app.route('/journals/<int:id>', methods=['GET'])
@jwt_required()
def get_journal_entry(id):
    entry = TravelJournal.query.get_or_404(id)
    return jsonify({
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'date': entry.date
    }), 200

@app.route('/journals/share/<int:id>', methods=['POST'])
@jwt_required()
def share_journal_entry(id):
    data = request.get_json()
    entry = TravelJournal.query.get_or_404(id)
    users = User.query.filter(User.id.in_(data['shared_with'])).all()
    entry.shared_with.extend(users)
    db.session.commit()
    return jsonify({'message': 'Journal entry shared successfully'}), 200

@app.route('/journals/shared', methods=['GET'])
@jwt_required()
def get_shared_journals():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user['id']).first()
    shared_entries = user.shared_journals

    return jsonify([{
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'date': entry.date,
        'user': entry.user.username
    } for entry in shared_entries]), 200
    
if __name__ == "__main__":
    app.run(port=5555, debug=True)