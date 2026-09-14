import "./BannerBox.css";

export default function BannerBox({ tv, pc, cel }) {
  return (
    <div id="banner-box">
      <div className="tv">
        <div>
          {tv && (
            <img
              src={tv instanceof Blob ? URL.createObjectURL(tv) : tv}
              alt="tv"
            />
          )}
        </div>
      </div>
      <div className="pc-box">
        <div className="pc">
          <div>
            {pc && (
              <img
                src={pc instanceof Blob ? URL.createObjectURL(pc) : pc}
                alt="pc"
              />
            )}
          </div>
        </div>
        <div className="under-pc"></div>
        <div></div>
      </div>
      <div className="cel-box">
        <div className="cel">
          <div>
            {cel && (
              <img
                src={cel instanceof Blob ? URL.createObjectURL(cel) : cel}
                alt="cel"
              />
            )}
          </div>
        </div>
        <div className="under-cel">
          <div></div>
        </div>
      </div>
    </div>
  );
}
