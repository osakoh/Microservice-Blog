const express = require("express");
// to generate random id for every post request
const { randomBytes } = require("crypto");
// avoid Cross-Origin Request(cors) Blocked
const cors = require("cors");
// import axios
const axios = require("axios");

// init express
const app = express();
// middleware to use request.body in the routes
app.use(express.json({ extended: false }));
// cors
app.use(cors());
// post object stores posts
const posts = {};

// @route       GET /posts
// @description Get all posts
// @access      Public
app.get("/posts", (req, res) => {
  res.send(posts);
  // console.log(posts);
});

// @route       POST /posts
// @description Create new post
// @access      Public
app.post("/posts", async (req, res) => {
  // randomly generate id using crypto
  const id = randomBytes(4).toString("hex");
  // get title from body
  const { title } = req.body;

  // add id & title to post object i.e, posts[id] = { id, title };
  posts[id] = { id, title };

  // emit PostCreated event(containing a type and data) to the EventBus
  try {
    // emit PostCreated event to EventBus
    await axios.post("http://localhost:4005/events", {
      type: "PostCreated",
      data: { id, title },
    });
  } catch (error) {
    // show error message
    console.log(`Error in PostCreatedEvent => ${error.message}`);
  }

  //   send created success status code and created post back
  res.status(201).send(posts[id]);
  // console.log("posts[id] ->", posts[id]);
});

// @route       POST /events
// @description Receive PostCreated Event
// @access      Public
app.post("/events", (req, res) => {
  // destructure from req body
  const { type } = req.body;

  // receive only PostCreatedEvent
  if (type === "PostCreated") {
    // log events
    console.log("Received PostCreatedEvent from posts");
  }
  // send success status code
  res.send({});
});

const port = 4000;

app.listen(port, () => {
  console.log(`\nPostService ::  Port ${port}\n`);
});

/**
 * For @description Create new post
   *  add id & title to post object i.e, posts[id] = { id, title };
   * {
    "142789ec": {
        "id": "142789ec",
        "title": "new post"
    },
    "3971b828": {
        "id": "3971b828",
        "title": "My second post"
    }
}
   */
