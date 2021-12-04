import React from "react";

const CommentList = ({ comments }) => {
  // map over comments
  const renderComments = comments.map((comment) => {
    let content;

    // switch statement
    // destructure status from comment
    const { status } = comment;
    switch (status) {
      // approved comment
      case "approved":
        content = comment.content;
        break;

      // rejected comment
      case "rejected":
        content = <del>This comment was rejected</del>;

        break;

      // pending comment
      default:
        content = <i>Awaiting moderation</i>;
    }

    return (
      <li
        className='list-group-item list-group-item-action mb-2'
        key={comment.id}
      >
        {content}
      </li>
    );
  });

  return (
    <ol className='list-group list-group-numbered  list-group-flush'>
      {renderComments}
    </ol>
  );
};

export default CommentList;

// // approved comment
// if (comment.status === "approved") {
//   content = comment.content;
// }

// // pending comment
// if (comment.status === "pending") {
//   content = <i>Awaiting moderation</i>;
// }

// // rejected comment
// if (comment.status === "rejected") {
//   content = <b>This comment was rejected</b>;
// }
