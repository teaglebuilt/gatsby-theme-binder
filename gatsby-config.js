const meta = require("./config/meta.json");

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
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              noInlineHighlight: true
            }
          },
          {
            resolve: `gatsby-remark-smartypants`,
            options: {
              dashes: "oldschool"
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 790,
              linkImagesToOriginal: true,
              sizeByPixelDensity: false,
              showCaptions: true,
              quality: 80,
              withWebp: { quality: 80 }
            }
          },
          `gatsby-remark-unwrap-images`
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`
  ]
});
