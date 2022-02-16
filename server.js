const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const HttpException = require("./backend/utils/HttpException.utils");
const errorMiddleware = require("./backend/middleware/error.middleware");
const router = require("./backend/route");

// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware

// for deployment
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 5000);

app.use(`/vega`, router);

// 404 error
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});

// Error middleware
app.use(errorMiddleware);

// for deployment
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// starting the server
app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));

module.exports = app;
