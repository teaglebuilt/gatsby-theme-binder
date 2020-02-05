import React from "react";
import PropTypes from "prop-types";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import { Kernel, ServerConnection } from "@jupyterlab/services";
import CodeMirror from "codemirror";
import { Widget } from "@phosphor/widgets";
import {
  RenderMimeRegistry,
  standardRendererFactories
} from "@jupyterlab/rendermime";
import EventContext from "../context/server_events";
import classes from "../styles/codemirror.css";
import { window } from "browser-monads";

class Jupyter extends React.Component {
  static contextType = EventContext;
  inputRef = null;
  outputRef = null;
  state = {
    content: null,
    cm: null,
    kernel: null,
    renderers: null,
    fromStorage: null
  };

  static defaultProps = {
    children: "",
    branch: "master",
    url: "https://mybinder.org",
    serverSettings: {},
    kernelType: "python3",
    lang: "python",
    theme: "default",
    isolateCells: true,
    useBinder: true,
    storageKey: "jupyter",
    useStorage: true,
    storageExpire: 60,
    debug: false,
    msgButton: "run",
    msgLoading: "Loading...",
    msgError: "Connecting failed. Please reload and try again.",
    classNames: {
      cell: "juniper-cell",
      input: "juniper-input",
      button: "juniper-button",
      output: "juniper-output"
    }
  };

  static propTypes = {
    children: PropTypes.string,
    repo: PropTypes.string.isRequired,
    branch: PropTypes.string,
    url: PropTypes.string,
    serverSettings: PropTypes.object,
    kernelType: PropTypes.string,
    lang: PropTypes.string,
    theme: PropTypes.string,
    isolateCells: PropTypes.bool,
    useBinder: PropTypes.bool,
    useStorage: PropTypes.bool,
    storageExpire: PropTypes.number,
    msgButton: PropTypes.string,
    msgLoading: PropTypes.string,
    msgError: PropTypes.string,
    classNames: PropTypes.shape({
      cell: PropTypes.string,
      input: PropTypes.string,
      button: PropTypes.string,
      output: PropTypes.string
    }),
    actions: PropTypes.func
  };

  componentDidMount() {
    const cm = new CodeMirror(this.inputRef, {
      value: this.props.children.trim(),
      mode: this.props.lang,
      theme: this.props.theme
    });
    this.setState({ cm });
    const renderers = standardRendererFactories.filter(factory =>
      factory.mimeTypes.includes("text/latex") ? window.MathJax : true
    );

    const outputArea = new OutputArea({
      model: new OutputAreaModel({ trusted: true }),
      rendermime: new RenderMimeRegistry({ initialFactories: renderers })
    });
    const runCode = wrapper => {
      const value = cm.getValue();
      this.execute(outputArea, wrapper ? wrapper(value) : value);
    };
    const setValue = value => cm.setValue(value);
    cm.setOption("extraKeys", { "Shift-Enter": runCode });
    Widget.attach(outputArea, this.outputRef);
    this.setState({ runCode, setValue });
  }

  log(logFunction) {
    if (this.props.debug) {
      logFunction();
    }
  }

  componentWillReceiveProps({ children }) {
    if (children !== this.state.content && this.state.cm) {
      this.state.cm.setValue(children.trim());
    }
  }

  requestBinder = (repo, branch) => {
    const binderUrl = `https://mybinder.org/build/gh/${repo}/${branch}`;
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

  requestKernel(settings) {
    if (this.props.useStorage) {
      const timestamp =
        new Date().getTime() + this.props.storageExpire * 60 * 1000;
      const json = JSON.stringify({ settings, timestamp });
      window.localStorage.setItem(this.props.storageKey, json);
    }
    const serverSettings = ServerConnection.makeSettings(settings);
    return Kernel.startNew({
      type: this.props.kernelType,
      name: this.props.kernelType,
      serverSettings
    }).then(kernel => {
      this.log(() => console.info("ready"));
      return kernel;
    });
  }

  getKernel() {
    if (this.props.useStorage) {
      const stored = window.localStorage.getItem(this.props.storageKey);
      if (stored) {
        this.setState({ fromStorage: true });
        const { settings, timestamp } = JSON.parse(stored);
        if (timestamp && new Date().getTime() < timestamp) {
          return this.requestKernel(settings);
        }
        window.localStorage.removeItem(this.props.storageKey);
      }
    }
    if (this.props.useBinder) {
      return this.requestBinder(
        this.props.repo,
        this.props.branch,
        this.props.url
      ).then(settings => this.requestKernel(settings));
    }
    return this.requestKernel(this.props.serverSettings);
  }

  renderResponse(outputArea, code) {
    outputArea.future = this.state.kernel.requestExecute({ code });
    outputArea.model.add({
      output_type: "stream",
      name: "loading",
      text: this.props.msgLoading
    });
    outputArea.model.clear(true);
  }

  execute(outputArea, code) {
    this.log(() => console.info("executing"));
    if (this.state.kernel) {
      if (this.props.isolateCells) {
        this.state.kernel
          .restart()
          .then(() => this.renderResponse(outputArea, code))
          .catch(() => {
            this.log(() => console.error("failed"));
            this.setState({ kernel: null });
            outputArea.model.clear();
            outputArea.model.add({
              output_type: "stream",
              name: "failure",
              text: this.props.msgError
            });
          });
        return;
      }
      this.renderResponse(outputArea, code);
      return;
    }
    this.log(() => console.info("requesting kernel"));
    const url = this.props.url.split("//")[1];
    const action = !this.state.fromStorage ? "Launching" : "Reconnecting to";
    outputArea.model.clear();
    outputArea.model.add({
      output_type: "stream",
      name: "stdout",
      text: `${action} Docker container on ${url}...`
    });
    new Promise((resolve, reject) =>
      this.getKernel()
        .then(resolve)
        .catch(reject)
    )
      .then(kernel => {
        this.setState({ kernel });
        this.renderResponse(outputArea, code);
      })
      .catch(() => {
        this.log(() => console.error("failed"));
        this.setState({ kernel: null });
        if (this.props.useStorage) {
          this.setState({ fromStorage: false });
          window.localStorage.removeItem(this.props.storageKey);
        }
        outputArea.model.clear();
        outputArea.model.add({
          output_type: "stream",
          name: "failure",
          text: this.props.msgError
        });
      });
  }

  render() {
    // console.log(this.props);
    return (
      <div className={classes.cell}>
        <div
          className={classes.input}
          ref={x => {
            this.inputRef = x;
          }}
        />
        {this.props.msgButton && (
          <button onClick={this.state.runCode}>{this.props.msgButton}</button>
        )}
        {this.props.actions && this.props.actions(this.state)}
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
