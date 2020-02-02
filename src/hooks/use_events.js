import { useState } from "react";

const useEvents = () => {
  const [data, setData] = useState([]);
  const [settings, setSettings] = useState({});

  return {
    data,
    setData,
    settings,
    setSettings
  };
};

export default useEvents;
