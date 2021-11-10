import { createConnection } from "typeorm";
import { User } from "./entities/User";

export default{
        type: "postgres",
        database: "cybros backend",
        synchronize: true,
        logging: true,
        username: "postgres",
        password: "Shivral31",
        entities: [User]
    }as Parameters<typeof createConnection>[0];