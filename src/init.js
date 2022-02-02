import express from "express";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import morgan from "morgan";

const app = express();
const PORT = 8000;
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use("/image",express.static(__dirname + "/image"));
app.use("/static",express.static(__dirname + "/assets"));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/board", boardRouter);

const handleListener = () => {
  console.log(`Hello! let's start http://localhost:${PORT}`);
};

app.listen(PORT, handleListener);
