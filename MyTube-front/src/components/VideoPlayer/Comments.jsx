import { NavLink } from "react-router-dom";
import "./Comments.css";

//components
import { useEffect, useRef, useState, useContext } from "react";
import { Channel } from "../../App";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import { useParams } from "react-router-dom";
import CommentFeed from "./VideoInfoComponents/CommentFeed";
import SendButton from "./VideoInfoComponents/SendButton";
import UserChannel from "./VideoInfoComponents/UserChannel";
import ObserverEffect from "../../utils/ObserverEffect";

export default function Comments({ options, fetchInfo, setOrder }) {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { tokenInfo } = useContext(Channel);
  const [showOptions, setShowOptions] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [commentsHash, setCommentsHash] = useState([]);
  const [cancelObserver, setCancelObserver] = useState(false);
  const [orderInfo, setOrderInfo] = useState("like");
  const [comment, setComment] = useState();
  const observerRef = useRef();
  const { id } = useParams();

  const heightChange = () => {
    const textArea = inputRef.current;
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

  useEffect(() => {
    setCommentsHash([]);
    setAllComments([]);
    getComments([]);
  }, [orderInfo, id]);

  const getComments = async (frontHash = commentsHash) => {
    const formData = {};
    const infoData = {};

    formData.frontHash = frontHash;
    formData.order = orderInfo;
    infoData.fetch = `/videos/getComments/${id}`;
    infoData.path = "POST";
    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setCommentsHash((e) => [...e, ...res.payload.hash]);
      setAllComments((e) => [...e, ...res.payload.comments]);

      if (res.payload.lock) {
        setCancelObserver(true);
      }
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  ObserverEffect({
    fetchInfo: allComments,
    fetchFunc: getComments,
    blockRef: observerRef,
    cancelRef: cancelObserver,
  });

  return (
    <div className="comments-box">
      <div>
        <div>{`${allComments.length} comentários`}</div>
        <div
          className="order-box"
          onClick={() => {
            setOpenOption(true);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget))
              setOpenOption(false);
          }}
          tabIndex={-1}
        >
          <i className="fa-solid fa-bars-staggered"></i>
          <div>Ordenar por</div>
          {openOption && (
            <div className="option-hidden">
              <div
                onClick={() => {
                  setOrder("like");
                  setOrderInfo("like");
                }}
              >
                Principais
              </div>
              <div
                onClick={() => {
                  setOrder(true);
                  setOrderInfo(true);
                }}
              >
                Mais recentes
              </div>
              <div
                onClick={() => {
                  setOrder(false);
                  setOrderInfo(false);
                }}
              >
                Mais antigos
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="insert-comment">
        <div>
          <NavLink className="reset-config" to="/">
            <UserChannel
              url={tokenInfo?.photoUrl?.photo?.hash}
              name={tokenInfo?.name}
            />
          </NavLink>
          <div
            className="more-options"
            onClickCapture={() => {
              setShowOptions(true);
            }}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setShowOptions(false);
            }}
            tabIndex={-1}
          >
            <div className="before-border-bottom">
              <textarea
                ref={inputRef}
                placeholder="Adicione um comentário…"
                onInput={(e) => {
                  heightChange();
                  setComment(e.target.value);
                }}
                value={comment}
              ></textarea>
            </div>
            {showOptions && (
              <>
                <SendButton
                  state={comment}
                  setState={setComment}
                  show={setShowOptions}
                  hash={id}
                  fetch={fetchInfo}
                  data={{ comment: comment }}
                />
              </>
            )}
          </div>
        </div>
        {allComments.length !== 0 &&
          allComments.map((item, i) => (
            <CommentFeed
              key={i}
              refInfo={allComments.length - 1 === i ? observerRef : null}
              index={i}
              comment={item}
              fetch={fetchInfo}
            />
          ))}
      </div>
    </div>
  );
}
