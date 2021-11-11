import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "./entities/User";

passport.serializeUser((profile, done) => {
  console.log("profile", profile);
  done(null, profile);

});

passport.deserializeUser(async (profile: any, done) => {
  const res=await User.findOne({id:profile.sub});
  if(res==undefined){
    console.log("did not find user");
    const userCreated=await User.create({id:profile.sub,first_name:profile.given_name,last_name:profile.family_name,email:profile.email,picture:profile.picture}).save();
    return done(null,userCreated);
    // return done(null,null);
  }
  console.log(`found user${profile.first_name}`)
  
  return done(null, res);
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
      proxy:true
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
      // const res=await User.create({acessToken:accessToken,first_name:"res",last_name:"res"})
      return done(null,profile._json);
    }
  )
);
