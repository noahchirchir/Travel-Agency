// TODO: turn this page to a details page for my trips

export const TripCard = ({ trip }) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-4">
    <img src={trip.image} alt={trip.destination} className="w-full h-48 object-cover rounded-lg mb-2" />
    <h3 className="text-xl font-bold mb-2">{trip.destination}</h3>
    <p className="text-gray-600 mb-2">{trip.date}</p>
    <p>{trip.description}</p>
  </div>
);
