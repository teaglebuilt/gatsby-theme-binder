import React from "react";
import { StaticQuery, graphql } from "gatsby";
import Jupyter from "./jupyter";

function getFiles({ allCode }) {
  return Object.assign(
    {},
    ...allCode.edges.map(({ node }) => ({
      [node.name]: node.code
    }))
  );
}

class CodeBlock extends React.Component {
  state = {};

  render() {
    const { filename, lang, children } = this.props;
    return (
      <StaticQuery
        query={codeQuery}
        render={data => {
          const files = getFiles(data);
          const source = files[[filename]];
          return (
            <div>
              <p>hey</p>
              <Jupyter file={source} language={lang} />
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
