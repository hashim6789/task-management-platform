import { Router } from "express";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);

export { apiRouter };
