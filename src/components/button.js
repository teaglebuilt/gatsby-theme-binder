import React from "react";

export const Button = ({
  Component = "button",
  children,
  onClick,
  variant,
  small
}) => {
  return <Component onClick={onClick}>{children}</Component>;
};
