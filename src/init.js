import express from "express";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";

const app = express();
const PORT = 8000;
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/board", boardRouter);

const handleListener = () => {
  console.log(`Hello! let's start http://localhost:${PORT}`);
};

app.listen(PORT, handleListener);
