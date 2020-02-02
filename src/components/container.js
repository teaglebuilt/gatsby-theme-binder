import React, { useEffect } from "react";
import { Kernel, ServerConnection } from "@jupyterlab/services";
import EventsContext from "../context/server_events";
import useEvents from "../hooks/use_events";
import useMetadata from "../hooks/use_metadata";

const Container = ({ children }) => {
  const { data, setData, settings, setSettings } = useEvents();
  const { repo, branch, kernelType } = useMetadata();

  useEffect(() => {
    requestBinder(repo, branch, `https://mybinder.org`).then(settings =>
      requestKernel(settings)
    );
  }, []);

  const requestBinder = (repo, branch, url) => {
    const binderUrl = `${url}/build/gh/${repo}/${branch}`;
    console.log("building", { binderUrl });
    return new Promise((resolve, reject) => {
      const es = new EventSource(binderUrl);
      es.onerror = err => {
        es.close();
        console.log(err);
        reject(new Error(err));
      };
      let phase = null;
      es.onmessage = ({ data }) => {
        const msg = JSON.parse(data);
        if (msg.phase && msg.phase !== phase) {
          phase = msg.phase.toLowerCase();
          console.log(phase === "ready" ? "server-ready" : phase);
        }
        if (msg.phase === "failed") {
          es.close();
          reject(new Error(msg));
        } else if (msg.phase === "ready") {
          setData(msg);
          es.close();
          const settings = {
            baseUrl: msg.url,
            wsUrl: `ws${msg.url.slice(4)}`,
            token: msg.token
          };
          resolve(settings);
        }
      };
    });
  };

  const requestKernel = settings => {
    const serverSettings = ServerConnection.makeSettings(settings);
    return Kernel.startNew({
      type: kernelType,
      name: kernelType,
      serverSettings
    }).then(kernel => {
      setSettings(kernel);
      return kernel;
    });
  };

  return (
    <EventsContext.Provider value={{ data, settings }}>
      {children}
    </EventsContext.Provider>
  );
};

export default Container;
