import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import RestaurantFinder from '../apis/RestaurantFinder';
import AddReview from '../components/AddReviews';
import Reviews from '../components/Reviews';
import StarRating from '../components/StarRating';
import { RestaurantsContext } from '../context/RestaurantsContext';

const Details = () => {

  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantsContext);

  useEffect (() => {
    console.log("hi");
    const fetchDetails = async () => {
      try {
        console.log("hi");
        const response = await RestaurantFinder.get(`/${id}`);
        console.log(response.data.data);
        setSelectedRestaurant(response.data.data)
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDetails();
  }, []);

  return (
    <div>
      {selectedRestaurant && (
        <>
          <h1 className="text-center display-1">
            {selectedRestaurant.restaurants[0].name}
          </h1>
          <div className="text-center">
            <StarRating rating={selectedRestaurant.restaurants[0].average_rating} />
            <span className="text-warning ml-1">
              {selectedRestaurant.restaurants[0].count
                ? `(${selectedRestaurant.restaurants[0].count})`
                : "(0)"}
            </span>
          </div>
          <div className="mt-3">
            <Reviews reviews={selectedRestaurant.reviews} />
          </div>
          <AddReview />
        </>
      )}
    </div>
  );
};

export default Details
