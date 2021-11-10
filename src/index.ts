import { createConnection } from "typeorm";
import express, { Router } from "express";
import ormConfig from "./orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import { defaults } from "pg";
import passport from "passport";
require("./passport");
const router=Router();
const main = async () => {
  defaults.ssl = {
    rejectUnauthorized: false,
  };
  const conn = await createConnection(ormConfig);
  conn.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    introspection: true,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT || 4000, () => {
    console.log("yep");
  });

  app.use(session({ secret: "lol", resave: false, saveUninitialized: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile"],
    })
  );

  app.get("/failed", (_, res) => {
    res.send("Failed");
  });

  app.get("/success", (_, res) => {
    res.send("succeded");
  });
  
  router.get("/", passport.authenticate("google"), (_, res) => {
    console.log("works ?");
    res.redirect("/success");
  });
  app.use('/google', router);

};

main().catch((err) => {
  console.log(err);
});
