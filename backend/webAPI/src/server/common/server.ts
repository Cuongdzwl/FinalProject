import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import l from './logger';
import cors from 'cors';
import redisClient from './redis';
import errorHandler from '../api/middlewares/error.handler';

const app = express();

export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    // Normalize the root path of the project
    const root = path.normalize(__dirname + '/../..');

    // Enable Cross-Origin Resource Sharing
    app.use(cors({ origin: '*' }));

    app.use((_, __, next) => {
      redisClient;
      next();
    });

    // Use body-parser middleware to parse incoming JSON requests
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));

    // Use body-parser middleware to parse incoming URL-encoded requests
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );

    // Use body-parser middleware to parse incoming text requests
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));

    // Use cookie-parser middleware to parse cookies attached to the client request object
    app.use(cookieParser(process.env.SESSION_SECRET));

    // Serve static files from the 'public' directory
    app.use(express.static(`${root}/public`));

    // Define the path to the OpenAPI specification file
    const apiSpec = path.join(__dirname, './api.yml');
    // Determine whether to validate responses against the OpenAPI specification
    const validateResponses = !!(
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === 'true'
    );

    // Serve the OpenAPI specification file at the path specified by the OPENAPI_SPEC environment variable or default to '/spec'
    var spec = process.env.OPENAPI_SPEC || '/spec';
    l.info(`Using OpenAPI spec at: ${spec} (Path: ${apiSpec})`);
    app.use(spec, express.static(apiSpec));

    // Use OpenAPI Validator middleware to validate incoming requests and outgoing responses against the OpenAPI specification
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
