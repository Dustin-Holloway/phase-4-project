import { useState, React } from "react";

export default function Comment({
  comments,
  setComments,
  currentListing,
  username,
}) {
  const [comment, setComment] = useState({
    content: "",
    user_id: username.id,
  });

  function handleRemove(item) {
    fetch(`/comments/${item.id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setComments((comments) =>
          comments.filter((comment) => comment.id !== item.id)
        );
      }
    });
  }

  function handlePost(comment) {
    const newComment = {
      ...comment,
      listing_id: currentListing.id,
    };

    fetch("/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newComment),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments([
          ...comments,
          {
            ...data,
            comment_type: data.comment_type,
            content: data.content,
            id: data.id,
            listing_id: data.listing_id,
          },
        ]);
        setComment({ content: "" });
      });
  }

  const commentList = comments
    .filter((comments) => comments.listing_id === currentListing.id)
    .map((item) => (
      <li className="comment" key={item.id}>
        {item.content}
        <button className="buttons" onClick={(e) => handleRemove(item)}>
          Remove
        </button>
      </li>
    ));

  return (
    <div className="comment_section">
      <div className="comment_list">{commentList}</div>
      <div className="comment_group">
        <input
          className="comment_form"
          type="text"
          value={comment.content}
          name="content"
          placeholder="leave a comment"
          onChange={(e) =>
            setComment({ ...comment, [e.target.name]: e.target.value })
          }
        />
        <button onClick={() => handlePost(comment)}>Post</button>
      </div>
    </div>
  );
}
