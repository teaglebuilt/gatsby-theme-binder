import React, { useContext, useEffect } from "react";
import { StaticQuery, graphql } from "gatsby";
import EventsContext from "../context/server_events";

import Jupyter from "./jupyter";

function getFiles({ allCode }) {
  return Object.assign(
    {},
    ...allCode.edges.map(({ node }) => ({
      [node.name]: node.code
    }))
  );
}

const CodeBlock = ({ filename, lang }) => {
  const { repo, branch, requestBinder, requestKernel } = useContext(
    EventsContext
  );

  useEffect(() => {
    requestBinder(repo, branch, `https://mybinder.org`).then(settings =>
      requestKernel(settings)
    );
  }, []);

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
};

export default CodeBlock;
// class CodeBlock extends React.Component {
//   state = {};

//   render() {
//     const { filename, lang, children } = this.props;
//     return (
//       <StaticQuery
//         query={codeQuery}
//         render={data => {
//           const files = getFiles(data);
//           const source = files[[filename]];
//           return (
//             <div>
//               <p>hey</p>
//               <Jupyter file={source} language={lang} />
//             </div>
//           );
//         }}
//       />
//     );
//   }
// }

// export default CodeBlock;

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
