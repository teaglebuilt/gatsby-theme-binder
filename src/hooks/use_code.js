import { graphql, useStaticQuery } from "gatsby";

const useCode = () => {
  const raw = useStaticQuery(graphql`
    query {
      allCode {
        edges {
          node {
            name
            code
          }
        }
      }
    }
  `);
  return raw.allCode.edges.node;
};

export default useCode;
