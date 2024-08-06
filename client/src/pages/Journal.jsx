import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// // mock data for testing
// const journals = [
//   {
//     id: 1,
//     title: "A Day in the Mountains",
//     content:
//       "Today was absolutely refreshing. The hike up the mountain was challenging, but the view from the top was worth every step. The fresh air and the sound of birds made it an unforgettable experience.",
//     date: "2024-07-21",
//   },
//   {
//     id: 2,
//     title: "Learning React",
//     content:
//       "Spent the entire day diving deep into React. Understanding hooks was a bit tricky, but the documentation and some online tutorials really helped. Managed to create a small project to solidify my knowledge.",
//     date: "2024-07-22",
//   },
//   {
//     id: 3,
//     title: "Coffee with an Old Friend",
//     content:
//       "Met up with an old friend from college today. We had coffee at our favorite spot and reminisced about the good old days. It was nice catching up and hearing about their recent adventures.",
//     date: "2024-07-23",
//   },
//   {
//     id: 4,
//     title: "Stargazing Night",
//     content:
//       "Went stargazing tonight. The sky was clear, and the stars were brighter than ever. Saw a few shooting stars and made some wishes. It was a peaceful and mesmerizing night.",
//     date: "2024-07-24",
//   },
//   {
//     id: 5,
//     title: "Baking Experiment",
//     content:
//       "Tried baking a new recipe today: chocolate chip cookies with a twist. Added some sea salt and caramel. They turned out delicious, and the family loved them!",
//     date: "2024-07-25",
//   },
//   {
//     id: 6,
//     title: "Unexpected Rain",
//     content:
//       "Today started off sunny, but by afternoon, an unexpected rain shower hit. Took the opportunity to curl up with a good book and a cup of tea. Sometimes, rainy days can be the best.",
//     date: "2024-07-26",
//   },
//   {
//     id: 7,
//     title: "Yoga and Meditation",
//     content:
//       "Dedicated the morning to yoga and meditation. It was a calming start to the day. Felt more focused and energized afterward. Need to make this a regular habit.",
//     date: "2024-07-27",
//   },
//   {
//     id: 8,
//     title: "Visit to the Art Gallery",
//     content:
//       "Visited the local art gallery today. The new exhibition featured modern art, which was both intriguing and thought-provoking. Spent hours admiring the creativity and talent on display.",
//     date: "2024-07-28",
//   },
//   {
//     id: 9,
//     title: "Family BBQ",
//     content:
//       "Had a family BBQ in the backyard. The weather was perfect, and everyone had a great time. The highlight was definitely the homemade burgers and the lively conversations.",
//     date: "2024-07-29",
//   },
//   {
//     id: 10,
//     title: "Exploring New Music",
//     content:
//       "Discovered some new music artists today. Spent hours listening to their albums. It's amazing how music can evoke so many emotions and memories. Found a few new favorites.",
//     date: "2024-07-30",
//   },
// ];

function Journal() {
  const [entries, setEntries] = useState([]);


  useEffect(() => {
    fetch("http://127.0.0.1:5555/journals/shared")
      .then((response) => response.json())
      .then((data) => setEntries(data));
  }, [])

  return (
    <>
      <NavBar />
      <div>
        <h1 className="text-center text-4xl mt-12">Journal</h1>
        <div className="flex justify-between px-72 space-x-10 mt-12">
          <h2 className="text-2xl">My entries</h2>
          <Link to="/journal-form">
          <button className="bg-lime-900 text-white py-2 px-5 rounded-full hover:bg-lime-800 transition duration-300 ease-in-out text-lg ml-4">
            Add new entry
          </button>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-24">
          {entries.map((journal) => (
            <div
              key={journal.id}
              className="bg-white shadow-lg rounded-lg p-4 mt-12"
            >
              <h2 className="text-2xl">{journal.date}</h2>
              <h3 className="text-xl font-semibold">{journal.title}</h3>
              <Link to={`/journal/${journal.id}`}>
                <button className="bg-lime-900 text-white py-1 px-2 rounded-md hover:bg-lime-800 transition duration-300 ease-in-out text-lg mt-5">
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Journal;
