import express from "express";

const app = express();
const PORT = 8000;


const handleListener = () => {
    console.log(`Hello! let's start http://localhost:${PORT}`);
}

app.get("/",(req,res)=>{
    res.send("Hello! frist project start!");
})

app.listen(PORT,handleListener);


