import "./UserPosts.css";
import { Channel } from "../../../App";
import { useContext, useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { authThunk } from "../../../slices/authSlice";
import ImageMove from "../../../components/ArrowList/ImageMove";
import PollPost from "../../../components/Posts/PollPost";
import FeedPost from "../../../components/Posts/FeedPost";
import ObserverEffect from "../../../utils/ObserverEffect";
import UserChannel from "../../../components/VideoPlayer/VideoInfoComponents/UserChannel";

export default function UserPosts({ userInfo }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useParams();
  const { tokenInfo, load } = useContext(Channel);
  const [clickPost, setClickPost] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState(false);
  const [poll, setPoll] = useState(false);
  const [pollText, setPollText] = useState(false);
  const [allPost, setAllPost] = useState([]);
  const [postHash, setPostHash] = useState([]);
  const [order, setOrder] = useState(true);
  const [openOrder, setOpenOrder] = useState(false);
  const [userTag, setUserTag] = useState();
  const [cancelObserver, setCancelObserver] = useState(false);

  const [loading, setLoading] = useState(false);

  const endLoad = useRef(false);

  const postRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    getPosts();
  }, [user, order]);

  useEffect(() => {
    if (!loading) return;

    const percentUp = setInterval(() => {
      load.setLoad((e) => {
        if (endLoad.current) {
          clearInterval(percentUp);
          endLoad.current = false;
          return 100;
        } else if (e === 80) {
          return e;
        } else {
          return e + 1;
        }
      });
    }, 20);
  }, [loading]);

  const postResize = () => {
    const postBox = postRef.current;

    postBox.style.height = "auto";
    postBox.style.height = postBox.scrollHeight + "px";

    if (postBox.scrollHeight > 100) {
      postBox.style.height = "100px";
      postBox.style.overFlowY = "auto";
    } else {
      postBox.style.overFlowY = "hidden";
    }
  };

  const setPost = async () => {
    const formData = new FormData();
    const infoData = {};

    formData.append("text", `${text}`);

    if (image) {
      image.forEach((file) => {
        formData.append("photo", file);
      });
    } else {
      formData.append("photo", []);
    }

    formData.append("pollText", pollText);

    infoData.fetch = `/posts/setPost`;
    infoData.path = "POST";
    infoData.image = true;

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      navigate(0);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  const getPosts = async () => {
    const formData = {};
    const infoData = {};
    setLoading(true);

    formData.postHash = postHash;
    formData.order = order;
    infoData.fetch = `/posts/getPost/${user}`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));
    endLoad.current = true;
    setLoading(false);
    if (res.payload?.success === true) {
      setPostHash((e) => [...e, ...res.payload.hash]);
      setAllPost((e) => [...e, ...res.payload.posts]);

      if (res.payload.lock) {
        setCancelObserver(true);
      }

      setUserTag(res.payload.userTag);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  ObserverEffect({
    fetchInfo: allPost,
    fetchFunc: getPosts,
    blockRef: observerRef,
    cancelRef: cancelObserver,
  });

  return (
    <div id="user-post">
      {tokenInfo.idTag === user && (
        <>
          <div
            tabIndex={0}
            className="order"
            onClick={() => {
              setOpenOrder(true);
            }}
            onBlur={() => {
              setOpenOrder(false);
            }}
          >
            <i className="fa-solid fa-list"></i>
            <p>Ordernar por</p>
            {openOrder && (
              <div className="order-hidden">
                <div
                  onClick={() => {
                    if (!order) {
                      setOrder(true);
                      setPostHash([]);
                      setAllPost([]);
                    }
                  }}
                >
                  Data de inclusao(mais recente)
                  {order && <i className="fa-solid fa-check"></i>}
                </div>
                <div
                  onClick={() => {
                    if (order) {
                      setOrder(false);
                      setPostHash([]);
                      setAllPost([]);
                    }
                  }}
                >
                  Ultimo video adicionado
                  {!order && <i className="fa-solid fa-check"></i>}
                </div>
              </div>
            )}
          </div>
          <div className={`post-container ${clickPost ? "check" : ""}`}>
            <div className="user-info">
              <div className="img-box">
                <UserChannel
                  url={userInfo.photoUrl.photo?.hash}
                  name={userInfo.name[0]}
                />
              </div>
              <p>{userInfo?.name}</p>
            </div>
            <textarea
              onClick={() => {
                setClickPost(true);
              }}
              ref={postRef}
              onInput={(e) => {
                postResize();
                setText(e.target.value);
              }}
              className="post-box"
              placeholder="Compartilhe uma prévia do seu próximo video"
            />
            {!image && !poll && (
              <div className="type-box">
                <label htmlFor="imageInput">
                  <i className="fa-solid fa-image"></i>
                  <p>Imagem</p>
                </label>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    setImage(Array.from(e.target.files).slice(0, 10));
                    setClickPost(true);
                  }}
                  hidden
                />
                <div
                  onClick={() => {
                    setPoll(true);
                    setClickPost(true);
                  }}
                >
                  <i className="fa-solid fa-square-poll-horizontal"></i>
                  <p>Enquete</p>
                </div>
              </div>
            )}
            {image && <ImageMove imgUrl={image} />}
            {poll && <PollPost poll={setPollText} />}
            <div>
              {clickPost && (
                <button
                  className="cancel-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    postRef.current.value = "";
                    setImage("");
                    setText("");
                    setPoll(false);
                    setPollText(false);
                    setClickPost(false);
                  }}
                >
                  Cancelar
                </button>
              )}
              <button
                className={`post-button ${text || image || pollText ? "check" : ""}`}
                disabled={text !== "" ? false : true}
                onClick={() => {
                  setPost();
                }}
              >
                <div>Postar</div>
              </button>
            </div>
          </div>
        </>
      )}
      {allPost.length !== 0 ? (
        allPost.map((item, i) => (
          <FeedPost
            key={i}
            postInfo={{ userTag: userTag, postId: item._id }}
            observer={i === allPost.length - 1 ? observerRef : null}
          />
        ))
      ) : (
        <div className="create-post">
          <div>Nenhum post no canal</div>
        </div>
      )}
    </div>
  );
}
