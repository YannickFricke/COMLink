import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public sender!: string;

    @Column()
    public recipient!: string;

    @Column()
    public content!: string;

    @Column()
    public timestamp!: Date;
}
