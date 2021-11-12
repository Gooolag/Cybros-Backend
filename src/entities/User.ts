import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Column({primary:true})
    id: number;

    @Field()
    @Column()
    first_name: string;

    @Field()
    @Column()
    last_name: string;
    
    @Field()
    @Column()
    email: string;

    @Column()
    password: string;

    @Field()
    @Column({nullable: true})
    picture: string;

    @Field()
    @Column({nullable: true})
    cf_username: string;
}