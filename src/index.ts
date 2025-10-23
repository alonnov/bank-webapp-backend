import 'dotenv/config';

import express from 'express';
import Authenticate from './routes/auth/auth-routes';
import Public from './routes/public/public-routes';
import { getOpenApiSpec } from './swagger/swagger';
import swaggerUi from 'swagger-ui-express';
import { appConfig } from './config/config';

export const app = express();
const port = appConfig.port;

app.use(express.json());
app.use('/public', Public);
app.use('/auth', Authenticate);

// swagger docs
const spec = getOpenApiSpec();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

if (appConfig.environment !== 'test') {
  app.listen(port, ()=> console.log(`listening on port ${port}`));
}
