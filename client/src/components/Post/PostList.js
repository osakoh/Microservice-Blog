import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "../Comment/CommentCreate";
import CommentList from "../Comment/CommentList";

const PostList = () => {
  // API returns an object of posts
  const [posts, setPosts] = useState({});

  // retrieves posts
  const getPosts = async () => {
    try {
      // from QueryService
      const res = await axios.get("http://localhost:4002/posts");

      // updates posts object
      setPosts(res.data);
    } catch (error) {
      console.log(`PostList => ${error.message}`);
    }
  };

  // run getPosts once
  useEffect(() => {
    getPosts();
  }, []);

  // Object.values: turns a given object into an Array
  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div className='col' key={post.id}>
        {/* <p className='card-title'>Post</p> */}
        <div className='shadow-lg rounded mb-2' key={post.id}>
          <div className='card-body'>
            <h4 className='bg-body p-2 text-white bg-primary'>{post.title}</h4>

            <CommentList comments={post.comments} />
            <CommentCreate postId={post.id} />
          </div>
        </div>
      </div>
    );
  });

  return (
    // <div className='d-flex flex-row flex-wrap justify-content-between'>
    <div className='row row-cols-1 row-cols-md-3 g-3'>{renderedPosts}</div>
  );
};

export default PostList;
