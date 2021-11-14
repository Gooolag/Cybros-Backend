import { createAccessToken, createRefreashToken } from './auth';
import 'dotenv/config';
// import { ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"
import { createConnection } from "typeorm";
import express from "express";
import ormConfig from "./orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import { sendRefreashToken } from './sendRefreashToken';
import cors from 'cors';
import { MyContext } from './MyContext';
import passport from 'passport';
require("./passport");

import session from 'express-session';


const main = async () => {

  const conn = await createConnection(ormConfig);
  conn.runMigrations();
  const app = express();

  //cors shit
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.get("/", (_req, res) => res.send("hello"));

  app.use(session({ secret: "lol", resave: false, saveUninitialized: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/success", (_, res) => {
    res.send("succeded");
  });

  app.get(
    "/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );
  app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
  function(req, res) {
      console.log("req==>",req);
    res.redirect(`http://localhost:3000/login/${req.user.sub}`);
  });
  //cookie only works in this route
  app.post("/refreash_token", async (req, res, _next) => {

    const token = req.cookies.plsworkoriwillkillmyself;
    if (!token) {
      return res.send({ ok: false, accessToken: '' })
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch {
      return res.send({ ok1: false, accessToken: '' })
    }
    // IF THE TOKEN IS VALID WE RETURN BACK AN ACCESS TOKEN 
    const user = await User.findOne({ id: payload.userId })
    if (!user) {
      return res.send({ ok2: false, accessToken: '' })
    }

    //refreash the refreash token 
    sendRefreashToken(res, createRefreashToken(user));

    //retuning a brand new assess token
    return res.send({ ok: false, accessToken: createAccessToken(user) })
  })

  const apolloServer = new ApolloServer({

    schema: await buildSchema({
      resolvers: [
        UserResolver
      ],
      validate: false,
    }),
    // plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
    context: ({ req, res }): MyContext => ({ req, res }),
    introspection: true,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT || 4000, () => {
    console.log("yep");
  });

};

main().catch((err) => {
  console.log(err);
});
