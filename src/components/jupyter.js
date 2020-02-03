import React, { useRef, useEffect } from "react";
import { Kernel, ServerConnection } from "@jupyterlab/services";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import {
  RenderMimeRegistry,
  standardRendererFactories
} from "@jupyterlab/rendermime";
import EventContext from "../context/server_events";
import useMirror from "../hooks/use_mirror";
import classes from "../styles/codemirror.css";

const Jupyter = ({ file, language }) => {
  const { codeMirror, createCodeMirror, setExecCode } = useMirror();
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    const renderers = standardRendererFactories.filter(factory =>
      factory.mimeTypes.includes("text/latex") ? window.MathJax : true
    );
    const outputArea = new OutputArea({
      model: new OutputAreaModel({ trusted: true }),
      rendermime: new RenderMimeRegistry({ initialFactories: renderers })
    });
    createCodeMirror(inputRef.current, file, language);
    const runCode = wrapper => {
      const value = codeMirror.getValue();
      return value;
    };
    const setValue = value => codeMirror.setValue(value);
    setExecCode(runCode, setValue);
  });

  return (
    <div className={classes.cell}>
      <div
        className={classes.input}
        ref={x => {
          inputRef.current = x;
        }}
      />
      <button className={classes.run_code} onClick={runCode}>
        Run Code
      </button>
      <div
        className={classes.output}
        ref={x => {
          outputRef.current = x;
        }}
      />
    </div>
  );
};

// class Jupyter extends React.Component {
//   static contextType = EventContext;
//   inputRef = null;
//   outputRef = null;
//   state = { cm: null };

//   componentDidMount() {
//     const cm = new CodeMirror(this.inputRef, {
//       value: this.props.file.trim(),
//       mode: this.props.language,
//       theme: "default"
//     });
//     this.setState({ cm });
//     const renderers = standardRendererFactories.filter(factory =>
//       factory.mimeTypes.includes("text/latex") ? window.MathJax : true
//     );

//     const outputArea = new OutputArea({
//       model: new OutputAreaModel({ trusted: true }),
//       rendermime: new RenderMimeRegistry({ initialFactories: renderers })
//     });
//   }

//   render() {
//     const { file, language } = this.props;

//     return (
//       <div className={classes.cell}>
//         <div
//           className={classes.input}
//           ref={x => {
//             this.inputRef = x;
//           }}
//         />
//         <button className={classes.run_code} onClick={this.runCode}>
//           Run Code
//         </button>
//         <div
//           className={classes.output}
//           ref={x => {
//             this.outputRef = x;
//           }}
//         />
//       </div>
//     );
//   }
// }

export default Jupyter;
