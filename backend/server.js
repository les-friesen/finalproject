const express = require('express'); 
const morgan = require('morgan'); 
const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
  audience: 'https://traveltracker.com',
  issuerBaseURL: 'https://dev-eqahhm5zziuubavs.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

const { addTrip, getTrips, getTripById, deleteTrip, addExpense, editTrip, editExpense, deleteExpense, getHistoricalRate } = require('./handlers'); 

const app = express(); 

app.use(express.json());
app.use(morgan('tiny'));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://travel-tracker-e3l8.onrender.com');
  res.header('Access-Control-Allow-Credintials', true); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if ('OPTIONS' == req.method) {
  res.sendStatus(200);
  } else {
    next();
  }
});

// app.use(jwtCheck);
app.post("/addTrip", jwtCheck, addTrip)
    .get("/getTrips/:userId", jwtCheck, getTrips)
    .get("/getTrip/:trip", jwtCheck, getTripById)
    .patch("/editTrip/:trip", jwtCheck, editTrip)
    .delete("/deleteTrip/:trip", jwtCheck, deleteTrip)
    .post("/addExpense/:trip", jwtCheck, addExpense)
    .patch("/editExpense/:trip/:expense", jwtCheck, editExpense )
    .delete("/deleteExpense/:trip/:expense", jwtCheck, deleteExpense)
    .get("/getHistoricalRate/:new/:base/:date", getHistoricalRate)
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for.",
        });
    })

app.listen(8000, () => console.log('App listening on port:8000'))