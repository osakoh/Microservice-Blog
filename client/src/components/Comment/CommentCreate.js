import React, { useState } from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");

  // handles form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });

    // reset form
    setContent("");

    // test submission
    console.log(`Comment added for post with id ${postId}`);
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <div className='form-group'>
          {/* <label htmlFor='comment' className='mt-2'>
            New Comment
          </label> */}
          <input
            placeholder='Enter new Comment'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <button className='btn btn-sm btn-primary mt-2'>Comment</button>
      </form>
    </div>
  );
};

export default CommentCreate;
