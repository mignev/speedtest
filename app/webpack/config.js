import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
// import WebpackCopyPlugin from 'webpack-copy-plugin';

export const ROOT_PATH = path.join(__dirname, '..');
export const APP_PATH = `${ROOT_PATH}/src`;
export const CONFIG = {
  devtool: 'source-map',

  target: 'web',
  context: APP_PATH,
  entry: {
    loader: `${APP_PATH}/assets/core/loader`,
  },

  output: {
    chunkFilename: 'chunk-[name]-[hash].js',
    filename: 'bundle-[name]-[hash].js',
    path: `${ROOT_PATH}/build`,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'postcss-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          publicPath: '/',
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(woff)$/i,
        loader: 'url-loader',
        options: {
          publicPath: '/',
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss'],

    modules: [
      APP_PATH, 'node_modules',
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

export default ({ device }) => {
  return webpackMerge(CONFIG, {
    plugins: [
      new webpack.DefinePlugin({
        DEVICE_ENV: JSON.stringify(device),
      }),
    ],
  });
};
