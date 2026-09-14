import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authThunk } from "../../../slices/authSlice";
import { useState, useEffect, useRef } from "react";

import "./SendVideoBox.css";
import VideoTextareaBox from "./subComponents/VideoTextareaBox";
import VideoInputBox from "./subComponents/VideoInputBox";
import VideoCheckBox from "./subComponents/VideoCheckBox";

export default function SendVideoBox({ input, step, showOption, videoInfo }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialData = {
    title: "",
    size: "",
    type: "",
    copy: "",
    tag: "",
    description: "",
    video: "",
    hash: "",
    public: false,
  };
  const [formError, setFormError] = useState(initialData);
  const [data, setData] = useState(initialData);
  const [titleStore, setTitleStore] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const videoRef = useRef();
  const headerRef = useRef();

  useEffect(() => {
    if (titleStore === "") {
      setTitle(data.title);
    } else {
      setTitle(titleStore);
    }
  }, [titleStore]);

  useEffect(() => {
    setTitle(data.title);
    return () => {
      setTitle("");
    };
  }, [step?.step]);

  useEffect(() => {
    if (videoInfo) {
      setTitleStore(videoInfo?.title);
      setTitle(videoInfo?.title);
      setData({
        ...data,
        title: videoInfo?.title,
        description: videoInfo?.description,
        tag: videoInfo?.videoTag?.join(","),
        copy: videoInfo?.originalCreator,
        public: videoInfo?.public,
        hash: `http://localhost:5000/api/videos/check-video/${videoInfo?.videoUrl?.hash}`,
        type: `video/${videoInfo?.videoUrl?.type}`,
      });
    }
    return () => {
      setData(initialData);
      setTitle("");
      setTitleStore("");
    };
  }, [videoInfo]);

  const postVideo = async (e) => {
    if (e.target.files?.length > 0) {
      const infoData = {};
      const formData = new FormData();

      const file = e.target.files[0];

      formData.append("postVideo", file);
      formData.append("public", "false");

      infoData.fetch = "/videos/postVideo";
      infoData.path = "POST";
      infoData.image = true;

      const res = await dispatch(authThunk({ formData, infoData }));
      if (res.payload?.success === true) {
        setData({
          ...data,
          title: file.name,
          size: file.size,
          hash: res.payload.videoInfo.hash,
          name: res.payload.videoInfo.name,
          type: file.type,
          video: file,
          description: "",
          tag: "",
          copy: "",
          public: false,
        });
        setError(false);
        step.setStep(2);
      } else if (res.payload === "false") {
        setError(false);
        navigate("/login");
      } else {
        if (res.payload.errors) {
          setError(res.payload.errors);
        }
      }
    }
  };

  const putVideo = async () => {
    const infoData = {};
    const formData = {};
    formData.type = data.type;
    formData.copy = data.copy;
    formData.description = data.description;
    formData.tag = data.tag;
    formData.public = data.public;

    if (title === "") {
      formData.title = data.title;
    } else {
      formData.title = title;
    }

    const splitHash = data.hash.split("/");

    formData.hash = splitHash[splitHash.length - 1];

    infoData.fetch = "/videos/putVideo";
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));
    console.log(res.payload);
    if (res.payload?.success === true) {
      showOption("false");
      window.location.reload();
    } else if (res.payload === "false") {
      navigate("/login");
    } else {
      const parse = res.payload;
      console.log(parse);
      const errors = {};

      setFormError({
        ...initialData,
        ...errors,
      });
    }
  };

  return (
    <section>
      {step?.step === 1 && (
        <>
          <header>
            <h2>Enviar vídeos</h2>
          </header>
          <div className="step-1">
            <i className="fa-solid fa-upload"></i>
            <p>
              Arraste e solte os arquivos de vídeo para fazer o envio
              <br />
              Seus vídeos ficarão privados até que você os publique.
            </p>
            <label htmlFor="focus">Selecionar arquivos</label>
            <input
              ref={input}
              type="file"
              id="focus"
              onChange={(e) => {
                postVideo(e);
              }}
            />
            {error && <div className="error-box">{error}</div>}
          </div>
          <div>
            <p>
              Tenha cuidado para não violar os direitos autorais e a privacidade
              de terceiros.
            </p>
          </div>
        </>
      )}
      {step?.step === 2 && (
        <>
          <header ref={headerRef}>
            <h2>{title}</h2>
          </header>
          <div className="step-2">
            <section>
              <div>
                <h1>Detalhes</h1>
                <VideoTextareaBox
                  title="Título (obrigatorio)"
                  placeholder="Adicione um título que descreva o conteúdo do vídeo"
                  count={100}
                  store={setTitleStore}
                  value={titleStore}
                  err={formError.title}
                />
              </div>
              <div>
                <VideoTextareaBox
                  title="Descrição"
                  placeholder="Fale sobre seu vídeo para os espectadores"
                  store={{ data, setData }}
                  field="description"
                  value={data.description}
                  err={formError.description}
                />
              </div>
              <div>
                <div>
                  <h1>Tags</h1>
                  <VideoInputBox
                    placeholder="Adicione uma tag"
                    state={{ data, setData }}
                    field="tag"
                    value={data.tag}
                    errInfo={{
                      err: formError.tag,
                      text: "tag",
                    }}
                  />
                  <p>insira uma virgula depois de cada tag.</p>
                  <VideoInputBox
                    placeholder="nome do autor original"
                    state={{ data, setData }}
                    field="copy"
                    value={data.copy}
                    errInfo={{
                      err: formError.copy,
                      text: "copy",
                    }}
                  />
                  <VideoCheckBox
                    title={"Este video é publico?:"}
                    state={{ data, setData }}
                    field="public"
                    value={data.public}
                  />
                </div>
              </div>
            </section>
            <div>
              {data.hash !== "" && (
                <video key={data.hash} controls>
                  <source src={data.hash} type={data.type} />
                </video>
              )}

              <section ref={videoRef}>
                <div>
                  <h2>Link do vídeo</h2>
                  <a href="">{data.hash}</a>
                </div>
                <div>
                  <h2>Nome do arquivo</h2>
                  <p>{data.title}</p>
                </div>
              </section>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                putVideo();
              }}
            >
              Enviar
            </button>
          </div>
        </>
      )}
    </section>
  );
}
