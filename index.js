const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cors = require("cors");

const app = express();

app.use(express.json());

// note - uncaughtException should be on the top level to detect Bugs
process.on("uncaughtException", err => {
  console.log("uncaught exception...shutting down");

  console.log(err.name, ":", err.message);

  // note - This is not optional with uncaughtException
  // After error, entire Node Process is in unclean state.
  // To fix it, the process needs to terminate & restarted.
  process.exit(1);
});

require("./models/Demand");

require("./routes/dialogFlowRoutes")(app);
require("./routes/fulfillmentRoutes")(app);

app.use(cors());

dotenv.config({ path: "./config.env" });

// connect to database
const db = process.env.DATABASE;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

const server = app.listen(5001, () => console.log("app is running @5001!"));

// note - Unhandled Rejections are related to Promises
// Uncaught Exceptions are bugs related to Synchronous Code

// note - global unhandled promise rejections, async code
// subscribing unhandled rejection object here
// The on() method requires name of the event to handle and callback function which is called when an event is raised.
process.on("unhandledRejection", err => {
  // The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code.
  // Node normally exits with a 0 status code when no more async operations are pending.

  // 0 is a success code and 1 (or another number) can be a failure code.
  // 0 will be used if nothing is specified, 1 will stop the current process
  console.log("unhandled rejection...shutting down");

  console.log(err.name, ":", err.message);

  server.close(() => {
    // doing this will give server some time to finish current tasks and handle current requests pending
    // Only after that the server will be shut down
    process.exit(1);
  });
});
