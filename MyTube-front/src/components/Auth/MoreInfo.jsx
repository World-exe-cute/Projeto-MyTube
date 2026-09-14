import "./MoreInfo.css";
import { Link } from "react-router-dom";

export default function MoreInfo({}) {
  return (
    <div className="help-block">
      <div className="subHelp help1">
        <p>Português(Brasil)</p>
      </div>
      <div className="subHelp help2">
        <Link>Ajuda</Link>
        <Link>privacidade</Link>
        <Link>Termos</Link>
      </div>
    </div>
  );
}
