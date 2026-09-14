import { NavLink } from "react-router-dom";
import "./CommentFeed.css";
import LikeButton from "./LikeButton";
import { useState } from "react";
import UserChannel from "./UserChannel";

export default function CommentFeed({ index, refInfo, comment, fetch }) {
  const [like, setLike] = useState(
    comment?.like.likeUser
      ? "like"
      : comment?.like.dislikeUser
        ? "dislike"
        : "",
  );

  return (
    <div className="feed-display" ref={refInfo}>
      <NavLink className="reset-config" to={`/${comment.userTag}`}>
        <UserChannel
          url={comment.userId?.photoUrl?.photo?.hash}
          name={comment.userId?.name}
        />
      </NavLink>
      <div className="commentFeed">
        <div className="userId">
          <div>{comment.userId.name}</div>
          <div>{comment.createdAt}</div>
        </div>
        <div className="comment">
          <p>{comment.comment}</p>
        </div>
        <div>
          <LikeButton
            likes={comment.like}
            likeToken="like"
            stateLike={{ like, setLike }}
            css="fa-solid fa-thumbs-up"
            fetchInfo={`${fetch}/commentLike`}
            commentInfo={comment._id}
          />
          <LikeButton
            likes={false}
            likeToken="dislike"
            stateLike={{ like, setLike }}
            css="fa-solid fa-thumbs-down"
            fetchInfo={`${fetch}/commentLike`}
            commentInfo={comment._id}
          />
          <div>Responder</div>
        </div>
      </div>
    </div>
  );
}
