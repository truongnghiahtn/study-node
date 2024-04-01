const path = require('path');
const express = require('express');
const app = express();
const route = require('./routes');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./config/database');
const rateLimit= require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');



dotenv.config({ path: './config.env' });
//middlewares
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// read file in public
app.use(express.static(path.join(__dirname, 'public')));

// protec header

app.use(helmet());


//middleware chặn các kiu truy vấn sql
app.use(mongoSanitize());

//middleware chặn các mã js độc hại

app.use(xss());

// middleware ngăng ngừa các tham số
app.use(hpp());
// logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}
// limit requests from some api
const limiter= rateLimit({
  max:100,
  windowMs:60*60*1000, // 1h chỉ có 100 req quá sẽ báo lỗi
  message:'quá nhiều requet trong 1 h'
})

app.use('/api',limiter);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// read file in public
// app.use(express.static(`${__dirname}/public`));

// parse body, read data from body
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// connect database
db();


route(app);

module.exports = app;
