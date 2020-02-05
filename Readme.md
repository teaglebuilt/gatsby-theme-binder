# Gatsby Theme Binder

[![npm version](http://img.shields.io/npm/v/REPO.svg?style=flat)](https://www.npmjs.com/package/@teaglebuilt/gatsby-theme-binder "View this project on npm")

> Use Jupyter Kernels with Server Sent Events to power code execution in remark code blocks. Using mybinder.org as a source to build up the docker image for the requested kernel

// Note: this is in development and not yet packaged. Will be available soon...

# Install

yarn add gatsby-theme-binder

npm install gatsby-theme-binder

gatsby-config.js

```
plugins: [
  {
    resolve: `gatsby-theme-binder`,
    options: {
        contentPath: "content",
        types: ["py"],
        binder: {
          repo: "teaglebuilt/Cookbook",
          branch: "master",
          kernelType: "python3"
        }
    },
  },
]
```

- contentPath - name of parent directory where two folders will be created within.

  - posts ..markdown folder
  - code ..folder for code files...python, rust, javascript, etc...

- types - Your code files will load into graphql so make sure and reference any file types that you want to include that might exist in the code folder.

- binder - list the repo, branch, and kernel that you wish to connect to when binder has launched the docker image with the given kernel.
