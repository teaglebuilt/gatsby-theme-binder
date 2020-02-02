module.exports = options => ({
  siteMetadata: {
    title: "Gatsby-theme-binder",
    description: "Gatsby theme for creating interactive courses",
    jupyter: {
      repo: options.binder.repo,
      branch: options.binder.branch,
      kernelType: options.binder.kernelType
    }
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${options.contentPath}/posts/`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${options.contentPath}/code/`
      }
    }
  ]
});
