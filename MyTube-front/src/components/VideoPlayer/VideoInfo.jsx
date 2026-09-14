import { useState } from "react";
import "./VideoInfo.css";

//components
import SubScribe from "./VideoInfoComponents/SubScribe";
import DescriptionBar from "./VideoInfoComponents/DescriptionBar";
import { NavLink } from "react-router-dom";
import LikeButton from "./VideoInfoComponents/LikeButton";
import ShareButton from "./VideoInfoComponents/ShareButton";
import UserChannel from "./VideoInfoComponents/UserChannel";

export default function VideoInfo({ options }) {
  const [like, setLike] = useState(
    options.like.likeUser ? "like" : options.like.dislikeUser ? "dislike" : "",
  );

  return (
    <div id="VideoInfo">
      <div className="title">{options.title}</div>
      <div className="videoButtons">
        <div className="channelBar">
          <NavLink
            className="reset-config"
            to={`/profile/videos/${options.userTag}`}
          >
            <UserChannel url={options.userPhoto} name={options.name} />

            {options.name}
          </NavLink>
          <SubScribe
            userInscription={options.checkUserInscription}
            userTag={options.userTag}
          />
        </div>
        <div className="channelBar">
          <div className="likeBox">
            <div className="like">
              <LikeButton
                likes={options.like}
                likeToken="like"
                stateLike={{ like, setLike }}
                css="fa-solid fa-thumbs-up"
                fetchInfo={`/videos/like`}
              />
            </div>
            <div>
              <LikeButton
                likes={false}
                likeToken="dislike"
                stateLike={{ like, setLike }}
                css="fa-solid fa-thumbs-down"
                fetchInfo={`/videos/like`}
              />
            </div>
          </div>
          <div>
            <ShareButton />
          </div>
        </div>
      </div>
      <DescriptionBar options={options} />
    </div>
  );
}
