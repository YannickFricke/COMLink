import {
    BaseHttpController,
    controller,
    httpGet,
    httpPatch,
    principal,
    queryParam,
    requestBody,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { UserService } from '../services/UserService';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { Principal } from '../auth/Principal';
import { User } from '@comlink/framework/dist/entity/User';

@controller('/user', AuthMiddleware)
export class UserController extends BaseHttpController {
    @inject(UserService)
    private userService!: UserService;

    @httpGet('/')
    async getAllUsers() {
        return this.json(await this.userService.getAllUsers());
    }

    @httpGet('/me')
    async getAuthentificatedUser(
        @principal() principal: Principal,
    ) {
        return this.getSingleUser(principal.details.id);
    }

    @httpGet('/:id')
    async getSingleUser(
        @queryParam('id') userId: string,
    ) {
        try {
            return this.json(
                await this.userService.getSingleUser(userId),
            );
        } catch (error) {
            return this.notFound();
        }
    }

    @httpPatch('/:id')
    async updateUser(
        @principal() principal: Principal,
        @queryParam('id') userId: string,
        @requestBody() payload: Partial<User>,
    ) {
        if (!principal.isGameMaster()) {
            return this.statusCode(401);
        }

        try {
            const updatedUser = await this.userService.updateUser(userId, payload);

            return this.json(updatedUser);
        } catch (error) {
            return this.badRequest(error.message);
        }
    }
}
