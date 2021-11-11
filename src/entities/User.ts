import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity } from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @Column()
    acessToken: number;

    @Field()
    @Column()
    first_name: string;

    @Field()
    @Column()
    last_name: string;

}