from app import app, db
from models import User, Itinerary, Activity, Booking, TravelJournal
from datetime import datetime, timedelta
import random

def populate_db():
    with app.app_context():
        
        db.drop_all()
        db.create_all()

        
        users = [
            User(username="Alice Johnson", email="alice@example.com", password="password"),
            User(username="Bob Smith", email="bob@example.com", password="password"),
            User(username="Charlie Brown", email="charlie@example.com", password="password"),
            User(username="David Clark", email="david@example.com", password="password"),
            User(username="Eve Turner", email="eve@example.com", password="password"),
            User(username="Frank Moore", email="frank@example.com", password="password"),
            User(username="Grace Lee", email="grace@example.com", password="password"),
            User(username="Hank Walker", email="hank@example.com", password="password"),
            User(username="Ivy Harris", email="ivy@example.com", password="password"),
            User(username="Jack Wright", email="jack@example.com", password="password"),
            User(username="Kara Hall", email="kara@example.com", password="password"),
            User(username="Leo Scott", email="leo@example.com", password="password"),
            User(username="Mia Green", email="mia@example.com", password="password"),
            User(username="Nina Adams", email="nina@example.com", password="password"),
            User(username="Oscar Nelson", email="oscar@example.com", password="password")
        ]

        db.session.add_all(users)
        db.session.commit()

        
        itineraries = []
        for i in range(10):
            start_date = datetime.now().date() + timedelta(days=random.randint(1, 10))
            end_date = start_date + timedelta(days=random.randint(1, 10))
            itinerary = Itinerary(
                name=f"Itinerary {i+1}",
                description=f"Description for itinerary {i+1}",
                start_date=start_date,
                end_date=end_date,
                user_id=random.choice(users).id
            )
            itineraries.append(itinerary)

        db.session.add_all(itineraries)
        db.session.commit()

        
        activities = []
        for i in range(20):
            activity_date = datetime.now().date() + timedelta(days=random.randint(1, 30))
            activity_time = datetime.strptime(f"{random.randint(8, 17)}:{random.randint(0, 59)}:00", "%H:%M:%S").time()
            activity = Activity(
                name=f"Activity {i+1}",
                description=f"Description for activity {i+1}",
                date=activity_date,
                time=activity_time,
                itinerary_id=random.choice(itineraries).id
            )
            activities.append(activity)

        db.session.add_all(activities)
        db.session.commit()

        
        bookings = []
        for i in range(10):
            booking = Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details=f"Booking details for booking {i+1}"
            )
            bookings.append(booking)

        db.session.add_all(bookings)
        db.session.commit()

        
        journals = []
        for i in range(5):
            journal = TravelJournal(
                title=f"Journal Entry {i+1}",
                content=f"Content for journal entry {i+1}",
                user_id=random.choice(users).id
            )
            journals.append(journal)

        db.session.add_all(journals)
        db.session.commit()

        
        for journal in journals:
            shared_users = random.sample(users, k=min(len(users), random.randint(1, 5)))
            journal.shared_with.extend(shared_users)
            db.session.commit()

        print("Database populated successfully!")

if __name__ == "__main__":
    populate_db()