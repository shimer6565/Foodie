require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(express.json())
app.use(cors());
const port = process.env.PORT;

app.get("/restaurants", async (req, res) => {
    try {
        //const results = await db.query("select * from restaurants");
        const restaurantRatingsData = await db.query(
          "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
        );
    
        res.status(200).json({
          status: "success",
          results: restaurantRatingsData.rows.length,
          data: {
            restaurants: restaurantRatingsData.rows,
          },
        });
      } catch (err) {
        console.log(err);
      }
})

app.get("/restaurants/:id", async (req, res) => {
    try {
        //console.log("hello");
        const restaurant = await db.query("select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1;",[req.params.id]);
        const reviews = await db.query("select * from reviews where restaurant_id = $1",[req.params.id]);

        res.json({
            status : "success",
            data : {
                restaurants : restaurant.rows,
                reviews : reviews.rows,
            },  
        })

    } catch (err) {
        console.log(err.message);
    }
})

app.post("/restaurants", async (req, res) => {
    try {
        console.log(req.body.location);
        const results = await db.query("insert into restaurants (name, location, price_range) values ($1, $2, $3) returning *",
        [req.body.name, req.body.location, req.body.price_range]);
        res.json({
            status : "success",
            results : results.rows.length,
            data : {
                restaurants : results.rows,
            },  
        })
    } catch (err) {
        console.log(err.message);
    }
})

app.put("/restaurants/:id", async (req, res) =>{
    try {
        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
        [req.body.name, req.body.location, req.body.price_range, req.params.id]);  
        res.status(200).json({
            status : "success",
            data : {
                restaurants : results.rows,
            },  
        })
    } catch (err) {
        console.log(err.message);
    }
    
})

app.delete("/restaurants/:id", async (req, res) => {
    try {
        const results = await db.query("DELETE FROM restaurants WHERE id = $1 returning *", [req.params.id]);
        res.status(204).json({
            status : "success",
            data : {
                restaurants : ["hi", "hello"],
            },  
        }) 
        
    } catch (err) {
        console.log(err.message);
    }  
})

app.post("/restaurants/:id/addReview", async (req,res) => {
    try {
        const newReview = await db.query("insert into reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4);", [req.params.id, req.body.name, req.body.review, req.body.rating]);
        res.status(201).json({
            status: 'success',
            data: {
                review: newReview.rows[0],
            },
        });
    } catch (error) {
        console.log( "hi" + error.message);
    }
})







app.listen(port, () => {
    console.log(`Running on ${port}`);
});