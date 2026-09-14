import "./ChannelPostEdit.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../../slices/authSlice";
import ImageMove from "../../../../components/ArrowList/ImageMove";

export default function ChannelPostEdit() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [pollPercent, setPollPercent] = useState([]);
  const [buttonActive, setButtonActive] = useState(false);
  const [postInfo, setPostInfo] = useState({
    postText: "",
    postImage: [],
    postPoll: [],
    postPublic: true,
    like: 0,
    comments: 0,
    allPollCheck: 0,
  });

  useEffect(() => {
    getOnlyPost();
  }, []);

  const getOnlyPost = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/posts/getOnlyPost/${id}`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      const postInfo = res.payload.posts;

      const newArray = await Promise.all(
        postInfo.postImage.map(async (e) => {
          const image = await fetch(
            `http://localhost:5000/api/posts/check-image/${e.hash}`,
          );
          const blob = await image.blob();

          return blob;
        }),
      );

      const allNum = postInfo.postPoll.map((item) => Number(item.check) || 0);
      const num = allNum.reduce((e, num) => e + num, 0);
      const percent = allNum.map((e) => (num ? (e / num) * 100 : 0));

      setPollPercent(percent);
      setPostInfo((e) => ({
        postText: postInfo.postText,
        postImage: newArray,
        postPoll: postInfo.postPoll,
        postPublic: postInfo.postPublic,
        like: postInfo.like,
        comments: postInfo.comments,
        allPollCheck: postInfo.allPollCheck,
      }));
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <div id="post-edit">
      <div>
        <div className="text-box">
          <h2>Texto</h2>
          <p>{postInfo.postText}</p>
        </div>
        {postInfo.postImage.length !== 0 ? (
          <div className="image-box">
            <ImageMove imgUrl={postInfo.postImage} />
          </div>
        ) : (
          postInfo.postPoll.length !== 0 && (
            <div className="image-box">
              {postInfo.postPoll.map((item, i) => (
                <div key={i} className={`poll ${item.checkUser ? "view" : ""}`}>
                  <div className="check"></div>
                  <div
                    className={`poll-line ${pollPercent[i] !== 0 ? "check" : ""}`}
                  >
                    <span
                      className="collor-bar"
                      style={{ left: `${pollPercent[i] - 100}%` }}
                    ></span>
                    <div>{item.text}</div>
                    <div
                      className={`percent ${postInfo.postPoll.some((e) => e.checkUser === true) ? "view" : ""}`}
                    >{`${pollPercent[i]}%`}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        <div className="visibility-box">
          <h2>Status de visibilidade</h2>
          <button
            className={buttonActive ? "active" : ""}
            onClick={() => {
              setButtonActive(true);
            }}
            onBlur={() => {
              setButtonActive(false);
            }}
          >
            <div
              onClick={() => {
                setPostInfo((e) => ({ ...e, postPulic: false }));
              }}
            >
              <div>Privado</div>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div
              onClick={() => {
                setPostInfo((e) => ({ ...e, postPublic: true }));
              }}
            >
              Publico
            </div>
          </button>
        </div>
      </div>
      <div>
        <div className="post-info">
          <div>
            <div>
              <h2>Like</h2>
              <div>{Number(postInfo.like)}</div>
            </div>
            <div>
              <h2>Comentario</h2>
              <div>{Number(postInfo.comments)}</div>
            </div>
            {postInfo.postPoll.length !== 0 && (
              <div>
                <h2>Votos</h2>
                <div>{postInfo.allPollCheck}</div>
              </div>
            )}
          </div>
          <div className="post-type">
            <h2>Tipo</h2>
            {postInfo.postImage.length !== 0 ? (
              <div className="type-box">
                <i className="fa-solid fa-image"></i>
                <p>Imagem</p>
              </div>
            ) : postInfo.postPoll.length !== 0 ? (
              <div className="type-box">
                <i className="fa-solid fa-square-poll-vertical"></i>
                <p>Enquete</p>
              </div>
            ) : (
              <div className="type-box">
                <i>A</i>
                <p>Texto</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
