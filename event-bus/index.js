const express = require("express");
const bodyParser = require("body-parser");
// import axios
const axios = require("axios");
// init express
const app = express();
// app.use(bodyParser.json());
// middleware to use request.body in the routes
app.use(express.json({ extended: false }));

// event-bus database: stores all incoming events
const events = [];

// @route       Post /events
// @description Post contents of request body to other services
// @access      Public
app.post("/events", (req, res) => {
  // send entire body (event) to other services (PostService, CommentService, QueryService, ModerationService)
  const event = req.body;

  // +++++++++++++++++++++++++++++++++++++++++++++++
  // add event to events array/database
  events.push(event);
  // +++++++++++++++++++++++++++++++++++++++++++++++

  // emit event to other services

  try {
    // emit to the PostService
    axios.post("http://posts-clusterip-srv:4000/events", event);

    // emit to the CommentService
    // axios.post("http://localhost:4001/events", event);

    // emit to the QueryService
    // axios.post("http://localhost:4002/events", event);

    // // emit to the ModerationService
    // axios.post("http://localhost:4003/events", event);
  } catch (error) {
    // show error message
    console.log(`Error in EventBus => ${error.message}`);
  } finally {
    // return success message
    res.send({ status: "OK" });
  }
});

// @route       Get /events
// @description Retrieves all events from event store/database
// @access      Public
app.get("/events", (req, res) => {
  // send out all events in event store/database
  res.send(events);
});

// port
const port = 4005;

app.listen(port, () => {
  console.log(`\nEventBus => Port ${port}\n`);
});
