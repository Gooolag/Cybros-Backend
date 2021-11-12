declare namespace Express {
  export interface Request {
    user: import("./../../src/entities/User").User;
  }
}
