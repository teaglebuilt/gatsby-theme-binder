<div align="center">
  <h1 style="margin-bottom: 0;">Gatsby Theme Binder</h1>
  <p style="margin-top: 1em; margin-bottom: 2em; font-size: large;">
    Power your gatsby site with kernels from jupyter
    <a href="https://mybinder.org" alt="drf" target="_blank" rel="noreferrer">
      Powered by mybinder.org
    </a>
    <div>
        <img src="https://raw.githubusercontent.com/teaglebuilt/gatsby-theme-binder/master/assets/imgonline-com-ua-twotoone-6B8knnTJ7Z.jpg">
    </div>
    <div>
        <img alt="Twitter URL" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fteaglebuilt%2Fgatsby-theme-binder">
        <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/DillanTeagle?style=social">
        <img src="https://img.shields.io/github/watchers/teaglebuilt/gatsby-theme-binder?style=social">
        <img src="https://img.shields.io/github/stars/teaglebuilt/gatsby-theme-binder?style=social">
    </div>
    <div>
      <a href="https://img.shields.io/npm/v/@teaglebuilt/gatsby-theme-binder">
        <img alt="npm" src="https://img.shields.io/npm/v/@teaglebuilt/gatsby-theme-binder">
      </a>
      <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@teaglebuilt/gatsby-theme-binder/peer/gatsby-source-filesystem">
      <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@teaglebuilt/gatsby-theme-binder/peer/gatsby">
      <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@teaglebuilt/gatsby-theme-binder/peer/react">
      <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@teaglebuilt/gatsby-theme-binder/peer/react-dom">
  </div>
</div>

This project was initially inspired by [Min RK](https://github.com/minrk)'s
[Thebelab](https://github.com/minrk/thebelab) package. Then finding [Juniper](https://github.com/ines/juniper). The goal is take this functionality wrapped into a gatsby package that allows for customization and accesibility.

# How it works

The theme will connect to a launched docker image of your chosen github repository as a jupyter notebook. An active connection will persist to the given kernel that is active in your notebook. You can choose which kernel to connect to in your gatsby config. You can use this theme just for a source connection with server sent events, or you can also import the interactive text editor and execute / render results from the kernel itself as a remark component. There are further instructions below.

> Note, this is my first gatsby theme and I am not sure if this is the most effective approach. I would appreciate any feedback on how this theme could improve in terms of usage and accesibility. Thankyou for testing this out and please get in touch with me for feedback.

# Install

```
npm install gatsby-theme-binder
```

gatsby-config.js

```js
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
    }
  }
];
```

- contentPath - name of parent directory where two folders will be created within.

  - posts ..markdown folder
  - code ..folder for code files...python, rust, javascript, etc...

- types - Your code files will load into graphql so make sure and reference any file types that you want to include that might exist in the code folder.

- binder - list the repo, branch, and kernel that you wish to connect to when binder has launched the docker image with the given kernel.

### How to import the markdown component

import loadAst and pass in the htmlAst to render as markdown. Example below

```js
import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { loadAst } from "@teaglebuilt/gatsby-theme-binder/src/markdown";

export const query = graphql`
  query($Slug: String) {
    markdownRemark(fields: { slug: { eq: $Slug } }) {
      htmlAst
      frontmatter {
        id
        title
        description
      }
    }
  }
`;

const PostTemplate = ({ data }) => {
  const markdown = data.markdownRemark;
  const { frontmatter, htmlAst } = markdown;
  const { title, description } = frontmatter;
  const html = loadAst(htmlAst);
  return (
    <Layout title={title} description={description}>
      {html}
    </Layout>
  );
};

export default PostTemplate;
```
