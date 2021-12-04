const express = require("express");
const axios = require("axios");
// init express
const app = express();

// middleware to use request.body in the routes
app.use(express.json({ extended: false }));

// post object stores posts
const posts = {};

// @route       GET /posts
// @description Get all posts
// @access      Public
app.get("/posts", (req, res) => {
  res.send(posts);
  // console.log(posts);
});

// @route       POST /events
// @description Receives CommentCreated Event from event-bus
// @access      Public
app.post("/events", async (req, res) => {
  // destructure content from body
  const { type, data } = req.body;

  //   variable to check for
  const check = "orange";

  // check type an emit event accordingly
  if (type === "CommentCreated") {
    //   moderate comment
    // make check case insensitive
    const status = data.content.toLowerCase().includes(check.toLowerCase())
      ? "rejected"
      : "approved";
    // check is case sensitive
    // const status = data.content.includes(check) ? "rejected" : "approved";

    // emit CommentModerated event to the QueryService
    try {
      // emit CommentCreated event to QueryService
      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          content: data.content,
          postId: data.postId,
          status,
        },
      });
    } catch (error) {
      // show error message
      console.log(`Error in CommentModeratedEvent => ${error.message}`);
    }
  }

  // send success status code
  res.send({});
});

const port = 4003;

app.listen(port, () => {
  console.log(`\Moderation =>  Port ${port}\n`);
});
