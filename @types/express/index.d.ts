declare namespace Express {
  export interface Request {
    passport: { user: import("./../../src/entities/User").User };
    user: import("./../../src/entities/User").User;
  }
}
