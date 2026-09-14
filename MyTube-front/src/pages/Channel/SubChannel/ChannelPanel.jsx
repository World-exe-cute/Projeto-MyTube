import { useRef, useState, useContext, useEffect } from "react";
import "./ChannelPanel.css";
import { Channel } from "../../../App";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";

//components
import CircleButtons from "../../../components/Channel/SubChannel/CircleButtons";

//scripts
import SendVideoBox from "../../../components/Channel/SubChannel/SendVideoBox";

export default function ChannelPanel({}) {
  const dispatch = useDispatch();
  const { stepOption, showOption } = useContext(Channel);
  const hiddenContainer = useRef(null);
  const inputRef = useRef(null);
  const [videoInfo, setVideoInfo] = useState(false);

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/videos/getLastInfo`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setVideoInfo(res.payload.videoInfo);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <section id="channel_panel">
      <header>
        <h1>Painel do canal</h1>
      </header>
      <div>
        {videoInfo ? (
          <div>
            <header>
              <h2>Este é seu ultimo video postado.</h2>
            </header>
            <div>
              <img
                src={`http://localhost:5000/api/videos/check-thumb/${videoInfo.videoUrl}`}
              ></img>
            </div>
            <h2>{videoInfo.videoName}</h2>
          </div>
        ) : (
          <div>
            <section className="section">
              <header>
                <h2>Quer ver as métricas do seu último vídeo?</h2>
              </header>
              <div className="post-video">
                <h3>Para começar, envie e publique um vídeo.</h3>

                <button
                  onClick={() => {
                    showOption("show");
                  }}
                >
                  Enviar vídeos
                </button>
              </div>
            </section>
          </div>
        )}

        <div>
          <div className="section_2">
            <section>
              <header>
                <h2>Estatísticas do canal</h2>
              </header>

              <dl>
                <dt>inscritos atuais</dt>
                <dd className="exept">
                  {videoInfo.inscription ? videoInfo.inscription : "0"}
                </dd>
              </dl>
            </section>
            <section>
              <div>
                <dl>
                  <dt>Resumo</dt>
                  <dd className="exept">Enviado {videoInfo.timeNow}</dd>

                  <dt>Visualizações</dt>
                  <dd>{videoInfo.view ? videoInfo.view : "0"} -</dd>

                  <dt>Like / Dislike</dt>
                  <dd>
                    {`${videoInfo.like ? videoInfo.like : "0"} / ${videoInfo.dislike ? videoInfo.dislike : "0"}`}{" "}
                  </dd>
                </dl>
              </div>
            </section>
            <section>
              <div>
                <dl>
                  <dt>Principais videos</dt>
                  <dd className="exept">Nenhum video no canal.</dd>
                </dl>
              </div>
              <nav>
                <CircleButtons
                  route="/myStudio/analytics/overview"
                  text="Ver as estatísticas do canal"
                />
              </nav>
            </section>
          </div>
        </div>
      </div>
      <section ref={hiddenContainer} tabIndex={0} className="hidden-container">
        <SendVideoBox input={inputRef} step={stepOption} />
      </section>
    </section>
  );
}
