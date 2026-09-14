import "./ShowPostBox.css";
import ChannelSquareBox from "./ChannelSquareBox";
import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Channel } from "../../App";

export default function ShowVideoBox({ posts, setCheck, activeDel, keyNum }) {
  const infoBoxTitle = useRef();
  const navigate = useNavigate();
  const { setVideoInfo, stepOption, showOption } = useContext(Channel);

  return (
    <div
      className="post-box"
      onClick={() => {
        setVideoInfo(posts);
        stepOption.setStep(2);
        showOption("show");
      }}
    >
      <div className="square-container">
        <ChannelSquareBox
          checkFunction={setCheck}
          activeDel={activeDel}
          checkOne={posts._id}
        />
      </div>
      <div className="post-container">
        <div
          className={`thumb-box ${posts.postImage.length !== 0 ? "image" : "text"}`}
          onClick={() => {
            navigate(`/myStudio/channel/posts/${posts._id}`);
          }}
        >
          {posts.postImage.length !== 0 &&
            posts.postImage
              .slice(0, 3)
              .map((item, i) => (
                <img
                  key={i}
                  className={`img${i}`}
                  src={`http://localhost:5000/api/posts/check-image/${item.hash}`}
                ></img>
              ))}
          {posts.postPoll.length !== 0 ? (
            <i className="fa-solid fa-square-poll-horizontal"></i>
          ) : (
            <i>{posts.postText.split("")[0]}</i>
          )}
        </div>
        <div className="info-box">
          <h2 ref={infoBoxTitle}>{posts.postText}</h2>
        </div>
      </div>
    </div>
  );
}
