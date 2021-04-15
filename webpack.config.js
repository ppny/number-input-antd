const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/, // 匹配js、jsx、ts、tsx文件
          use: [
            {
              loader: require.resolve('babel-loader'),
            },
          ],
          exclude: /node_modules/, // 不检测的文件
        },
        {
          test: /\.css$/, // 匹配css文件
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
          ],
          // loaders: ['style-loader', 'css-loader'],
        },
        {
          test: /\.less$/, // 匹配less文件
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif)$/, // 匹配文件
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
    ]
};