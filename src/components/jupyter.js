import React from "react";
import { Kernel, ServerConnection } from "@jupyterlab/services";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import CodeMirror from "codemirror";
import {
  RenderMimeRegistry,
  standardRendererFactories
} from "@jupyterlab/rendermime";
import EventContext from "../context/server_events";
import classes from "../styles/jupyter.css";

class Jupyter extends React.Component {
  static contextType = EventContext;
  inputRef = null;
  outputRef = null;
  state = { cm: null };

  componentDidMount() {
    const cm = new CodeMirror(this.inputRef, {
      value: this.props.file.trim(),
      mode: this.props.language,
      theme: "default"
    });
    this.setState({ cm });
    const renderers = standardRendererFactories.filter(factory =>
      factory.mimeTypes.includes("text/latex") ? window.MathJax : true
    );

    const outputArea = new OutputArea({
      model: new OutputAreaModel({ trusted: true }),
      rendermime: new RenderMimeRegistry({ initialFactories: renderers })
    });
  }

  render() {
    const { file, language } = this.props;

    return (
      <div className={classes.cell}>
        <div
          className={classes.input}
          ref={x => {
            this.inputRef = x;
          }}
        />
        <button className={classes.run_code} onClick={this.runCode}>
          Run Code
        </button>
        <div
          className={classes.output}
          ref={x => {
            this.outputRef = x;
          }}
        />
      </div>
    );
  }
}

export default Jupyter;
