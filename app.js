const express = require('express');
const app = express();
const route = require('./routes');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db=require('./config/database');

//middlewares
dotenv.config({path:'./config.env'});
app.use(express.static(`${__dirname}/public`))
app.use(express.json());
if(process.env.NODE_ENV==="development"){
    app.use(morgan('combined'));
}

// connect database
db();


//router
route(app);

module.exports = app;
