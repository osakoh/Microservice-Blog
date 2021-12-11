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
// comments object stores comments
const commentsByPostId = {};

// @route       GET /posts/:id/comments
// @description Get all comments belonging to a specific post
// @access      Public
app.get("/posts/:id/comments", (req, res) => {
  // send back comments belonging to a specific post id or an empty array if that post id has no comments
  res.send(commentsByPostId[req.params.id] || []);
});

// @route       POST  /posts/:id/comments
// @description Create new comment for a specific post
// @access      Public
app.post("/posts/:id/comments", async (req, res) => {
  // randomly generate comment id using crypto
  const commentId = randomBytes(4).toString("hex");
  // get content from body
  const { content } = req.body;

  // check if post id exist which has an array of comments or return empty post array
  const comments = commentsByPostId[req.params.id] || [];

  //   comments.push({ id: commentId, content: content });
  comments.push({ id: commentId, content, status: "pending" });

  // console.error("Comments this: ", comments);

  //  add comments back to commentsByPostId object
  commentsByPostId[req.params.id] = comments;

  // emit CommentCreated event to the EventBus
  try {
    // emit CommentCreated event to EventBus
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  } catch (error) {
    // show error message
    console.log(`Error in CommentCreatedEvent => ${error.message}`);
  }

  //   send created success status code
  // res.status(201).send(commentsByPostId[req.params.id]);
  res.status(201).send(comments);
});

// @route       POST /events
// @description Receive CommentModerated Event from ModerationService
// @access      Public
app.post("/events", async (req, res) => {
  // destructure from req body
  const { type, data } = req.body;

  // check for only CommentModerated events
  if (type === "CommentModerated") {
    // get comments from data
    const { postId, id, status, content } = data;

    // retreive relevent comment from object storing comments
    const comments = commentsByPostId[postId];

    // iterate over comments to find the comment to update
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    // update status of found comment
    comment.status = status;

    // emit CommentUpdated event to event-bus
    try {
      // emit CommentUpdated event to EventBus
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          content,
          postId,
          status,
        },
      });
    } catch (error) {
      // show error message
      console.log(`Error in CommentUpdatedEvent => ${error.message}`);
    }
  }

  // send success status code
  res.send({});
});

// port
const port = 4001;

app.listen(port, () => {
  console.log(`\nCommentService: Port ${port}\n`);
});
