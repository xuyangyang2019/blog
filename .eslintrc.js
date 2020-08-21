module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": "off"
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     tabWidth: 2,
    //     useTabs: false,
    //     semi: false,
    //     singleQuote: false,
    //     trailingComma: 'none',
    //     bracketSpacing: true,
    //     jsxBracketSameLine: true,
    //     arrowParens: 'always',
    //     printWidth: 120
    //   }
    // ]
  }
}
