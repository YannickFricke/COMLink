import { BaseMiddleware } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
    async handler(req: Request, res: Response, next: NextFunction) {
        const isAuthenticated = await this.httpContext.user.isAuthenticated();

        if (!isAuthenticated) {
            res.status(401);
            res.end();
            return;
        }

        next();
    }
}
