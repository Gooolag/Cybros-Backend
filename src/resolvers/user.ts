import { User } from "../entities/User";
import { Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class UserResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    console.log(User.find());
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    console.log("inside me query !!");
    if (!req.oidc.isAuthenticated()) {
      console.log("undef");
      return undefined;
    }
    console.log(req.oidc.user);
    const user = await User.findOne({ id: "0" });
    return user;
  }
}
