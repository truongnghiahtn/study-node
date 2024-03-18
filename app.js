const express = require('express');
const app = express();
const route = require('./routes');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./config/database');
dotenv.config({ path: './config.env' });
//middlewares
app.use(express.static(`${__dirname}/public`));

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// connect database
db();

//router
route(app);

module.exports = app;
