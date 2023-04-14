module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  plugins: ["simple-import-sort", "import"],
  rules: {
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowNumber: true,
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
  },
};
