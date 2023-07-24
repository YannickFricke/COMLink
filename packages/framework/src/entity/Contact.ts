import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({
        unique: true,
    })
    public name!: string;

    @ManyToOne(() => User, user => user.contacts)
    public owner!: User;
}
