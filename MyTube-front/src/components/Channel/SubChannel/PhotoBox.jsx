import "./PhotoBox.css";

export default function PhotoBox({ photo }) {
  return (
    <div id="PhotoBox">
      <div>
        {photo && (
          <img
            src={photo instanceof Blob ? URL.createObjectURL(photo) : photo}
            alt="photo"
          />
        )}
      </div>
    </div>
  );
}
