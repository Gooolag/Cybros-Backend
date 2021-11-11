import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "./entities/User";

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user);

});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

var GoogleStrategy = Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "527085962224-ll9s87m90fon1jl6c4ef6dadp52pcc7m.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://cybros-backend.herokuapp.com/google/callback",
      passReqToCallback: true,
    },
    function (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      console.log("hje");
      console.log(accessToken);
      request;
      accessToken;
      refreshToken;
      profile;
      done;
      const res=User.create({acessToken:accessToken,first_name:"res",last_name:"res"})
      return done(null,res);
    }
  )
);
