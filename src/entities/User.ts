import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity } from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @Column({primary:true})
    id: string;

    @Field()
    @Column()
    first_name: string;

    @Field()
    @Column()
    last_name: string;
    
    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    picture: string;

}