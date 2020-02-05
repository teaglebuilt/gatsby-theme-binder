import React from "react";
import { StaticQuery, graphql } from "gatsby";
import EventsContext from "../context/server_events";
import { Button } from "./button";

function getFiles({ allCode }) {
  return Object.assign(
    {},
    ...allCode.edges.map(({ node }) => ({
      [node.name]: node.code
    }))
  );
}

class CodeBlock extends React.Component {
  static contextType = EventsContext;
  state = { Jupyter: null, showSolution: false, key: 0 };

  handleShowSolution() {
    this.setState({ showSolution: true });
  }

  handleReset() {
    // Using the key as a hack to force component to rerender
    this.setState({ showSolution: false, key: this.state.key + 1 });
  }

  updateJuniper() {
    if (!this.state.Jupyter) {
      import("./jupyter").then(Jupyter => {
        this.setState({ Jupyter: Jupyter.default });
      });
    }
  }

  componentDidMount() {
    this.updateJuniper();
  }

  componentDidUpdate() {
    this.updateJuniper();
  }

  render() {
    const { Jupyter } = this.state;
    const { filename, lang, children } = this.props;
    const { repo, branch, kernelType } = this.context;

    return (
      <StaticQuery
        query={codeQuery}
        render={data => {
          const files = getFiles(data);
          const source = files[[filename]];
          return (
            <div>
              {Jupyter && (
                <Jupyter
                  file={source}
                  language={lang}
                  repo={repo}
                  branch={branch}
                  kernalType={kernelType}
                  msgButton={"run"}
                  actions={({ runCode }) => (
                    <>
                      <Button onClick={() => runCode()}>Run Code</Button>
                      {/* {testFile && (
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        runCode(value =>
                                                            makeTest(testTemplate, testFile, value)
                                                        )
                                                    }
                                                >
                                                    Submit
                                                </Button>
                                            )} */}
                    </>
                  )}
                >
                  {source}
                </Jupyter>
              )}
              {children}
            </div>
          );
        }}
      />
    );
  }
}

export default CodeBlock;

const codeQuery = graphql`
  {
    allCode {
      edges {
        node {
          name
          code
        }
      }
    }
  }
`;
