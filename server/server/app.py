import logging
from flask import Flask, request, jsonify
from models import db, Booking, Itinerary, TravelJournal, Activity, User
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import timedelta, datetime
from flask_cors import CORS
import random
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL") 
# postgresql://travelplanner_user:XSz0k8ty5Bjh98CFMNefbTGCwAfzQBt9@dpg-cqoho2tsvqrc73fh8m10-a/travelplanner
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh" + str(random.randint(1, 1000000000000)) 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1) 
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV" + str(random.randint(1, 1000000000000)) 


bcrypt = Bcrypt(app)
jwt = JWTManager(app)

migrate = Migrate(app, db)
db.init_app(app)

log_formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')

file_handler = logging.FileHandler("app.log")
file_handler.setFormatter(log_formatter)
file_handler.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setFormatter(log_formatter)
console_handler.setLevel(logging.INFO)

app.logger.addHandler(file_handler)
app.logger.addHandler(console_handler)
app.logger.setLevel(logging.INFO)

app.logger.info('App startup')


@app.route("/")
def index():
    app.logger.info('Index page accessed')
    return "<h1>Travel Agency</h1>"

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        app.logger.info(f'User {email} logged in successfully')
        return jsonify({"access_token": access_token})

    else:
        app.logger.warning(f'Failed login attempt for {email}')
        return jsonify({"message": "Invalid email or password"}), 401

@app.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user:
        app.logger.info(f'Current user {current_user.email} fetched')
        return jsonify({"id": current_user.id, "username": current_user.username, "email": current_user.email}), 200
    app.logger.warning('User not found')
    return jsonify({"error": "User not found"}), 404

BLACKLIST = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    app.logger.info('User logged out')
    return jsonify({"success": "Successfully logged out"}), 200

@app.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'], password=bcrypt.generate_password_hash(data['password']).decode("utf-8"))
    db.session.add(new_user)
    db.session.commit()
    app.logger.info(f'User {new_user.email} created successfully')
    return jsonify({'success': 'User created successfully'}), 201

@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    app.logger.info('Fetched all users')
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email
    } for user in users]), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    app.logger.info(f'User {user.email} fetched')
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email})

@app.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode("utf-8")

    db.session.commit()
    app.logger.info(f'User {user.email} updated successfully')
    return jsonify({'message': 'User updated successfully'})

@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    app.logger.info(f'User {user.email} deleted')
    return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/itineraries', methods=['POST'])
@jwt_required()
def create_itinerary():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    try:
        start_date = datetime.fromisoformat(data['start_date'])
    except ValueError:
        app.logger.warning('Invalid start_date format')
        return jsonify({'message': 'Invalid start_date format. Use ISO 8601 format.'}), 400
    
    try:
        end_date = datetime.fromisoformat(data['end_date'])
    except ValueError:
        app.logger.warning('Invalid end_date format')
        return jsonify({'message': 'Invalid end_date format. Use ISO 8601 format.'}), 400

    new_itinerary = Itinerary(
        name=data['name'],
        description=data['description'],
        start_date=start_date,
        end_date=end_date,
        user_id=current_user_id
    )

    db.session.add(new_itinerary)
    db.session.commit()
    app.logger.info(f'Itinerary {new_itinerary.name} created successfully')
    return jsonify({'message': 'Itinerary created successfully'}), 201

@app.route('/itineraries', methods=['GET'])
@jwt_required()
def get_all_itineraries():
    current_user_id = get_jwt_identity()
    itineraries = Itinerary.query.filter_by(user_id=current_user_id).all()
    app.logger.info('Fetched all itineraries')
    return jsonify([
        {
            'id': itinerary.id,
            'name': itinerary.name,
            'description': itinerary.description,
            'start_date': itinerary.start_date.isoformat(),
            'end_date': itinerary.end_date.isoformat(),
            'activities': [
                {
                    'id': activity.id,
                    'name': activity.name,
                    'description': activity.description,
                    'datetime': activity.datetime.isoformat() if activity.datetime else None
                }
                for activity in itinerary.activities
            ]
        }
        for itinerary in itineraries
    ]), 200


