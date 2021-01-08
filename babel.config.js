module.exports = {
  presets: [
    '@babel/preset-env'
  ],
  'plugins': [
    'dynamic-import-webpack',
    ['prismjs',
      {
        'languages': ['html', 'css', 'javascript', 'php', 'dart', 'bash', 'nginx', 'sql'],
        'plugins': ['line-numbers', 'highlight-keywords'],
        'theme': 'okaidia',
        'css': true
      }]
  ]
  // "presets": [
  //     '@vue/cli-plugin-babel/preset'
  // ],
  // "plugins": [
  //     [
  //         "component",
  //         {
  //             "libraryName": "element-ui",
  //             "styleLibraryName": "theme-chalk"
  //         }
  //     ]
  // ]
}
