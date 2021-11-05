import { createConnection } from "typeorm"
import express from 'express'
import ormConfig from "./orm.config"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { UserResolver } from "./resolvers/user"
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
    app.listen(4000, () => {
        console.log("server is running on port 4000")
    })
}
main()