import "./LikeButton.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { authThunk } from "../../../slices/authSlice";

export default function LikeButton({
  likes,
  stateLike,
  likeToken,
  css,
  fetchInfo,
  commentInfo,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [likeCount, setLikeCount] = useState(likes.likeCount);

  const fetchLike = async () => {
    const formData = {};
    const infoData = {};

    formData.hash = commentInfo ? commentInfo : id;
    formData.button = `${likeToken === "like" ? "like" : "dislike"}`;
    infoData.fetch = fetchInfo;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      if (res.payload.data.like === true) {
        setLikeCount(likes.likeCount + 1);
        stateLike.setLike("like");
      } else if (res.payload.data.dislike === true) {
        setLikeCount(likes.likeCount);
        stateLike.setLike("dislike");
      } else {
        setLikeCount(likes.likeCount);
        stateLike.setLike("");
      }
    } else {
      const parse = res.payload;
      console.log(parse);
      if (parse === "usuario nao autorizado.") {
        navigate("/login");
      }
    }
  };

  return (
    <div
      className={`like-button ${likeToken} ${
        stateLike.like === likeToken ? "active" : ""
      }`}
      onClick={() => {
        fetchLike();
      }}
    >
      <div aria-hidden="true">
        <i className={`${css}`}></i>
      </div>
      <div>{likeToken === "like" ? likeCount : ""}</div>
    </div>
  );
}
