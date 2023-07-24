import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from './Contact';

export type APIUser = Omit<User, 'password'>;

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({
        unique: true,
    })
    public username!: string;

    @Column({
        select: false,
    })
    public password!: string;

    @Column({
        default: false,
    })
    public isGameMaster!: boolean;

    @OneToMany(() => Contact, (contact) => contact.owner)
    public contacts!: Contact[];
}
