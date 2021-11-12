import { AuthMiddleware } from '../AuthMiddleware';
import { createAccessToken, createRefreashToken } from './../auth';
import { MyContext } from './../MyContext';
import { User } from "../entities/User";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { sendRefreashToken } from '../sendRefreashToken';

@ObjectType()
class LoginResponse{
  @Field()
  accessToken: string
}
@InputType()
class UserDetails {
  @Field()
  first_name: string;
  @Field()
  last_name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
@InputType()
class loginDetails {
  @Field()
  email: string;
  @Field()
  password : string;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Query(() => String)
    @UseMiddleware(AuthMiddleware)
    bye(
      @Ctx() {payload}:MyContext
    ) {
        return payload!.userId;
    }

    @Query(()=>[User])
    async getAllUsers():Promise<User []>{
        return User.find();
        
    }
    @Mutation(() => User, { nullable: true })
    async register(
      @Arg("details") details: UserDetails
    ): Promise<User | undefined> {
      const course = await User.create(details).save();
      return course;
    }

    @Mutation(() => LoginResponse)
    async login(
      @Arg("details") details: loginDetails,
      @Ctx(){res}:MyContext
    ): Promise<LoginResponse> {
      const user = await User.findOne({where: {email:details.email}})
      if(!user){
        throw new Error('cant find user !');
      }
      else{
        if(user.password==details.password){
          // successfullt logged in 
          //so we give them an access token
          sendRefreashToken(res,createRefreashToken(user));

          return {
            accessToken:createAccessToken(user),
          }
        }
        else{
          throw new Error('wrong password !');
        }
      }
    }
  }
