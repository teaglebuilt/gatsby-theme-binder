import { graphql, useStaticQuery } from "gatsby";

const useMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          jupyter {
            repo
            branch
            kernelType
          }
        }
      }
    }
  `);
  return data.site.siteMetadata.jupyter;
};

export default useMetadata;
