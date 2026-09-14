import "./VideoInfoCollum.css";

export default function VideoInfoCollum({ collum = false, videos = null }) {
  return (
    <>
      {collum && (
        <div className="statistics title">
          <div>
            <p>Visibilidade</p>
          </div>
          <div>
            <p>Criador original</p>
          </div>
          <div>
            <p>Data</p>
          </div>
          <div>
            <p>Visualizaçoes</p>
          </div>
          <div>
            <p>Comentarios</p>
          </div>
          <div>
            <p>Gostei x Nao gostei</p>
          </div>
        </div>
      )}
      {videos && (
        <>
          {videos.map((item, i) => (
            <div key={i} className="statistics">
              <div>
                <p>{item.public ? "publico" : "privado"}</p>
              </div>
              <div>
                <p>{item.originalCreator ? item.originalCreator : ""}</p>
              </div>
              <div>
                <p>{item.createdAt ? `Post: ${item.createdAt}` : "Post: "}</p>
                <p>
                  {item.updatedAt
                    ? `Last update: ${item.updatedAt}`
                    : "Last uptade: "}
                </p>
              </div>
              <div>
                <p>{item.view ? item.view : "0"}</p>
              </div>
              <div>
                <p>{item.comments ? item.comments : "0"}</p>
              </div>
              <div>
                <p>{item.like ? `Like: ${item.like}` : "Like: 0"}</p>
                <p>
                  {item.dislike ? `Dislike: ${item.dislike}` : "Dislike: 0"}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
