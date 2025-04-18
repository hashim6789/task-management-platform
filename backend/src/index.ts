//* libraries and packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

//* validating all the env
import { validateEnv } from "@/utils";

validateEnv();

//* configs
import { connectDb } from "@/configs";
// import { connectRedis } from "@/configs";

//* routers
// import authRouter from "@/routers/auth.router";
import { notFoundHandler } from "@/middlewares";
import { errorHandler } from "@/middlewares";
import { env } from "@/configs";
import { apiRouter } from "./routers";
// import profileRouter from "./routers/profile.router";
// import blogRouter from "./routers/blog.router";

const app = express();
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();
// connectRedis();

app.use("/api", apiRouter);
// app.use("/api/profile", profileRouter);
// app.use("/api/blog", blogRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`Server started at ${env.PORT} ✅`));
