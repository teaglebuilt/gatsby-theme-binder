import { useState } from "react";
import CodeMirror from "codemirror";

const useMirror = () => {
  const [codeMirror, setCodeMirror] = useState({});
  const [execCode, setExecCode] = useState([]);

  const createCodeMirror = (input, file, language) => {
    const cm = new CodeMirror(input, {
      value: file.trim(),
      mode: language,
      theme: "default"
    });
    setCodeMirror(cm);
  };

  return {
    codeMirror,
    setCodeMirror,
    createCodeMirror,
    setExecCode
  };
};

export default useMirror;
