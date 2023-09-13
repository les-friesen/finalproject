
<div style="text-align: center; width: 100%">
    <img src='client/src/assets/logo.png' style='width:40%' alt="logo">
</div>

> Live demo available at [_https://travel-tracker-demo.vercel.app_](https://travel-tracker-demo.vercel.app). 
> Video demo availalbe [_here_](https://youtu.be/XHTmO55-3iY).

## General Information
- Travel Tracker is an expense tracker and budgeting tool for travellers with built-in currency conversion and bill-splitting capabilities.
- This was my final project for Concordia University's intensive full-stack web development diploma. 

## Technologies Used
- React
- NodeJS
- ExpressJS
- MongoDb
- Auth0 authentication
- styled-components
- Material UI react tools (MUI)
- Javascript

## Features
- Auth0 user authentication
- Secure API calls using middleware to check JSON web tokens (express-oauth2-jwt-bearer)
- Ability to Create, Read, Update and Delete trips
- For each trip, ability to Create, Read, Update and Delete expenses
- Sortable table for viewing all expenses
- Easily editable fields for trip and expense data - click on data to edit, and click outside to save changes. 
- Currency conversion calculator for foreign currencies, using a free API: https://exchangerate.host/#/#docs 
- Bill splitting capabilities for up to 6 people with customizable distribution ratios. 
- Balances tab, which generates suggested reimbursements to balance out the expenses among all participants.

# Setup

### Frontend

1. Open a terminal in VS Code
2. Type `cd client`
3. Type `yarn install`

Type `yarn start` to start the frontend dev environment.

### Backend

1. Open a second terminal in VS Code
2. Type `cd backend`
3. Type `yarn install`

Type `yarn dev:backend` to start the backend dev environment.

## Screenshots
![Example screenshot](./img/screenshot.png)
Hello this is a test

  <img src='client/src/assets/logo.png' style='width:100%' alt="logo">
