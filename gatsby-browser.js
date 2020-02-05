import React from "react";
import ReactDOM from "react-dom";

import Container from "./src/components/container";
import Jupyter from "./src/components/jupyter";

export const wrapRootElement = ({ element }) => (
  <Container>{element}</Container>
);

export const onInitialClientRender = () => {
  window.Jupyter = Jupyter;
};
