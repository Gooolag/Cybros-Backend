import { createConnection } from "typeorm";
import express from "express";
import ormConfig from "./orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import { defaults } from "pg";
import passport from "passport";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
require("./passport");
const cookieSession = require('cookie-session');

declare module "express-session" {
  export interface SessionData {
    userID: string;
  }
}

const main = async () => {
  
  defaults.ssl = {
    rejectUnauthorized: false,
  };
  const conn = await createConnection(ormConfig);
  conn.runMigrations();
  const app = express();
  app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}))

const isLoggedIn = (req:any, res:any, next:any) => {
    if (req.user) {
        next();
    } else {
        res.send("not logged in ");
    }
}
app.use(cors({origin:"https://cybros-backend.herokuapp.com",credentials:true}));


  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    plugins:[ApolloServerPluginLandingPageGraphQLPlayground({})],
    context: ({ req, res }): MyContext => ({ req, res }),
    introspection: true,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT || 4000, () => {
    console.log("yep");
  });

  app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
if ('OPTIONS' == req.method) {
     res.send(200);
 } else {
     next();
 }
});

  app.use(session({ secret: "lol", resave: false, saveUninitialized: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    "/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

  app.get("/failed", (_, res) => {
    res.send("Failed");
  });

  app.get("/success", (_, res) => {
    res.send("succeded");
  });

  app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(_req, res) {
      // console.log("req==>",req);
    res.redirect('/success');
  });

  app.get("/me", isLoggedIn, (req,res) => {
    if (req.user)
      res.send(`Welcome ${req.user.first_name} ${req.user.last_name}`);
    else
      res.send("pp");
  })
};

main().catch((err) => {
  console.log(err);
});
