import "./ChannelSquareBox.css";

export default function ChannelSquareBox({
  checkFunction,
  checkAll,
  activeDel,
  checkOne,
}) {
  const checkAllSquare = (e) => {
    if (checkAll.length === activeDel.length) {
      e.currentTarget.classList.remove("check");
      const allVideos = [];
      checkFunction(allVideos);
    } else {
      e.currentTarget.classList.add("check");
      checkFunction(checkAll);
    }
  };
  const clickEvent = (e) => {
    console.log(checkOne);
    if (activeDel.includes(checkOne) || activeDel.includes(checkAll)) {
      if (checkAll) {
        checkAllSquare(e);
      } else {
        checkFunction((e) => e.filter((doc) => doc !== checkOne));
      }
    } else {
      if (checkAll) {
        checkAllSquare(e);
      } else {
        checkFunction((e) => [...e, checkOne]);
      }
    }
  };
  return (
    <div
      className={`square-box ${activeDel?.includes(checkOne || checkAll) ? "check" : ""} ${checkAll?.length === activeDel?.length ? "check" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        clickEvent(e);
      }}
    >
      <i className="fa-solid fa-check"></i>
    </div>
  );
}
