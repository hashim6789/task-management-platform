import { env } from "@/configs";
import { Response } from "express";

export function setCookie(res: Response, refreshToken: string, entity: string) {
  res.cookie(entity, refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: false,
    sameSite: "strict",
    // secure: process.env.NODE_ENV === "production",
    // sameSite: env.NODE_ENV === "production" ? "none" : "strict",
  });
}

export function deleteCookie(res: Response, entity: string) {
  res.clearCookie(entity, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    // secure: process.env.NODE_ENV === "production",
    // sameSite: env.NODE_ENV === "production" ? "none" : "strict",
  });
}
