from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    
    itineraries = db.relationship('Itinerary', backref='user', lazy=True, cascade='all, delete-orphan')
    travel_journals = db.relationship('TravelJournal', backref='user', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='user', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('Like', backref='user', lazy=True, cascade='all, delete-orphan')

    serialize_rules = ('-password',)  
    
    @validates('username')
    def validate_username(self, key, username):
        assert len(username) >= 5, "Username must be at least 5 characters long"
        return username

    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email and '.' in email, "Invalid email address"
        return email

    @validates('password')
    def validate_password(self, key, password):
        assert len(password) >= 6, "Password must be at least 6 characters long"
        return password
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

class Itinerary(db.Model, SerializerMixin):
    __tablename__ = 'itineraries'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())
    
    activities = db.relationship('Activity', backref='itinerary', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='itinerary', lazy=True, cascade='all, delete-orphan')
    
    serialize_rules = ('-user.password',) 

    @validates('name')
    def validate_name(self, key, name):
        assert len(name) > 0, "Name cannot be empty"
        return name

    @validates('start_date', 'end_date')
    def validate_dates(self, key, date):
        assert isinstance(date, datetime), f"{key} must be a valid datetime"
        return date
    
    def __repr__(self):
        return f"<Itinerary(id={self.id}, name='{self.name}', start_date='{self.start_date}', end_date='{self.end_date}')>"

class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    datetime = db.Column(db.DateTime, nullable=False)  
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=False)
    
    serialize_rules = ('-itinerary.bookings',)
    
    @validates('name')
    def validate_name(self, key, name):
        assert len(name) > 0, "Name cannot be empty"
        return name

    @validates('datetime')
    def validate_datetime(self, key, datetime_value):
        assert isinstance(datetime_value, datetime), "Datetime must be a valid datetime"
        return datetime_value

    def __repr__(self):
        return f"<Activity(id={self.id}, name='{self.name}', datetime='{self.datetime.isoformat()}')>"

class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    booking_details = db.Column(db.String(200))
    
    serialize_rules = ('-itinerary.activities', '-activity',)  
    
    @validates('booking_details')
    def validate_booking_details(self, key, booking_details):
        assert len(booking_details) > 0, "Booking details cannot be empty"
        return booking_details
    
    def __repr__(self):
        return f"<Booking(id={self.id}, itinerary_id={self.itinerary_id}, activity_id={self.activity_id}, booking_details='{self.booking_details}')>"

class TravelJournal(db.Model, SerializerMixin):
    __tablename__ = 'traveljournals'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    entry_date = db.Column(db.Date, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())
    
    shared_with = db.relationship('User', secondary='journal_shares', backref='shared_journals')
    comments = db.relationship('Comment', backref='travel_journal', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('Like', backref='travel_journal', lazy=True, cascade='all, delete-orphan')
    images = db.relationship('Image', backref='travel_journal', lazy=True, cascade='all, delete-orphan')
    
    serialize_rules = ('-user.password',) 
    
    @validates('title')
    def validate_title(self, key, title):
        assert len(title) > 0, "Title cannot be empty"
        return title

    @validates('content')
    def validate_content(self, key, content):
        assert len(content) > 0, "Content cannot be empty"
        return content
    
    def __repr__(self):
        return f"<TravelJournal(id={self.id}, title='{self.title}', date='{self.entry_date}')>"

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    travel_journal_id = db.Column(db.Integer, db.ForeignKey('traveljournals.id'))
    
    serialize_rules = ('-user.password',)
    
    @validates('content')
    def validate_content(self, key, content):
        assert len(content) > 0, "Content cannot be empty"
        return content
    
    def __repr__(self):
        return f"<Comment(id={self.id}, content='{self.content}')>"

class Like(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    travel_journal_id = db.Column(db.Integer, db.ForeignKey('traveljournals.id'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    activity = db.relationship('Activity', backref='likes')
    
    def __repr__(self):
        return f"<Like(user_id={self.user_id}, travel_journal_id={self.travel_journal_id})>"

class Image(db.Model, SerializerMixin):
    __tablename__ = 'images'
    
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(255), nullable=False)  
    description = db.Column(db.String(200))  
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    travel_journal_id = db.Column(db.Integer, db.ForeignKey('traveljournals.id'))
    
    
    serialize_rules = ('-travel_journal',)
    
    @validates('file_path')
    def validate_file_path(self, key, file_path):
        assert len(file_path) > 0, "File path cannot be empty"
        return file_path
    
    def __repr__(self):
        return f"<Image(id={self.id}, file_path='{self.file_path}')>"

journal_shares = db.Table('journal_shares',
    db.Column('journal_id', db.Integer, db.ForeignKey('traveljournals.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)
