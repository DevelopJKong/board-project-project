import "./db";
import "./models/Board";
import app from "./server";

const PORT = 8000;

const handleListener = () => {
  console.log(`Hello! let's start http://localhost:${PORT}`);
};

app.listen(PORT, handleListener);
