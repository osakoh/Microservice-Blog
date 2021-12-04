import React, { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  //  handles form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:4000/posts", { title });

    // reset input
    setTitle("");

    // success message on console
    console.log("\nPost created successfully\n");
  };

  return (
    <div className='mt-2'>
      <h3>Create Post</h3>
      <form onSubmit={onSubmitHandler}>
        <div className='mb-2'>
          <label htmlFor='title' className='form-label'>
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id='title'
            type='text'
            className='form-control'
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
