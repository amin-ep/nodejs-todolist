import express from 'express';
import authRouter from './routes/v1/authRoutes';
import globalErrorHandler from './controllers/v1/errorHandler';
import HTTPError from './utils/httpError';
const app = express();

app.use('/api/v1/auth', authRouter);

app.all('*', function (req, res, next) {
  return next(
    new HTTPError(`This route is note defined! ${req.originalUrl}`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
