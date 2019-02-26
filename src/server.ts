import express from "express";
import { Express, Request, Response } from "express";
import { isDev } from "./environment/envUtil";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import * as bodyParser from "body-parser";
import { HealthCheck } from './controllers/healthCheck';

async function startServer() {
    const app = express();
    const port = process.env.PORT || 5000;

    forceHttpsMiddleware(app);

    // Common middleware
    app.use(cors());
    app.use(compression());
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Set Up the controllers and routes
    await setUpControllers(app);

    app.listen(port, (e: any) =>
        console.log(e ? `Failed with ${e}` : `Server is on port ${port}`)
    );
}

async function setUpControllers(app: Express) {
    const healthCheck = new HealthCheck();
    healthCheck.route(app);
}

function forceHttpsMiddleware(app: Express) {
    // Require HTTPS
    // Add a handler to inspect the req.secure flag (see
    // http://expressjs.com/api#req.secure). This allows us
    // to know whether the request was via http or https.
    app.enable("trust proxy");
    app.use((req: Request, res: Response, next: any) => {
        if (req.secure || isDev()) {
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect("https://" + req.headers.host + req.url);
        }
    });
}

export default startServer;
