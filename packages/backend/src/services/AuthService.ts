import { inject, injectable, named } from 'inversify';
import { Algorithm, sign, verify } from 'jsonwebtoken';
import { User } from '@comlink/framework/dist/entity/User';

@injectable()
export class AuthService {
    @named('JWT_KEY')
    @inject(String)
    private secretKey!: string;

    private algorithm: Algorithm = 'HS512';

    public decodeJWT(
        token: string,
    ): User {
        return verify(token, this.secretKey, {
            algorithms: [
                this.algorithm,
            ],
        }) as User;
    }

    public encodeJWT(user: User): string {
        return sign({ ...user }, this.secretKey, {
            algorithm: this.algorithm,
            expiresIn: '12h',
        });
    }
}
