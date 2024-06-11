import { Application } from 'express';
export default class ExpressServer {
    private routes;
    constructor();
    router(routes: (app: Application) => void): ExpressServer;
    listen(port: number): Application;
}
