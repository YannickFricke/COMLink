import { ContainerModule, injectable } from 'inversify';
import { AuthProvider } from '../../auth/AuthProvider';

@injectable()
export class AuthModule extends ContainerModule {
    constructor() {
        super(bind => {
            bind(AuthProvider).toSelf();
            bind(String).toConstantValue(process.env.JWT_KEY ?? 'my-secret-key').whenTargetNamed('JWT_KEY');
        });
    }
}
