import { createConnection } from "typeorm";
import express from "express";
import ormConfig from "./orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { defaults } from "pg";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { auth } from "express-openid-connect";
import { User } from "./entities/User";

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "https://cybros-backend.herokuapp.com",
  clientID: "PAKI1xfasSuwPDbJYzRqQUFjadfBsFgm",
  issuerBaseURL: "https://dev-eee3ntvm.us.auth0.com",
};

const main = async () => {
  defaults.ssl = {
    rejectUnauthorized: false,
  };
  const conn = await createConnection(ormConfig);
  conn.runMigrations();

  const app = express();

  app.use(auth(config));

  app.use(
    cors({ origin: "https://cybros-backend.herokuapp.com", credentials: true })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
    context: ({ req, res }): MyContext => ({ req, res }),
    introspection: true,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT || 4000, () => {
    console.log("yep");
  });

  app.post("/callback", async (req, res) => {
    const info = req.oidc.user;
    if (!info) {
      console.log("nope");
      return res.send(401);
    }
    const user = await User.findOne({ id: info.sub });
    if (!user) {
      console.log("registering");
      await User.create({
        id: info.sub,
        email: info.email,
        first_name: info.given_name,
        last_name: info.family_name,
        picture: info.picture,
      }).save();
    }
    console.log("done");
    return res.send("succeded");
  });
};

main().catch((err) => {
  console.log(err);
});
