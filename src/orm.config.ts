import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { User } from "./entities/User";

export default {
  entities: [User],
  type: "postgres",
  username: "postgres",
  database: "cybruhDB",
  password:"2002",
  logging: !__prod__,
  synchronize: true,
} as Parameters<typeof createConnection>[0];
