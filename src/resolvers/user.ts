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
        console.log("inside me query !!",req.session);
      if (!req.session) {
        console.log("inside undefines")
        return undefined;
      }
      console.log(req.session);
      return User.findOne({ id: "re" });
    }

}
