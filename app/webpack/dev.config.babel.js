import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import makeConfig, { APP_PATH } from './config';

const CONFIG = makeConfig({ device: 'browser' });

export default merge(CONFIG, {
  devtool: 'eval-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      baseUrl: '/',
      template: `${APP_PATH}/template.html`,
      favicon: `${APP_PATH}/assets/images/favicon.ico`,
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],

  performance: {
    hints: false,
  },

  devServer: {
    historyApiFallback: true,
    openPage: '',
    inline: true,
    noInfo: false,
    open: true,
    port: 9999,
    hot: true,

    stats: {
      errorDetails: true,
      publicPath: false,
      children: false,
      warnings: true,
      version: true,
      modules: false,
      timings: true,
      reasons: false,
      colors: true,
      assets: true,
      chunks: false,
      source: false,
      errors: true,
      hash: true,
    },
  },
});
