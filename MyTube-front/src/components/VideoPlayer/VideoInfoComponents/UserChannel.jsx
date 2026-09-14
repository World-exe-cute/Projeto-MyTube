import "./UserChannel.css";

export default function UserChannel({ url, name }) {
  return (
    <div className="perfil-box">
      {url ? (
        <img src={`${url}`} />
      ) : (
        <div className="default">
          <div>{String(name)[0]}</div>
        </div>
      )}
    </div>
  );
}
