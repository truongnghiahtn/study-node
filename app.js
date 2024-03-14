const express = require('express');
const app = express();
const route= require('./routes')
const morgan = require("morgan");



//middlewares
app.use(express.json());
app.use(morgan("combined"));



//router
route(app);


module.exports=app;
