const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const { createFilePath } = require("gatsby-source-filesystem");

function replacePath(pagePath) {
  return pagePath === `/` ? pagePath : pagePath.replace(/\/$/, ``);
}

exports.onPreBootstrap = ({ reporter }, options) => {
  const contentPath = options.contentPath || "content";
  const dirs = [contentPath, `${contentPath}/posts`, `${contentPath}/code`];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      reporter.log(`creating the ${dir} directory`);
      fs.mkdirSync(dir);
    }
  });
};

exports.onCreateNode = async (
  {
    node,
    actions,
    getNode,
    loadNodeContent,
    createContentDigest,
    createNodeId
  },
  options
) => {
  const { createNodeField, createNode, createParentChildLink } = actions;
  const types = new Set(options.types);
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({
      node,
      getNode,
      basePath: "posts",
      trailingSlash: false
    });
    createNodeField({ name: "slug", node, value: slug });
  } else if (types.has(node.extension) === true) {
    if (node.internal.type !== "File") {
      return;
    }
    const codeContent = await loadNodeContent(node);
    const contentDigest = createContentDigest(codeContent);
    const id = await createNodeId(`${node.id}-code`);
    const internal = { type: "Code", contentDigest };
    const codeNode = {
      id,
      parent: node.id,
      children: [],
      code: codeContent,
      name: node.name,
      extension: node.extension,
      internal
    };
    createNode(codeNode);
    createParentChildLink({ parent: node, child: codeNode });
  }
};
