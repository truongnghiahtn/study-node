const userRouter = require('./userRoutes');
const tourRouter = require('./tourRoutes');
const appError = require('../utils/appError');
const errorGlobal=require('../controllers/errorController');

function route(app) {
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

  app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server!`,404));
  });
  app.use(errorGlobal);
}
module.exports = route;
