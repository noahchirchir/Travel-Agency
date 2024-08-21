import logging
from flask import Flask, request, jsonify
from server.models import db, Booking, Itinerary, TravelJournal, Activity, User, Image, Like, Comment
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import timedelta, datetime
from flask_cors import CORS
from werkzeug.utils import secure_filename
import random
import os
from dotenv import load_dotenv


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
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

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
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
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

    
    activities = data.get('activities', [])
    for activity in activities:
        try:
            date_time_str = f"{activity['date']} {activity['time']}"
            date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M')
        except (ValueError, KeyError):
            app.logger.warning('Invalid activity datetime format')
            return jsonify({'message': 'Invalid activity datetime format. Use YYYY-MM-DD HH:MM format.'}), 400
        
        new_activity = Activity(
            name=activity['name'], 
            description=activity.get('description'), 
            datetime=date_time_obj, 
            itinerary=new_itinerary
        )
        db.session.add(new_activity)

    db.session.add(new_itinerary)
    db.session.commit()
    app.logger.info(f'Itinerary {new_itinerary.name} created successfully with activities')
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
    
@app.route('/journals/<int:id>', methods=['GET'])
@jwt_required()
def get_journal_entry(id):
    current_user_id = get_jwt_identity()
    entry = TravelJournal.query.get(id)

    if not entry:
        app.logger.warning(f'Journal entry {id} not found')
        return jsonify({'message': 'Journal entry not found'}), 404

    app.logger.info(f'Current user ID: {current_user_id}')
    app.logger.info(f'Entry user ID: {entry.user_id}')
    app.logger.info(f'Entry shared with users: {[user.id for user in User.query.get(current_user_id).shared_journals]}')

    if entry.user_id != current_user_id and entry not in User.query.get(current_user_id).shared_journals:
        app.logger.warning(f'Unauthorized access attempt to journal entry {id}')
        return jsonify({'message': 'Access denied'}), 403

    app.logger.info(f'Fetched journal entry {id}')
    return jsonify({
        'id': entry.id,
        'title': entry.title,
        'content': entry.content,
        'entry_date': entry.entry_date.isoformat()
    }), 200



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

@app.route('/comments', methods=['GET'])
@jwt_required()
def get_all_comments():
    try:
        comments = Comment.query.all()
        app.logger.info('Fetched all comments')
        return jsonify([
            {
                'id': comment.id,
                'content': comment.content,
                'user_id': comment.user_id,
                'created_at': comment.created_at.isoformat()
            }
            for comment in comments
        ]), 200
    except Exception as e:
        app.logger.error(f'Error fetching comments: {e}')
        return jsonify({'message': 'Failed to fetch comments'}), 500

@app.route('/comments/<int:id>', methods=['GET'])
@jwt_required()
def get_comment(id):
    comment = Comment.query.get_or_404(id)
    app.logger.info(f'Fetched comment {id}')
    return jsonify({
        'id': comment.id,
        'content': comment.content,
        'user_id': comment.user_id,
        'created_at': comment.created_at.isoformat()
    }), 200


@app.route('/comments', methods=['POST'])
@jwt_required()
def create_comment():
    data = request.get_json()
    new_comment = Comment(
        content=data['content'],
        user_id=get_jwt_identity(),
        
    )
    db.session.add(new_comment)
    db.session.commit()
    app.logger.info(f'Comment by user {get_jwt_identity()} created')
    return jsonify({'message': 'Comment created successfully'}), 201

@app.route('/comments/<int:id>', methods=['PUT'])
@jwt_required()
def update_comment(id):
    data = request.get_json()
    comment = Comment.query.get_or_404(id)
    if comment.user_id != get_jwt_identity():
        return jsonify({'message': 'Permission denied'}), 403
    comment.content = data.get('content', comment.content)
    db.session.commit()
    app.logger.info(f'Comment {id} updated successfully')
    return jsonify({'message': 'Comment updated successfully'}), 200

