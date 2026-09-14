import "./ChannelPosts.css";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../../slices/authSlice";
import { Channel } from "../../../../App";
import { NavContext } from "../ChannelNav";

//components
import ChannelSquareBox from "../../../../components/Channel/ChannelSquareBox";
import PostInfoCollum from "../../../../components/Channel/PostInfoCollum";
import ShowPostBox from "../../../../components/Channel/ShowPostBox";
import ObserverEffect from "../../../../utils/ObserverEffect";

export default function ChannelPosts({}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [allPost, setAllPost] = useState([]);
  const [allId, setAllId] = useState([]);
  const [postHash, setPostHash] = useState([]);
  const { tokenInfo } = useContext(Channel);
  const { activeDelete, setActiveDelete } = useContext(NavContext);
  const [cancelObserver, setCancelObserver] = useState(false);
  const observerRef = useRef();

  useEffect(() => {
    checkPosts();
  }, []);

  const checkPosts = async () => {
    const formData = {};
    const infoData = {};

    formData.frontHash = postHash;
    if (id) {
      infoData.fetch = `/posts/getSearchPostChannel/${id}`;
    } else {
      infoData.fetch = `/posts/getPostChannel`;
    }

    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      const hash = res.payload.posts;

      setAllId(hash.map((e) => e._id));
      setPostHash((e) => [...e, ...res.payload.hash]);

      if (res.payload.lock) {
        setCancelObserver(true);
      }

      setAllPost((e) => [...e, ...res.payload.posts]);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  ObserverEffect({
    fetchInfo: allPost,
    fetchFunc: checkPosts,
    blockRef: observerRef,
    cancelRef: cancelObserver,
  });

  return (
    <div id="channel-posts">
      <div className="grid-container">
        <div className="user-video">
          <div>
            <div className="video-mark">
              <ChannelSquareBox
                checkFunction={setActiveDelete}
                activeDel={activeDelete}
                checkAll={allId}
              />

              <p>Marcar todos</p>
            </div>
          </div>

          {allPost.length !== 0 && (
            <>
              {allPost.map((item, i) => (
                <div
                  key={i}
                  ref={allPost.length - 1 === i ? observerRef : null}
                >
                  <ShowPostBox
                    posts={item}
                    setCheck={setActiveDelete}
                    activeDel={activeDelete}
                    keyNum={i}
                  />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="user-video-info">
          <div>
            <PostInfoCollum collum={true} />
            <PostInfoCollum collum={false} videos={allPost} />
          </div>
        </div>
      </div>
      {allPost.length === 0 && (
        <div className="last-div">
          <p>*Faça uma postagem usando enquetes, imagens e muito mais.*</p>

          <button
            onClick={() => {
              console.log(tokenInfo);
              navigate(`/profile/posts/${tokenInfo.idTag}`);
            }}
          >
            Criar um post
          </button>
        </div>
      )}
    </div>
  );
}
