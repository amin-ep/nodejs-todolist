import express from 'express';
import authRouter from './routes/v1/authRoutes.js';
import todoRouter from './routes/v1/todoRoutes.js';
import globalErrorHandler from './controllers/v1/errorHandler.js';
import HTTPError from './utils/httpError.js';
const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/todo', todoRouter);

app.all('*', function (req, res, next) {
  return next(
    new HTTPError(`This route is note defined! ${req.originalUrl}`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
