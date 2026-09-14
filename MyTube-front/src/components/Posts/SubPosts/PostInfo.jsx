import "./PostInfo.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
import ImageMove from "../../ArrowList/ImageMove";
import PollView from "./SubPostComponent/PollView";
import LikeButton from "../../VideoPlayer/VideoInfoComponents/LikeButton";
import UserChannel from "../../VideoPlayer/VideoInfoComponents/UserChannel";

export default function PostInfo({ params, comment, option }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [postInfo, setPostInfo] = useState(false);
  const [images, setImages] = useState([]);
  const [like, setLike] = useState();

  useEffect(() => {
    getInfoPost();
  }, []);

  const getInfoPost = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/posts/getInfoPost/${params.id}`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      const postInfo = res.payload.postInfo;
      setPostInfo(postInfo);
      setLike(
        postInfo.like.likeUser
          ? "like"
          : postInfo.like.dislikeUser
            ? "dislike"
            : "",
      );

      const newArray = await Promise.all(
        postInfo.postImage.map(async (e) => {
          const image = await fetch(
            `http://localhost:5000/api/posts/check-image/${e.hash}`,
          );
          const blob = await image.blob();

          return blob;
        }),
      );

      setImages(newArray);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <>
      {postInfo && (
        <div className="feed-post-container">
          <div className="user-post-photo">
            <UserChannel
              url={postInfo.userId.photoUrl.photo?.hash}
              name={postInfo.userId.name[0]}
            />

            <div>
              <div>{postInfo?.userId.name}</div>
              <div>{postInfo?.createdAt}</div>
            </div>
          </div>
          <div className="user-post-info">
            <div className="post-text">{postInfo?.postText}</div>
            {images.length !== 0 && <ImageMove imgUrl={images} />}
            {postInfo?.postPoll.length !== 0 && (
              <PollView pollList={postInfo.postPoll} pollId={postInfo._id} />
            )}
          </div>
          <div className="post-options">
            <LikeButton
              likes={postInfo.like}
              likeToken="like"
              stateLike={{ like, setLike }}
              css="fa-solid fa-thumbs-up"
              fetchInfo={`/posts/likePost`}
              commentInfo={postInfo._id}
            />
            <LikeButton
              likes={false}
              likeToken="dislike"
              stateLike={{ like, setLike }}
              css="fa-solid fa-thumbs-down"
              fetchInfo={`/posts/likePost`}
              commentInfo={postInfo._id}
            />

            {comment && (
              <div
                onClick={() => {
                  navigate(`/profile/posts/${params.user}/${params.id}`);
                }}
              >
                <i className="fa-regular fa-message"></i>
                <span>{postInfo?.comments}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
