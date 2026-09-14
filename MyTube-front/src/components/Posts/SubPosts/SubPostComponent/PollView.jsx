import "./PollView.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../../slices/authSlice";

export default function PollPost({ pollList, pollId }) {
  const dispatch = useDispatch();

  const [pollPercent, setPollPercent] = useState([]);

  const [allCheck, setAllCheck] = useState();
  const [numPoll, setNumPoll] = useState(false);
  const [checkPoll, setCheckPoll] = useState(false);

  useEffect(() => {
    if (checkPoll !== true) {
      const allNum = pollList.map((item) => Number(item.check) || 0);
      allNum[numPoll] += 1;
      const num = allNum.reduce((e, num) => e + num, 0);
      const percent = allNum.map((e) => (num ? (e / num) * 100 : 0));
      setAllCheck(num);
      setPollPercent(percent);
      setCheckPoll(true);
    }
  }, [numPoll]);

  const SetCheckPoll = async (index) => {
    const formData = {};
    const infoData = {};

    formData.index = index;
    infoData.fetch = `/posts/checkPoll/${pollId}`;
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      window.location.reload();
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <div className="poll-box">
      <div>{`${allCheck} Votos`}</div>
      {pollList.map((item, i) => (
        <div
          key={i}
          className={`poll ${item.checkUser ? "view" : ""}`}
          onClick={() => {
            if (!pollList.some((e) => e.checkUser === true)) {
              setNumPoll(i);
              SetCheckPoll(i);
            }
          }}
        >
          <div className="check"></div>
          <div className={`poll-line ${pollPercent[i] !== 0 ? "check" : ""}`}>
            <span
              className="collor-bar"
              style={{ left: `${pollPercent[i] - 100}%` }}
            ></span>
            <div>{item.text}</div>
            <div
              className={`percent ${pollList.some((e) => e.checkUser === true) ? "view" : ""}`}
            >
              {`${pollPercent[i]}%`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
