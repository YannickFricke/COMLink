import { inject, injectable } from 'inversify';
import { UserRepository } from '@comlink/framework/dist/entity/repositories/UserRepository';
import { Connection } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { APIUser, User } from '@comlink/framework/dist/entity/User';
import { genSaltSync, hashSync } from 'bcrypt';
import { BaseService } from './BaseService';
import { RegisterInput } from '../inputs/auth/RegisterInput';

@injectable()
export class UserService extends BaseService<User> {
    private userRepository: UserRepository;

    constructor(@inject(Connection) connection: Connection) {
        super();
        this.userRepository = connection.getCustomRepository(UserRepository);
    }

    async getAllUsers() {
        return await this.userRepository.find({
            select: ['id', 'username', 'isGameMaster'],
        });
    }

    async getSingleUser(userId: string): Promise<User> {
        return await this.userRepository.findOneOrFail({
            select: ['id', 'username', 'isGameMaster'],
            relations: ['contacts', 'contacts.owner'],
            where: {
                id: userId,
            },
        });
    }

    async getSingleUserWithPassword(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail({
            select: ['id', 'username', 'password', 'isGameMaster'],
            relations: ['contacts', 'contacts.owner'],
            where: {
                username,
            },
        });
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail({
            where: {
                username,
            },
        });
    }

    async createNewUser(payload: RegisterInput): Promise<APIUser> {
        const errors = await validate(payload);

        if (errors.length > 0) {
            throw errors;
        }

        const { username, password } = payload;

        if (await this.userRepository.checkIfUsernameIsTaken(username)) {
            const error = new ValidationError();
            error.target = payload;
            error.value = username;
            error.property = 'username';
            error.constraints = {
                usernameTaken: `The username ${username} is already taken`,
            };

            throw error;
        }

        const user = new User();
        const salt = genSaltSync();
        const hashedPassword = hashSync(password, salt);

        user.username = username;
        user.password = hashedPassword;
        user.isGameMaster = (await this.getAllUsers()).length === 0;
        user.contacts = [];

        const savedUser = await this.userRepository.save(user);

        delete savedUser.password;

        return savedUser;
    }

    async updateUser(
        userId: string,
        payload: Partial<User>,
    ) {
        const foundUser = await this.getSingleUser(userId);

        this.updateEntity(payload, foundUser);

        try {
            await this.userRepository.save(foundUser);

            return foundUser;
        } catch (error) {
            throw error;
        }
    }
}
