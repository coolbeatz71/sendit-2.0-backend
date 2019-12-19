import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiV1 from './api/index';
import * as errorHandler from './helpers/errorHandler';

class App {
  public express = express();

  constructor() {
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(helmet());
  }

  private setRoutes(): void {
    this.express.use('/api/v1', apiV1);
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.internalServerError);
  }
}

const app = new App().express;
export default app;
