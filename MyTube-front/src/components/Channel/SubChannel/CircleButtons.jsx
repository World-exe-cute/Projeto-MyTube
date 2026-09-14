import { Link } from "react-router-dom";
import "./CircleButtons.css";

export default function CircleButtons({ i = "", text = "", css = "", route }) {
  return (
    <Link to={route} className={`circle_buttons ${css}`}>
      <i className={i}></i>
      <div>{text}</div>
    </Link>
  );
}
