import React from "react";
import PostCreate from "./components/Post/PostCreate";
import PostList from "./components/Post/PostList";

const App = () => {
  return (
    <div className='container'>
      <PostCreate />
      <hr className='mt-4 mb-3' />
      <p className='h4'>Post</p>
      <PostList />
    </div>
  );
};

export default App;
