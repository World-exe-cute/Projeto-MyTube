import ChannelBar from "../../components/Channel/ChannelBar";
import { useContext } from "react";
import { Channel } from "../../App";
import "./ChannelRoute.css";

export default function ChannelRoute({ route }) {
  const { tokenInfo, clickOption } = useContext(Channel);

  return (
    <div id="Config">
      {tokenInfo && (
        <ChannelBar userInfo={tokenInfo} active={clickOption.moreOption} />
      )}
      <div className="channel-route">{route}</div>
    </div>
  );
}
