import React from "react";
import AddRestaurants from "../components/AddRestaurants";
import Header from "../components/Header";
import ListRestaurants from "../components/ListRestaurants";


const Home = () => {
  return (
    <div>
      <Header />
      <AddRestaurants />
      <ListRestaurants />
    </div>
  );
};

export default Home;