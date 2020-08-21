module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "prismjs",
      {
        languages: ["javascript", "css", "markup", "java", "html"],
        plugins: ["line-numbers", "highlight-keywords"],
        theme: "okaidia",
        css: true
      }
    ]
  ]
}
