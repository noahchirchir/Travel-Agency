import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { TripCard } from "../components/TripCard";

const trips = [
  {
    id: 1,
    destination: "Nairobi National Park",
    date: "2024-09-15",
    description:
      "A day trip to explore Nairobi's wildlife. Includes guided tour and lunch.",
    image: "https://example.com/nairobi-national-park.jpg",
  },
  {
    id: 2,
    destination: "Maasai Mara",
    date: "2024-10-01",
    description:
      "Experience the great migration in Maasai Mara with a 3-day safari.",
    image: "https://example.com/maasai-mara.jpg",
  },
  {
    id: 3,
    destination: "Mount Kenya",
    date: "2024-11-10",
    description:
      "A challenging trek to the summit of Mount Kenya, suitable for experienced hikers.",
    image: "https://example.com/mount-kenya.jpg",
  },
];



function Community() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Community Trips</h1>
        <div className="max-w-4xl mx-auto">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Community
