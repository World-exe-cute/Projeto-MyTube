import "./CommentPost.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
import PostInfo from "./PostInfo";
import Comments from "../../VideoPlayer/Comments";

export default function CommentPost({}) {
  const dispatch = useDispatch();
  const { user, id } = useParams();
  const [comment, setComment] = useState();

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/posts/getComments/${id}`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      setComment(res.payload.comment);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <div id="post-profile">
      <div id="user-post" className="comment-post-container">
        <PostInfo params={{ id: id, user: user }} comment={false} />
      </div>
      {comment && <Comments options={comment} fetchInfo="/posts" />}
    </div>
  );
}
