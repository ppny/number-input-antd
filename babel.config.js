const presets = ['@babel/preset-env', '@babel/preset-react'];
console.log("*************")
const plugins = [
  [
    'import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    },
  ],
];
module.exports = { presets, plugins };
