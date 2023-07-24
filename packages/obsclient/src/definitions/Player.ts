import { User } from '@comlink/framework/dist/entity/User';

export type Player = Pick<User, 'id' | 'username'>;
