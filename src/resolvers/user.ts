import { User } from "../entities/User";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class UserResolver {
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Query(()=>[User])
    async getAllUsers():Promise<User []>{
        return User.find();
        
    }

    }
