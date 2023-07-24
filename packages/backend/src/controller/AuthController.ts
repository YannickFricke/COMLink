import { BaseHttpController, controller, httpPost, requestBody } from 'inversify-express-utils';
import { plainToClass } from 'class-transformer';
import { inject } from 'inversify';
import { UserService } from '../services/UserService';
import { validate } from 'class-validator';
import { AuthService } from '../services/AuthService';
import { RegisterInput } from '../inputs/auth/RegisterInput';
import { LoginInput } from '../inputs/auth/LoginInput';
import { compareSync } from 'bcrypt';

@controller('/auth')
export class AuthController extends BaseHttpController {
    @inject(UserService)
    private userService!: UserService;

    @inject(AuthService)
    private authService!: AuthService;

    @httpPost('/login')
    async login(
        @requestBody() payload: LoginInput,
    ) {
        const data = plainToClass(LoginInput, payload);

        const errors = await validate(data);

        if (errors.length > 0) {
            return this.json(errors, 400);
        }

        try {
            const foundUser = await this.userService.getSingleUserWithPassword(data.username);

            if (!compareSync(data.password, foundUser.password)) {
                throw new Error('Invalid credentials');
            }

            delete foundUser.password;

            return this.ok(
                this.authService.encodeJWT(foundUser),
            );
        } catch (error) {
            return this.badRequest(error.message);
        }
    }

    @httpPost('/register')
    async register(
        @requestBody() payload: RegisterInput,
    ) {
        const data = plainToClass(RegisterInput, payload);

        try {
            return this.ok(await this.userService.createNewUser(data));
        } catch (error) {
            return this.badRequest(JSON.stringify(error));
        }
    }
}
