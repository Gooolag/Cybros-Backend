import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { User } from "./entities/User";

export default {
  extities: [User],
  type: "postgres",
  database: "potatoDB",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  logging: !__prod__,
  debug: !__prod__,
  synchronize: true,
} as Parameters<typeof createConnection>[0];
