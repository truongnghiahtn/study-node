const userRouter = require('./userRoutes');
const tourRouter = require('./tourRoutes');

function route(app) {
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);
}
module.exports=route;
