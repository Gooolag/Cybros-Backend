import {verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql"
import { MyContext } from "./MyContext"
// bearer y87265817thv2t24t2t
export const AuthMiddleware: MiddlewareFn<MyContext> = ({context}, next) => {
  const authorization =context.req.headers['authorization']
  console.log("hola",authorization)
  if (!authorization){
    throw new Error("not authorized1");
  }
  try{
    const token = authorization?.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)
    context.payload=payload as any;
  }catch(err){
    console.log(err)
    throw new Error("not authorized");
    
  }
  return next()  
}
