import passport  from "passport";
import { Strategy } from "passport-google-oauth2";

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//         done(null, user);
// });

var GoogleStrategy=Strategy;
passport.use(new GoogleStrategy({
      clientID:"527085962224-ll9s87m90fon1jl6c4ef6dadp52pcc7m.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "https://google.com",
    passReqToCallback   : true
},
function(request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
    console.log("hje");
  }
))