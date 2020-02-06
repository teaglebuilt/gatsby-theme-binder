import React from "react";
import rehypeReact from "rehype-react";
import CodeBlock from "./components/code";

export const loadAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    codeblock: CodeBlock
  }
}).Compiler;
