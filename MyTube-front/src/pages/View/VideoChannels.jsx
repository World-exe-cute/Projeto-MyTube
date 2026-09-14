import "./VideoChannels.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import ChannelFeed from "./SubView/ChannelFeed";

export default function VideoChannels() {
  const dispatch = useDispatch();
  const [channels, setChannels] = useState(false);

  useEffect(() => {
    getChannelInfo();
  }, []);

  const getChannelInfo = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/home/getChannelInfo`;
    infoData.path = "GET";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setChannels(res.payload.channels);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <div id="video-channels">
      <div>Todas as inscrições</div>
      <div>
        {channels &&
          channels.map((item, i) => (
            <ChannelFeed key={i} index={i} channel={item.userId} />
          ))}
      </div>
    </div>
  );
}
