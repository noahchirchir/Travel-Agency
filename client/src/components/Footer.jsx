function Footer() {
  return (
    <footer className="bg-lime-950 text-white p-10">
      <div className="flex justify-center space-x-4">
        <ion-icon
          size="large"
          className="text-gray-300 hover:text-white  transition duration-300 text-4xl cursor-pointer"
          name="logo-instagram"
        ></ion-icon>
        <ion-icon
          size="large"
          className="text-gray-300 hover:text-white  transition duration-300 text-4xl cursor-pointer"
          name="logo-github"
        ></ion-icon>
        <ion-icon
          size="large"
          className="text-gray-300 hover:text-white  transition duration-300 text-4xl cursor-pointer"
          name="logo-facebook"
        ></ion-icon>
      </div>
      <p className="text-center mt-4">
        © 2024 Travel Planner. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
