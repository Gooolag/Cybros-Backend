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
  @Field()
  picture: string;
}

@InputType()
class idDetails {
  @Field()
  id:string;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Query(() => String)
    @UseMiddleware(AuthMiddleware)
    payload(
      @Ctx() {payload}:MyContext
    ) {
      console.log("ohoh",payload);
        return payload!.userId;
    }

    @Query(()=>[User])
    async getAllUsers():Promise<User []>{
        return User.find();
        
    }
    @Query(()=>[User])
    async getUser(
      @Arg("details") details:idDetails
    ):Promise<User | undefined>{
        const user = await User.findOne({where : {id:details.id}});
        return user;
        
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
      @Arg("details") details:idDetails,
      @Ctx(){res}:MyContext
    ): Promise<LoginResponse> {
      const user = await User.findOne({ where: {id:details.id}})
      console.log(`bokachoda ${user!.id}`);
      if(!user){
        throw new Error('cant find user !');
      }
      else{
          // successfullt logged in 
          // so we give them an access token
          sendRefreashToken(res,createRefreashToken(user));
          console.log(user);
          return {
            accessToken:createAccessToken(user),
          }
        }
      }
}
  
