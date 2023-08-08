const express = require('express'); 

const morgan = require('morgan'); 

const { addTrip, getTrips, getTripById, deleteTrip, addExpense, editTrip, editExpense, deleteExpense, getRate, getHistoricalRate } = require('./handlers'); 

const app = express(); 

app.use(express.json());
app.use(morgan('tiny'));  

app.post("/addTrip", addTrip)
    .get("/getTrips/:userId", getTrips)
    .get("/getTrip/:trip", getTripById)
    .patch("/editTrip/:trip", editTrip)
    .delete("/deleteTrip/:trip", deleteTrip)
    .post("/addExpense/:trip", addExpense)
    .patch("/editExpense/:trip/:expense", editExpense )
    .delete("/deleteExpense/:trip/:expense", deleteExpense)
    .get("/getRate/:new/:base", getRate)
    .get("/getHistoricalRate/:new/:base/:date", getHistoricalRate)

    

    // ---------------------------------
    // Nothing to modify above or below this line

    // this is our catch all endpoint.
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for.",
        });
    })

app.listen(8000, () => console.log('App listening on port:8000'))