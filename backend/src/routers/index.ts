import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { taskRouter } from "./task.route";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/tasks", taskRouter);

export { apiRouter };
