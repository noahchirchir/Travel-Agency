import unittest
import json
from app import app, db, User, Itinerary, Activity, Booking, TravelJournal
from flask_jwt_extended import create_access_token

class TravelAppTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()
        
        # Create a test user
        self.test_user = User(username='testuser', email='test@example.com', password='testpass')
        db.session.add(self.test_user)
        db.session.commit()
        
        self.access_token = create_access_token(identity=self.test_user.id)

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_login(self):
        response = self.app.post('/login', json={
            "email": "test@example.com",
            "password": "testpass"
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("access_token", data)

    def test_create_itinerary(self):
        response = self.app.post('/itineraries', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "name": "Test Itinerary",
            "description": "Test description",
            "start_date": "2024-08-01T00:00:00",
            "end_date": "2024-08-10T00:00:00"
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Itinerary created successfully')

    def test_get_all_itineraries(self):
        self.app.post('/itineraries', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "name": "Test Itinerary",
            "description": "Test description",
            "start_date": "2024-08-01T00:00:00",
            "end_date": "2024-08-10T00:00:00"
        })
        response = self.app.get('/itineraries', headers={
            'Authorization': f'Bearer {self.access_token}'
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertGreater(len(data), 0)

    def test_create_activity(self):
        itinerary_response = self.app.post('/itineraries', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "name": "Test Itinerary",
            "description": "Test description",
            "start_date": "2024-08-01T00:00:00",
            "end_date": "2024-08-10T00:00:00"
        })
        itinerary_id = json.loads(itinerary_response.data)['id']

        response = self.app.post(f'/itineraries/{itinerary_id}/activities', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "name": "Test Activity",
            "description": "Activity description",
            "date": "2024-08-05",
            "time": "10:00"
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Activity added to itinerary successfully')

    def test_add_booking(self):
        itinerary_response = self.app.post('/itineraries', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "name": "Test Itinerary",
            "description": "Test description",
            "start_date": "2024-08-01T00:00:00",
            "end_date": "2024-08-10T00:00:00"
        })
        itinerary_id = json.loads(itinerary_response.data)['id']

        activity_response = self.app.post(f'/itineraries/{itinerary_id}/activities', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "name": "Test Activity",
            "description": "Activity description",
            "date": "2024-08-05",
            "time": "10:00"
        })
        activity_id = json.loads(activity_response.data)['id']

        response = self.app.post('/bookings', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "itinerary_id": itinerary_id,
            "activity_id": activity_id,
            "booking_details": "Booking details"
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Booking added successfully')

    def test_create_journal_entry(self):
        response = self.app.post('/journals', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "title": "Test Journal Entry",
            "content": "This is a test entry.",
            "entry_date": "2024-08-01T00:00:00"
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Journal entry created successfully')

    def test_share_journal_entry(self):
        journal_response = self.app.post('/journals', headers={
            'Authorization': f'Bearer {self.access_token}'
        }, json={
            "title": "Test Journal Entry",
            "content": "This is a test entry.",
            "entry_date": "2024-08-01T00:00:00"
        })
        journal_id = json.loads(journal_response.data)['id']

        response = self.app.post(f'/journals/share/{journal_id}', json={})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Journal entry shared successfully')

    def test_get_shared_journals(self):
        response = self.app.get('/journals/shared', headers={
            'Authorization': f'Bearer {self.access_token}'
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

if __name__ == "__main__":
    unittest.main()