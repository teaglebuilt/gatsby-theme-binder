import React, { useEffect } from "react";
import EventsContext from "../context/server_events";
import useMetadata from "../hooks/use_metadata";

const Container = ({ children }) => {
  const { repo, branch, kernelType } = useMetadata();

  return (
    <EventsContext.Provider value={{ repo, branch, kernelType }}>
      {children}
    </EventsContext.Provider>
  );
};

export default Container;
