import { Response } from "express";

export const sendRefreashToken=(res: Response, token: string)=> {
  res.cookie(
    'plsworkoriwillkillmyself',
    token, {
      httpOnly:true,
    }
  );
  console.log("yes");
}
