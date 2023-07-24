import { interfaces } from 'inversify-express-utils';
import { User } from '@comlink/framework/dist/entity/User';

export class Principal implements interfaces.Principal {
    constructor(public details: User) {
    }

    async isAuthenticated(): Promise<boolean> {
        return this.details.id !== undefined;
    }

    async isInRole(role: string): Promise<boolean> {
        return false;
    }

    async isResourceOwner(resourceId: any): Promise<boolean> {
        return false;
    }

    isGameMaster() {
        return this.details.isGameMaster;
    }
}
