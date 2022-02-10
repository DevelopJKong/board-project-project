import "dotenv/config";
import "./db";
import "./models/Board";
import "./models/User";
import app from "./server";

const PORT = 5050;


const handleListener = () => {
  console.log(`Hello! let's start http://localhost:${PORT}`);
};

app.listen(PORT, handleListener);
