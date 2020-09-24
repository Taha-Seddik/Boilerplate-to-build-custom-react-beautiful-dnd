import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import flowEntry from "rollup-plugin-flow-entry";
import json from "rollup-plugin-json";
import react from "react";
import reactDom from "react-dom";

const excludeAllExternals = (id) => !id.startsWith(".") && !id.startsWith("/");
const extensions = [".js", ".jsx"];
const commonjsArgs = {
  include: "node_modules/**",
  // needed for react-is via react-redux
  // https://stackoverflow.com/questions/50080893/rollup-error-isvalidelementtype-is-not-exported-by-node-modules-react-is-inde/50098540
  namedExports: {
    "node_modules/react-is/index.js": [
      "isValidElementType",
      "isContextConsumer",
    ],
  },
};

export default [
  // CommonJS (cjs) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input: "src/index.js",
    output: {
      file: "./dist/react-beautiful-dnd.cjs.js",
      format: "cjs",
    },
    external: excludeAllExternals,
    plugins: [
      json(),
      flowEntry(),
      babel({
        exclude: "node_modules/**",
      }),
      resolve({ extensions }),
      commonjs(commonjsArgs),
    ],
  },

  // EcmaScript Module (esm) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input: "src/index.js",
    output: { file: "./dist/react-beautiful-dnd.esm.js", format: "esm" },
    external: excludeAllExternals,
    plugins: [
      json(),
      flowEntry(),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]],
      }),
      resolve({ extensions }),
      commonjs(commonjsArgs),
    ],
  },
];
