<<<<<<< HEAD
// create a simple express server on port 3000

import express from "express";

import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
=======
import express from 'express'

const app = express()

const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log('Hello world');
});

export default app;
>>>>>>> upstream/main
