import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../../slices/authSlice";
import "./AnalyticsOverview.css";
import ShowLineChart from "../../../../components/Channel/SubChannel/ShowLineChart";

export default function AnalyticsOverview({ channelView }) {
  const dispatch = useDispatch();
  const [lineChart, setLineChart] = useState(1);
  const [videoInfo, setVideoInfo] = useState();
  const [userInfo, setUserInfo] = useState();
  const [data, setData] = useState(false);
  const [viewNum, setViewNum] = useState(0);
  const [likeNum, setLikeNum] = useState(0);
  const [dislikeNum, setDislikeNum] = useState(0);

  useEffect(() => {
    let view = 0;
    let like = 0;
    let dislike = 0;
    videoInfo?.forEach((doc) => {
      view += doc.views;
      like += doc.likes;
      dislike += doc.dislikes;
    });
    setViewNum(view);
    setLikeNum(like);
    setDislikeNum(dislike);
  }, [videoInfo]);

  useEffect(() => {
    if (lineChart === 1) {
      setData(
        videoInfo?.map((doc) => ({
          nome: `${doc._id.replace(/-/g, "/")}`,
          valor: doc.views,
        })),
      );
    } else if (lineChart === 2) {
      setData(
        videoInfo?.map((doc) => ({
          nome: `${doc._id.replace(/-/g, "/")}`,
          valor: doc.likes,
        })),
      );
    } else if (lineChart === 3) {
      setData(
        videoInfo?.map((doc) => ({
          nome: `${doc._id.replace(/-/g, "/")}`,
          valor: doc.dislikes,
        })),
      );
    }
  }, [lineChart, videoInfo]);

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/videos/getInfo`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setVideoInfo(res.payload.videoInfo);
      setUserInfo(res.payload.userInfo);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <section id="analytics-overview">
      <div>
        <header>
          <h2>
            *Seu canal não teve nenhuma visualização* nos ultimos
            {` ${channelView}`} dias
          </h2>
        </header>
        <div>
          <div className="info-area">
            <div
              className={lineChart === 1 ? "" : "background"}
              onClick={() => {
                setLineChart(1);
              }}
            >
              <p>Visualizações</p>
              <div>{viewNum}</div>
            </div>
            <div
              className={lineChart === 2 ? "" : "background"}
              onClick={() => {
                setLineChart(2);
              }}
            >
              <p>Total de likes</p>
              <div>{likeNum}</div>
            </div>
            <div
              className={lineChart === 3 ? "" : "background"}
              onClick={() => {
                setLineChart(3);
              }}
            >
              <p>Total de dislikes</p>
              <div>{dislikeNum}</div>
            </div>
          </div>
          <div className="line-chart">
            {lineChart === 1 && <ShowLineChart data={data} wholeNum={false} />}
            {lineChart === 2 && <ShowLineChart data={data} wholeNum={true} />}
            {lineChart === 3 && <ShowLineChart data={data} wholeNum={false} />}
          </div>
        </div>
      </div>
      <div>
        <div className="container-1">
          <p>Em tempo real</p>
          <div>
            <div className="att-ball"></div>
            <div>Atualizando</div>
          </div>
        </div>
        <div className="container-2">
          <div>{userInfo?.inscriptionNum ? userInfo?.inscriptionNum : "0"}</div>
          <div>Inscritos</div>
        </div>
        <div>
          <div>
            {userInfo?.myInscriptionNum ? userInfo?.myInscriptionNum : "0"}
          </div>
          <div>Minhas subscriçoes</div>
        </div>
        <div className="container-4">
          <div>48h atrás</div>
          <div>Agora</div>
        </div>
      </div>
    </section>
  );
}