@app.route('/comments/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_comment(id):
    comment = Comment.query.get_or_404(id)
    if comment.user_id != get_jwt_identity():
        return jsonify({'message': 'Permission denied'}), 403
    db.session.delete(comment)
    db.session.commit()
    app.logger.info(f'Comment {id} deleted successfully')
    return jsonify({'message': 'Comment deleted successfully'}), 200

# @app.route('/likes', methods=['GET'])
# @jwt_required()
# def get_all_likes():
#     likes = Like.query.all()
#     app.logger.info('Fetched all likes')
#     return jsonify([
#         {
#             'id': like.id,
#             'user_id': like.user_id,
#             'activity_id': like.activity_id,
#             'created_at': like.created_at.isoformat()
#         }
#         for like in likes
#     ]), 200

@app.route('/likes', methods=['GET'])
def get_likes():
    try:
        # Example: Filtering likes by user or activity, if needed
        user_id = request.args.get('user_id')
        activity_id = request.args.get('activity_id')

        if user_id and activity_id:
            likes = Like.query.filter_by(user_id=user_id, activity_id=activity_id).all()
        elif user_id:
            likes = Like.query.filter_by(user_id=user_id).all()
        elif activity_id:
            likes = Like.query.filter_by(activity_id=activity_id).all()
        else:
            likes = Like.query.all()

        like_list = [like.to_dict() for like in likes]

        return jsonify(like_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/likes/<int:id>', methods=['GET'])
@jwt_required()
def get_like(id):
    like = Like.query.get_or_404(id)
    app.logger.info(f'Fetched like {id}')
    return jsonify({
        'id': like.id,
        'user_id': like.user_id,
        'activity_id': like.activity_id,
        'created_at': like.created_at.isoformat()
    }), 200

@app.route('/likes', methods=['POST'])
@jwt_required()
def add_like():
    current_user = get_jwt_identity()
    data = request.get_json()
    activity_id = data.get('activity_id')

    if not activity_id:
        return jsonify({'message': 'Activity ID is required'}), 400
    existing_like = Like.query.filter_by(user_id=current_user['id'], activity_id=activity_id).first()
    if existing_like:
        return jsonify({'message': 'You have already liked this activity'}), 400
    new_like = Like(user_id=current_user['id'], activity_id=activity_id)
    db.session.add(new_like)
    db.session.commit()

    app.logger.info(f'User {current_user["id"]} liked activity {activity_id}')
    return jsonify({
        'id': new_like.id,
        'user_id': new_like.user_id,
        'activity_id': new_like.activity_id,
        'created_at': new_like.created_at.isoformat()
    }), 201

@app.route('/likes', methods=['POST'])
@jwt_required()
def create_like():
    current_user = get_jwt_identity()
    data = request.get_json()
    activity_id = data.get('activity_id')

    if not activity_id:
        return jsonify({"msg": "Activity ID is required"}), 400

    # Check if the activity exists
    activity = Activity.query.get(activity_id)
    if not activity:
        return jsonify({"msg": "Activity not found"}), 404

    # Check if the like already exists
    existing_like = Like.query.filter_by(user_id=current_user['id'], activity_id=activity_id).first()
    if existing_like:
        return jsonify({"msg": "You have already liked this activity"}), 400

    # Create and save the new like
    new_like = Like(user_id=current_user['id'], activity_id=activity_id)
    db.session.add(new_like)
    db.session.commit()

    return jsonify({"msg": "Like created"}), 201

@app.route('/likes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_like(id):
    like = Like.query.get_or_404(id)
    if like.user_id != get_jwt_identity():
        return jsonify({'message': 'Permission denied'}), 403
    db.session.delete(like)
    db.session.commit()
    app.logger.info(f'Like {id} removed successfully')
    return jsonify({'message': 'Like removed successfully'}), 200


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
    
@app.route('/activities', methods=['GET'])
@jwt_required()
def get_all_activities():
    try:
        activities = Activity.query.all()
        activities_list = [{
            'id': activity.id,
            'name': activity.name
        } for activity in activities]
        
        app.logger.info('Fetched all activities successfully')
        return jsonify(activities_list), 200
    except Exception as e:
        app.logger.error(f'Error fetching activities: {e}')
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
    
@app.route('/uploads', methods=['GET'])
def get_images():
    try:
        travel_journal_id = request.args.get('travel_journal_id')
        if travel_journal_id:
            images = Image.query.filter_by(travel_journal_id=travel_journal_id).all()
        else:
            images = Image.query.all()

        image_list = [image.to_dict() for image in images]

        return jsonify(image_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/uploads/<int:id>', methods=['GET'])
def get_image_by_id(id):
    try:
        image = Image.query.get_or_404(id) 
        return jsonify(image.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

@app.route('/uploads', methods=['POST'])
@jwt_required()
def upload_image():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        new_image = Image(file_path=file_path)
        db.session.add(new_image)
        db.session.commit()
        app.logger.info(f'Image {filename} uploaded successfully by user {get_jwt_identity()}')
        return jsonify({'message': 'Image uploaded successfully'}), 201
    return jsonify({'message': 'Invalid file type'}), 400

@app.route('/uploads/<int:id>', methods=['GET'])
@jwt_required()  
def get_upload_by_id(id):
    upload = Image.query.get(id)
    
    if not upload:
        return jsonify({"error": "Upload not found"}), 404

    return jsonify({
        "id": upload.id,
        "filename": upload.filename,
        "uploaded_at": upload.uploaded_at,
    })


def allowed_file(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


if __name__ == "__main__":
    app.run(port=5555, debug=True)