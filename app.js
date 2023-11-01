const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");
const app = express();

const configPath = './config/config.env';
dotenv.config({ path: configPath });

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.get("/", (req, res, next) => res.json({ message: "Server is running" }));

const { userRoute } = require('./src');
app.use('/api/user', userRoute);

app.all("*", async (req, res) => {
  res.status(404).json({
    error: {
      message: "Not Found. Kindly Check the API path as well as request type",
    },
  });
});

app.use(errorMiddleware);

module.exports = app;