@app.route('/itineraries/<int:id>', methods=['PUT'])
@jwt_required()
def update_itinerary(id):
    data = request.get_json()
    itinerary = Itinerary.query.get_or_404(id)

    itinerary.name = data.get('name', itinerary.name)
    itinerary.description = data.get('description', itinerary.description)
    try:
        itinerary.start_date = datetime.fromisoformat(data.get('start_date', itinerary.start_date.isoformat()))
        itinerary.end_date = datetime.fromisoformat(data.get('end_date', itinerary.end_date.isoformat()))
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use ISO 8601 format.'}), 400

    db.session.commit()
    app.logger.info(f'Itinerary {itinerary.name} updated successfully')
    return jsonify({'message': 'Itinerary updated successfully'}), 200

@app.route('/itineraries/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_itinerary(id):
    itinerary = Itinerary.query.get_or_404(id)
    db.session.delete(itinerary)
    db.session.commit()
    app.logger.info(f'Itinerary {itinerary.name} deleted')
    return jsonify({'message': 'Itinerary deleted successfully'}), 200

@app.route('/itineraries/<int:id>', methods=['GET'])
def get_itinerary(id):
    itinerary = Itinerary.query.get_or_404(id)
    app.logger.info(f'Itinerary {itinerary.name} fetched')
    return jsonify({
        'id': itinerary.id,
        'name': itinerary.name,
        'description': itinerary.description,
        'start_date': itinerary.start_date.isoformat(),
        'end_date': itinerary.end_date.isoformat(),
        'activities': [{
            'id': a.id,
            'name': a.name,
            'description': a.description,
            'datetime': a.datetime.isoformat() if a.datetime else None
        } for a in itinerary.activities]
    }), 200

@app.route('/itineraries/<int:id>/activities', methods=['POST'])
@jwt_required()
def add_activity_to_itinerary(id):
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ("name", "description", "date", "time")):
            return jsonify({'message': 'Invalid data'}), 400

        date_time_str = f"{data['date']} {data['time']}"
        try:
            date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M')
        except ValueError:
            return jsonify({'message': 'Invalid datetime format. Use YYYY-MM-DD HH:MM format.'}), 400

        new_activity = Activity(
            name=data['name'], 
            description=data.get('description'), 
            datetime=date_time_obj, 
            itinerary_id=id
        )
        db.session.add(new_activity)
        db.session.commit()
        return jsonify({'message': 'Activity added to itinerary successfully'}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error adding activity: {e}")
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500




@app.route('/bookings', methods=['POST'])
@jwt_required()
def add_booking():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_booking = Booking(itinerary_id=data['itinerary_id'], activity_id=data['activity_id'], booking_details=data['booking_details'])
    db.session.add(new_booking)
    db.session.commit()
    app.logger.info(f'Booking created for user {current_user_id}')
    return jsonify({'message': 'Booking added successfully'}), 201


@app.route('/bookings/<int:id>', methods=['GET'])

def get_booking(id):
    booking = Booking.query.get_or_404(id)
    app.logger.info(f'Fetched booking {id}')
    return jsonify({
        'id': booking.id,
        'itinerary_id': booking.itinerary_id,
        'activity_id': booking.activity_id,
        'booking_details': booking.booking_details
    }), 200

@app.route('/bookings', methods=['GET'])
@jwt_required()
def get_all_bookings():
    # current_user_id = get_jwt_identity()
    bookings = Booking.query.all()
    app.logger.info(f'Fetched all bookings')
    return jsonify([{
        'id': booking.id,
        'itinerary_id': booking.itinerary_id,
        'activity_id': booking.activity_id,
        'booking_details': booking.booking_details
    } for booking in bookings]), 200

@app.route('/bookings/<int:id>', methods=['PUT'])
@jwt_required()
def update_booking(id):
    data = request.get_json()
    booking = Booking.query.get_or_404(id)
    
    original_booking = {
        'itinerary_id': booking.itinerary_id,
        'activity_id': booking.activity_id,
        'booking_details': booking.booking_details
    }

    booking.itinerary_id = data.get('itinerary_id', booking.itinerary_id)
    booking.activity_id = data.get('activity_id', booking.activity_id)
    booking.booking_details = data.get('booking_details', booking.booking_details)

    try:
        db.session.commit()
        updated_booking = {
            'itinerary_id': booking.itinerary_id,
            'activity_id': booking.activity_id,
            'booking_details': booking.booking_details
        }
        app.logger.info(f'Booking {id} updated from {original_booking} to {updated_booking}')
        return jsonify({'message': 'Booking updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f'Error updating booking {id}: {e}')
        return jsonify({'message': 'Error updating booking'}), 500


@app.route('/bookings/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_booking(id):
    booking = Booking.query.get_or_404(id)
    db.session.delete(booking)
    db.session.commit()
    app.logger.info(f'Booking {id} deleted')
    return jsonify({'message': 'Booking deleted successfully'}), 200

@app.route('/journals', methods=['POST'])
@jwt_required()
def create_journal_entry():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    try:
        entry_date = datetime.fromisoformat(data['entry_date'])
    except ValueError:
        app.logger.warning('Invalid date format')
        return jsonify({'message': 'Invalid entry_date format. Use ISO 8601 format.'}), 400

    new_journal = TravelJournal(
        title=data['title'],
        content=data['content'],
        entry_date=entry_date,
        user_id=current_user_id
    )
    db.session.add(new_journal)
    db.session.commit()
    app.logger.info(f'Travel journal {new_journal.title} created successfully')
    return jsonify({'message': 'Journal entry created successfully'}), 201

@app.route('/journals', methods=['GET'])
@jwt_required()
def get_all_journal_entries():
    current_user_id = get_jwt_identity()
    journal_entries = TravelJournal.query.filter_by(user_id=current_user_id).all()
    app.logger.info('Fetched all travel journals')
    return jsonify([{
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'entry_date': entry.entry_date.isoformat()
    } for entry in journal_entries]), 200

@app.route('/journals/<int:id>', methods=['PUT'])
@jwt_required()
def update_journal_entry(id):
    data = request.get_json()
    entry = TravelJournal.query.get_or_404(id)

    entry.title = data.get('title', entry.title)
    entry.content = data.get('content', entry.content)
    try:
        entry.entry_date = datetime.fromisoformat(data.get('entry_date', entry.entry_date.isoformat()))
    except ValueError:
        app.logger.warning('Invalid date format')
        return jsonify({'message': 'Invalid entry_date format. Use ISO 8601 format.'}), 400

    db.session.commit()
    app.logger.info(f'Travel journal  updated successfully')
    return jsonify({'message': 'Journal entry updated successfully'}), 200

@app.route('/journals/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_journal_entry(id):
    entry = TravelJournal.query.get_or_404(id)
    db.session.delete(entry)
    db.session.commit()
    app.logger.info(f'Travel journal deleted')
    return jsonify({'message': 'Journal entry deleted successfully'}), 200

@app.route('/journals/share/<int:id>', methods=['POST'])
def share_journal_entry(id):
    data = request.get_json()
    entry = TravelJournal.query.get_or_404(id)
    users = User.query.all()
    entry.shared_with.extend(users)
    db.session.commit()
    
    app.logger.info(f'Travel journal created successfully')
    return jsonify({'message': 'Journal entry shared successfully'}), 200

@app.route('/journals/shared', methods=['GET'])
@jwt_required()
def get_shared_journals():
    current_user_id= get_jwt_identity()
    user = User.query.get_or_404(current_user_id)  
    # user = User.query.first()
    shared_entries = user.shared_journals  

    return jsonify([{
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'entry_date': entry.date.isoformat(),
        'user': entry.user.username
    } for entry in shared_entries]), 200

if __name__ == "__main__":
    app.run(port=5555, debug=True)