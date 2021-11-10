import { createConnection } from "typeorm"
import express from 'express'
import ormConfig from "./orm.config"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { UserResolver } from "./resolvers/user"
import session from "express-session"
// import passport from "passport"
const passport = require('passport');
require('./passport');
const main = async () => {
    const conn = await createConnection(ormConfig)
    conn.runMigrations()
    const app = express()
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false,
        })
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app })
    app.listen(3000, () => {
        console.log("server is running on port 4000")
    })
    app.use(session({secret:"lol",resave: false,
      saveUninitialized: false,}))
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
    ));

    app.get("/failed", (req, res) => {
    res.send("Failed")
})
app.get("/success", (req, res) => {
    res.send(`Welcome ${req.user.email}`)
})


    app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
        
    }),
    function (req, res) {
        console.log("works ?")
        res.redirect('https://google.com')

    })
}
main()