from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    
    
    itineraries = db.relationship('Itinerary', backref='user', lazy=True)
    travel_journals = db.relationship('TravelJournal', backref='user', lazy=True)
    
    
    serialize_rules = ('-password',)  

class Itinerary(db.Model, SerializerMixin):
    __tablename__ = 'itineraries'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())
    
    
    activities = db.relationship('Activity', backref='itinerary', lazy=True)
    bookings = db.relationship('Booking', backref='itinerary', lazy=True)
    
    
    serialize_rules = ('-user.password',) 

class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())
    
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=False)
    
    
    serialize_rules = ('-itinerary.bookings',) 

class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    booking_details = db.Column(db.String(200))
    
    
    serialize_rules = ('-itinerary.activities', '-activity',)  

class TravelJournal(db.Model, SerializerMixin):
    __tablename__ = 'traveljournals'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())
    
    
    shared_with = db.relationship('User', secondary='journal_shares', backref='shared_journals')
    
    
    serialize_rules = ('-user.password',) 

journal_shares = db.Table('journal_shares',
    db.Column('journal_id', db.Integer, db.ForeignKey('traveljournals.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)
