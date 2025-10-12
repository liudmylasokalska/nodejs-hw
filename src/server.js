import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from "celebrate";

const app = express();

const PORT = process.env.PORT ?? 3030;

app.use(logger); //  Логер першим — бачить усі запити

app.use(
  express.json({
    limit: '100kb',
    type: ['application/json', 'application/vnd.api+json'],
  }),
);

app.use(cors());

app.use(helmet());

app.use(notesRoutes);

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});