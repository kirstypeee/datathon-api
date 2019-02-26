import { Express, Request, Response } from 'express';

export class HealthCheck {
  public route = (app: Express) => {
    app.get('/api/', this.reportHealth());
    app.get('/api/example', this.doExample());
  };

  public reportHealth = () => async (req: Request, res: Response, next: any) => {
    try {
      return res
        .status(200)
        .json({ status: 'OK' })
        .end();
    } catch (e) {
      next(e);
    }
  };

  public doExample = () => async (req: Request, res: Response, next: any) => {
    try {
      return res
        .status(200)
        .json({ status: 'Hello World!' })
        .end();
    } catch (e) {
      next(e);
    }
  };

}
