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

        itineraries = [
            Itinerary(
                name="Nairobi Safari Adventure",
                description="A 3-day safari exploring Nairobi National Park, the David Sheldrick Elephant Orphanage, and Giraffe Centre.",
                start_date=datetime.now().date() + timedelta(days=2),
                end_date=datetime.now().date() + timedelta(days=5),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Beach Getaway in Mombasa",
                description="Relaxing 5-day trip at Diani Beach with visits to Fort Jesus and Haller Park.",
                start_date=datetime.now().date() + timedelta(days=10),
                end_date=datetime.now().date() + timedelta(days=15),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Mount Kenya Trek",
                description="A challenging 4-day trek up Mount Kenya with stunning views and diverse wildlife.",
                start_date=datetime.now().date() + timedelta(days=20),
                end_date=datetime.now().date() + timedelta(days=24),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Lake Nakuru Adventure",
                description="A 3-day trip exploring the beautiful Lake Nakuru National Park and its flamingos.",
                start_date=datetime.now().date() + timedelta(days=30),
                end_date=datetime.now().date() + timedelta(days=33),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Maasai Mara Safari",
                description="A 4-day safari in Maasai Mara, experiencing the Great Migration and diverse wildlife.",
                start_date=datetime.now().date() + timedelta(days=40),
                end_date=datetime.now().date() + timedelta(days=44),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Lamu Island Retreat",
                description="A 5-day cultural and beach retreat on Lamu Island.",
                start_date=datetime.now().date() + timedelta(days=50),
                end_date=datetime.now().date() + timedelta(days=55),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Tsavo National Park Exploration",
                description="A 3-day trip to Tsavo East and West National Parks, known for its red elephants.",
                start_date=datetime.now().date() + timedelta(days=60),
                end_date=datetime.now().date() + timedelta(days=63),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Samburu Wildlife Safari",
                description="A 4-day safari in Samburu National Reserve, famous for its unique wildlife.",
                start_date=datetime.now().date() + timedelta(days=70),
                end_date=datetime.now().date() + timedelta(days=74),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Aberdare Mountains Adventure",
                description="A 3-day adventure in Aberdare National Park, with its waterfalls and diverse wildlife.",
                start_date=datetime.now().date() + timedelta(days=80),
                end_date=datetime.now().date() + timedelta(days=83),
                user_id=random.choice(users).id
            ),
            Itinerary(
                name="Malindi Coastal Experience",
                description="A 5-day coastal experience in Malindi, exploring its beaches and historic sites.",
                start_date=datetime.now().date() + timedelta(days=90),
                end_date=datetime.now().date() + timedelta(days=95),
                user_id=random.choice(users).id
            )
        ]

        db.session.add_all(itineraries)
        db.session.commit()

        activities = [
            Activity(
                name="Morning Game Drive",
                description="Explore Nairobi National Park and witness the Big Five in their natural habitat.",
                date=datetime.now().date() + timedelta(days=3),
                time=datetime.strptime("06:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Visit Elephant Orphanage",
                description="Learn about elephant conservation efforts and interact with baby elephants at the David Sheldrick Elephant Orphanage.",
                date=datetime.now().date() + timedelta(days=4),
                time=datetime.strptime("10:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Beach Relaxation",
                description="Spend a day relaxing at Diani Beach, enjoying the sun, sand, and sea.",
                date=datetime.now().date() + timedelta(days=12),
                time=datetime.strptime("09:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Mount Kenya Base Camp",
                description="Set up base camp and prepare for the ascent to the summit of Mount Kenya.",
                date=datetime.now().date() + timedelta(days=21),
                time=datetime.strptime("08:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Flamingo Watching",
                description="Observe thousands of flamingos at Lake Nakuru.",
                date=datetime.now().date() + timedelta(days=31),
                time=datetime.strptime("07:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Maasai Village Visit",
                description="Experience Maasai culture and traditions in a local village.",
                date=datetime.now().date() + timedelta(days=41),
                time=datetime.strptime("14:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Lamu Old Town Tour",
                description="Explore the historic sites of Lamu Old Town, a UNESCO World Heritage Site.",
                date=datetime.now().date() + timedelta(days=51),
                time=datetime.strptime("11:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Tsavo East Game Drive",
                description="Explore the vast wilderness of Tsavo East National Park.",
                date=datetime.now().date() + timedelta(days=61),
                time=datetime.strptime("15:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Samburu Sunset Safari",
                description="Enjoy a sunset safari in Samburu National Reserve.",
                date=datetime.now().date() + timedelta(days=71),
                time=datetime.strptime("18:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Aberdare Waterfall Hike",
                description="Hike to the stunning waterfalls in Aberdare National Park.",
                date=datetime.now().date() + timedelta(days=81),
                time=datetime.strptime("10:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Snorkeling in Malindi",
                description="Snorkel in the clear waters of Malindi Marine Park.",
                date=datetime.now().date() + timedelta(days=91),
                time=datetime.strptime("09:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Nairobi Museum Visit",
                description="Visit the National Museum of Kenya in Nairobi.",
                date=datetime.now().date() + timedelta(days=5),
                time=datetime.strptime("11:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Deep Sea Fishing",
                description="Experience deep sea fishing in the Indian Ocean.",
                date=datetime.now().date() + timedelta(days=16),
                time=datetime.strptime("07:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Coffee Farm Tour",
                description="Tour a coffee farm and learn about coffee production.",
                date=datetime.now().date() + timedelta(days=26),
                time=datetime.strptime("09:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Cycling in Hell's Gate",
                description="Cycle through Hell's Gate National Park.",
                date=datetime.now().date() + timedelta(days=36),
                time=datetime.strptime("08:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Hot Air Balloon Safari",
                description="Take a hot air balloon ride over the Maasai Mara.",
                date=datetime.now().date() + timedelta(days=46),
                time=datetime.strptime("06:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Giraffe Centre Visit",
                description="Feed and learn about giraffes at the Giraffe Centre in Nairobi.",
                date=datetime.now().date() + timedelta(days=6),
                time=datetime.strptime("12:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Scuba Diving in Watamu",
                description="Go scuba diving in the coral reefs of Watamu Marine Park.",
                date=datetime.now().date() + timedelta(days=17),
                time=datetime.strptime("10:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            ),
            Activity(
                name="Maasai Market Visit",
                description="Shop for souvenirs and local crafts at the Maasai Market.",
                date=datetime.now().date() + timedelta(days=27),
                time=datetime.strptime("14:00:00", "%H:%M:%S").time(),
                itinerary_id=random.choice(itineraries).id
            )
        ]

        db.session.add_all(activities)
        db.session.commit()

        bookings = [
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Nairobi National Park, Nairobi, Kenya. Hotel: The Boma Nairobi"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Diani Beach, Mombasa, Kenya. Hotel: Baobab Beach Resort & Spa"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Mount Kenya, Kenya. Hotel: Serena Mountain Lodge"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Lake Nakuru, Nakuru, Kenya. Hotel: Sarova Lion Hill Lodge"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Maasai Mara, Narok, Kenya. Hotel: Keekorok Lodge"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Lamu Island, Lamu, Kenya. Hotel: Peponi Hotel"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Tsavo East, Tsavo, Kenya. Hotel: Voi Safari Lodge"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Samburu, Samburu, Kenya. Hotel: Samburu Intrepids"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Aberdare, Nyeri, Kenya. Hotel: The Ark Lodge"
            ),
            Booking(
                itinerary_id=random.choice(itineraries).id,
                activity_id=random.choice(activities).id,
                booking_details="Malindi, Malindi, Kenya. Hotel: Ocean Beach Resort & Spa"
            )
        ]

        db.session.add_all(bookings)
        db.session.commit()

        journals = [
            TravelJournal(
                title="Nairobi Safari Experience",
                content="Today, I had an amazing experience at Nairobi National Park. Saw lions, elephants, and giraffes. The highlight was the baby elephant at the orphanage.",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Relaxing at Diani Beach",
                content="Diani Beach is paradise! Spent the day swimming and sunbathing. The seafood at the resort is to die for.",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Conquering Mount Kenya",
                content="Just reached the summit of Mount Kenya. The trek was tough but the view from the top is worth it. Feeling accomplished!",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Flamingo Watching at Lake Nakuru",
                content="Witnessed thousands of flamingos at Lake Nakuru. An unforgettable sight!",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Maasai Mara Adventure",
                content="Experienced the Great Migration in Maasai Mara. The sight of thousands of wildebeest crossing the river was breathtaking.",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Lamu Island Retreat",
                content="Lamu Island is a hidden gem. Loved exploring the narrow streets and interacting with the locals.",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Tsavo East Safari",
                content="Tsavo East is a must-visit for wildlife enthusiasts. Saw the famous red elephants and even a lion pride.",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Samburu Sunset Safari",
                content="The sunset safari in Samburu was magical. The landscape and wildlife were truly unique.",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Aberdare Waterfall Hike",
                content="Hiked to the stunning waterfalls in Aberdare National Park. The views were worth the effort.",
                user_id=random.choice(users).id
            ),
            TravelJournal(
                title="Malindi Coastal Experience",
                content="Enjoyed snorkeling in Malindi. The coral reefs and marine life were incredible.",
                user_id=random.choice(users).id
            )
        ]

        db.session.add_all(journals)
        db.session.commit()

        for journal in journals:
            shared_users = random.sample(users, k=min(len(users), random.randint(1, 5)))
            journal.shared_with.extend(shared_users)
            db.session.commit()

        print("Database populated successfully!")

if __name__ == "__main__":
    populate_db()
