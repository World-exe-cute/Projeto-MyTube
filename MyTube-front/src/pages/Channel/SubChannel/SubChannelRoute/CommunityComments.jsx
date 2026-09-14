import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../../slices/authSlice";
import { CommunityContext } from "../ChannelCommunity";
import "./CommunityComments.css";
import CommunityBoxHidden from "../../../../components/Channel/CommunityBoxHidden";
import CommentFeed from "../../../../components/VideoPlayer/VideoInfoComponents/CommentFeed";
import ChannelSquareBox from "../../../../components/Channel/ChannelSquareBox";

export default function CommunityComments({}) {
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [allHash, setAllHash] = useState([]);
  const { activeDelete, setActiveDelete } = useContext(CommunityContext);

  useEffect(() => {
    getAllVideosComments();
  }, []);

  const getAllVideosComments = async () => {
    const formData = {};
    const infoData = {};

    formData.comments = comments;
    infoData.fetch = `/videos/getAllComments`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      const videoComment = res.payload.videoComment;
      setAllHash(videoComment.map((e) => e._id));
      setComments((e) => [...e, ...videoComment]);
    } else {
      const parse = res.payload;
      console.log(parse[0].msg);
    }
  };

  return (
    <div id="community-comments">
      <div>
        <i className="fa-solid fa-filter"></i>
        <CommunityBoxHidden
          buttonText="Publicados"
          hiddenTitle="Status de moderação"
          hiddenOptions={["Publicados", "Retido"]}
        />
        <CommunityBoxHidden
          buttonText="Ordenar por"
          hiddenTitle="Ordenar por"
          hiddenOptions={["Mais relevantes (padrao)", "Mais recentes"]}
        />
      </div>
      <div className="mark-all">
        <ChannelSquareBox
          checkFunction={setActiveDelete}
          activeDel={activeDelete}
          checkAll={allHash}
        />
        <div>Marcar todos</div>
      </div>
      <div className="comment-feed">
        {comments?.length !== 0 &&
          comments.map((item, i) => (
            <div key={i} className="square-container">
              <ChannelSquareBox
                checkFunction={setActiveDelete}
                activeDel={activeDelete}
                checkOne={item._id}
              />
              <CommentFeed index={i} comment={item} fetch={"/videos"} />
            </div>
          ))}
      </div>
    </div>
  );
}
