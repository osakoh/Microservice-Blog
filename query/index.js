const express = require("express");
// avoid Cross-Origin Request(cors) Blocked
const cors = require("cors");
// import axios
const axios = require("axios");

// init express
const app = express();
// middleware to use request.body in the routes
app.use(express.json({ extended: false }));
// cors middleware
app.use(cors());

// object to store all the posts and comments
const posts = {};

// handles PostCreated, CommentCreated and CommentUpdated events
const handleEvents = (type, data) => {
  // check for PostCreated event
  if (type === "PostCreated") {
    // {type: "PostCreated", data: { id, title }
    const { id, title } = data;
    // insert into posts object & initialise an empty array of comments. E.g, { id: '97921154', title: 'sdgsdg', comments: [] }
    posts[id] = { id, title, comments: [] };
  }

  // check for CommentCreated event
  if (type === "CommentCreated") {
    //  {type: "CommentCreated", data: { id: commentId, content, postId: req.params.id, status: 'pending' }
    const { id, content, postId, status } = data;
    // find post in posts object
    const post = posts[postId];
    // add comments to the post within the posts object
    post.comments.push({ id, content, status });
  }

  // check for CommentUpdated event
  if (type === "CommentUpdated") {
    //  {type: "CommentUpdated", data: { id, content, postId, status}
    const { id, content, postId, status } = data;
    // find post in posts object
    const post = posts[postId];

    // iterate over post object to find the comment to update
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    // update comment
    comment.status = status;
    comment.content = content;
  }
};

// @route       Get /posts
// @description Retrieve all posts
// @access      Public
app.get("/posts", (req, res) => {
  // return the entire post object
  res.send(posts);
});

// @route       Post /posts
// @description Receives event from the event bus
// @access      Public
app.post("/events", (req, res) => {
  // destructure type & data from request body
  const { type, data } = req.body;

  // call handleEvents function
  handleEvents(type, data);

  // send back response
  res.send({});
});

// port
const port = 4002;

app.listen(port, async () => {
  console.log(`\nQueryService :: Port ${port}\n`);

  // make request to event bus to get events emitted
  try {
    // retrieve all events from the event store/database in event-bus service
    const res = await axios.get("http://localhost:4005/events");

    // iterate over events occurred
    for (let event of res.data) {
      // display progress report
      console.log(`Processing event =: ${event.type}`);

      // call handleEvents function
      handleEvents(event.type, event.data);
    }
  } catch (error) {
    // show error message
    console.log(`Error in Processing events :: ${error.message}`);
  }
});

/* Switch Statement & Example of what's contained in the posts object
posts ===
  {
    s4gf834: {
      id: "s4gf834",
      title: "Post one",
      comments: [
        { id: "34ksda", content: "comment one" },
        { id: "56fdgg", content: "two comments" },
        { id: "01tgop", content: "comment three" },
      ],
    },

    pl4dsfa: {
      id: "pl4dsfa",
      title: "The second post",
      comments: [
        { id: "5jk34h", content: "comment one" },
        { id: "w5wqjk", content: "two comments" },
        { id: "0dfgsf", content: "comment three" },
      ],
    },
  };




   // switch statement
  switch (type) {
    // check for PostCreated event
    case "PostCreated": {
      // {type: "PostCreated", data: { id, title }
      const { id, title } = data;
      // insert into posts object & initialise an empty array of comments. E.g, { id: '97921154', title: 'sdgsdg', comments: [] }
      posts[id] = { id, title, comments: [] };
    }

    // check for CommentCreated event
    case "CommentCreated": {
      //  {type: "CommentCreated", data: { id: commentId, content, postId: req.params.id, status: 'pending' }
      const { id, content, postId, status } = data;
      // find post in posts object
      const post = posts[postId];
      // add comments to the post within the posts object
      post.comments.push({ id, content, status });
    }

    // check for CommentUpdated event
    case "CommentUpdated": {
      //  {type: "CommentUpdated", data: { id, content, postId, status}
      const { id, content, postId, status } = data;
      // find post in posts object
      const post = posts[postId];

      // iterate over post object to find the comment to update
      const comment = post.comments.find((comment) => {
        return comment.id === id;
      });

      // update comment
      comment.status = status;
      comment.content = content;
    }

    default:
      comment;
    // console.log("type(Query) | ", type);
    // // print out data structure of posts object
    // console.log("posts object |> ", posts);
  }
 */
