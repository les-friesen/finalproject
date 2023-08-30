"use strict";

const { MongoClient } = require("mongodb");
const request = require('request-promise');


require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

const addTrip = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db("travelTracker");
        console.log("connected!");
        req.body._id = uuidv4(); 
        req.body.expenses = []; 
        const result1 = await db.collection("trips").insertOne(req.body);
        client.close();
            console.log("disconnected!");
            res.status(201).json({ status: 201, data: result1 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
}

const getTrips = async (req, res) => {
        try {
            if (req.params.userId !== req.auth.payload.sub ) {
                return res.status(401).json({status: 401, data: null, message: "Unauthorized"})
            }
            const client = new MongoClient(MONGO_URI, options);
            const userId = req.params.userId
            await client.connect();
            const db = client.db("travelTracker");
            console.log("connected!");
            const result = await db.collection("trips").find({ userId }).toArray();
            res.status(200).json({ status: 200, data: result } )   
            client.close();
            console.log("disconnected!");
        } catch (err) {
            return res.status(500).json({status: 500, data: "error", message: err.message})
        }  
    }

const getTripById = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        const _id = req.params.trip
        await client.connect();
        const db = client.db("travelTracker");
        console.log("connected!");
        const result = await db.collection("trips").findOne({ _id })
        
        !result 
            ? res.status(404).json({ status: 404, data: null, message: "Not found" })
            : result.userId !== req.auth.payload.sub 
            ? res.status(401).json({status: 401, data: null, message: "Unauthorized"})
            : res.status(200).json({ status: 200, data: result })
        client.close();
        console.log("disconnected!");
    } catch (err) {
        return res.status(500).json({status: 500, data: "error", message: err.message})
    }  
}

const editTrip = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db("travelTracker");
        console.log("connected!");
        const _id = req.params.trip; 
        const queryResult = await db.collection("trips").findOne({ _id });

        if (queryResult.userId !== req.auth.payload.sub ) {
            return res.status(401).json({status: 401, data: null, message: "Unauthorized"})
        }
        if (req.body.budget) {
            queryResult.budget = req.body.budget;
        }
        if (req.body.endDate) {
            queryResult.endDate = req.body.endDate;
        }
        if (req.body.startDate) {
            queryResult.startDate = req.body.startDate;
        }
        if (req.body.tripName) {
            queryResult.tripName = req.body.tripName;
        }
        const result = await db.collection("trips").updateOne({ _id }, { $set: { ...queryResult } }); 
        client.close();
            console.log("disconnected!");
            res.status(201).json({ status: 200, data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
}

const deleteTrip = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db("travelTracker");
        console.log("connected!");
        const _id = req.params.trip; 
        const queryResult = await db.collection("trips").findOne({ _id });
        if (queryResult.userId !== req.auth.payload.sub ) {
            return res.status(401).json({status: 401, data: null, message: "Unauthorized"})
        }
        const result = await db.collection("trips").deleteOne({_id});
        client.close();
        console.log("disconnected!");
        res.status(200).json({ status: 200, data: result, message: "trip successfully deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
}

    const addExpense = async (req, res) => {
        try {
            const client = new MongoClient(MONGO_URI, options);
            await client.connect();
            const db = client.db("travelTracker");
            console.log("connected!");
            const _id = req.params.trip; 
            const queryResult = await db.collection("trips").findOne({ _id });
            
            if (queryResult.userId !== req.auth.payload.sub ) {
                return res.status(401).json({status: 401, data: null, message: "Unauthorized"})
            }

            req.body.expenseId = uuidv4(); 
            queryResult.expenses.push(req.body)
            const result = await db.collection("trips").updateOne({ _id }, { $set: { expenses: queryResult.expenses } }); 
            client.close();
            console.log("disconnected!");
            res.status(201).json({ status: 201, data: result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, data: req.body, message: err.message });
        }
    }

    const editExpense = async (req, res) => {
        try {
            const client = new MongoClient(MONGO_URI, options);
            await client.connect();
            const db = client.db("travelTracker");
            console.log("connected!");
            const _id = req.params.trip; 
            const queryResult = await db.collection("trips").findOne({ _id });

            if (queryResult.userId !== req.auth.payload.sub ) {
                return res.status(401).json({status: 401, data: null, message: "Unauthorized"})
            }

                if (req.body.name) {
                queryResult.expenses.find(item => item.expenseId === req.params.expense).name = req.body.name;
                }
                if (req.body.category) {
                queryResult.expenses.find(item => item.expenseId === req.params.expense).category = req.body.category;
                }
                if (req.body.date) {
                queryResult.expenses.find(item => item.expenseId === req.params.expense).date = req.body.date;
                }
                if (req.body.amount) {
                queryResult.expenses.find(item => item.expenseId === req.params.expense).amount = req.body.amount;
                }
                if (req.body.distribution) {
                    queryResult.expenses.find(item => item.expenseId === req.params.expense).distribution = req.body.distribution;
                    }
                if (req.body.paidBy) {
                    queryResult.expenses.find(item => item.expenseId === req.params.expense).paidBy = req.body.paidBy;
                }
                
            const result = await db.collection("trips").updateOne({ _id }, { $set: { expenses: queryResult.expenses } }); 
            client.close();
                console.log("disconnected!");
                res.status(200).json({ status: 200, data: result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, data: req.body, message: err.message });
        }
        }

    const deleteExpense = async (req, res) => {
        try {
            const client = new MongoClient(MONGO_URI, options);
            await client.connect();
            const db = client.db("travelTracker");
            console.log("connected!");
            const _id = req.params.trip; 
            const queryResult = await db.collection("trips").findOne({ _id });
            
            if (queryResult.userId !== req.auth.payload.sub ) {
                return res.status(401).json({status: 401, data: null, message: "Unauthorized"})
            }

            const index = queryResult.expenses.findIndex(item => item.expenseId === req.params.expense) 
            if (index < 0) 
            {return res.status(400).json({status: 400, message: "Expense ID not found"})}
            queryResult.expenses.splice(index, 1)
            const result = await db.collection("trips").updateOne({ _id }, { $set: { expenses: queryResult.expenses } }); 
            client.close();
                console.log("disconnected!");
                res.status(201).json({ status: 201, data: result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, data: req.body, message: err.message });
        }
        }

    const getHistoricalRate = async (req, res) => {
        try {
            const newRate = req.params.new
            const baseRate = req.params.base
            const date = req.params.date
            const result = await request(`https://api.exchangerate.host/convert?from=${newRate}&to=${baseRate}&date=${date}`);
            const data = JSON.parse(result);
            return (
                res.status(200).json( {status: 200, data: data })
            );
            } catch (err) {
            console.log(err);
            }
        };

module.exports = {
    addTrip, 
    getTrips,
    getTripById,
    deleteTrip, 
    addExpense,
    editTrip,
    editExpense,
    deleteExpense,
    getHistoricalRate
};