import { env } from "./env.config";

export const corsConfig = {
  // origin: "http://localhost:3000",
  origin: env.CLIENT_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type"],
};
