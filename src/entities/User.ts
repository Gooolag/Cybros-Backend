import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity } from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @Column({primary:true})
    id: string;

    @Field()
    @Column({nullable: true})
    admin: boolean;

    @Field()
    @Column({default:false})
    first_name: string;

    @Field()
    @Column({nullable: true})
    last_name: string;
    
    @Field()
    @Column({nullable: true})
    email: string;

    @Column({nullable: true})
    password: string;

    @Field({nullable:true})
    @Column({nullable: true})
    picture: string;
}