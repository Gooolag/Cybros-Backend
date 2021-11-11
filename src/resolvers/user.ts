import { User } from "../entities/User";
import { Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class UserResolver {
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Query(()=>[User])
    async getAllUsers():Promise<User []>{
      console.log(User.find());
      return User.find();
    }
    
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
        console.log("inside me query !!");
      if (!req.user) {
        console.log("inside undefines")
        return undefined;
      }
      console.log(req.user.id);
      return User.findOne({ id: req.user.id });
    }

}
