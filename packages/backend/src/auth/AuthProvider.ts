import { interfaces } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';
import { Principal } from './Principal';
import { inject, injectable } from 'inversify';
import { User } from '@comlink/framework/dist/entity/User';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
    @inject(AuthService)
    private authService!: AuthService;

    @inject(UserService)
    private userService!: UserService;

    async getUser(req: Request, res: Response, next: NextFunction): Promise<Principal> {
        const token = req.headers.authorization;

        if (token === undefined || !token.startsWith('Bearer ')) {
            return new Principal(new User());
        }

        const extractedToken = token!.substr(7).trim();

        if (extractedToken.length === 0) {
            return new Principal(new User());
        }

        try {
            const verifiedToken = this.authService.decodeJWT(extractedToken);
            const foundUser = await this.userService.getSingleUser(verifiedToken.id);

            if (foundUser === undefined) {
                return new Principal(new User());
            }

            return new Principal(foundUser);
        } catch (error) {
            return new Principal(new User());
        }
    }
}
