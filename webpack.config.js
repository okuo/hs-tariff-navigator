const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      popup: './src/popup/index.tsx',
      content: './src/content/index.ts',
      background: './src/background/index.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss'),
                    require('autoprefixer')
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/popup/popup.html',
        filename: 'popup.html',
        chunks: ['popup']
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './public',
            to: '.'
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
          'VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
          'VITE_APP_ENV': JSON.stringify(process.env.VITE_APP_ENV || 'development'),
          'VITE_LOG_LEVEL': JSON.stringify(process.env.VITE_LOG_LEVEL || 'development'),
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }
      })
    ],
    devtool: isProduction ? false : 'cheap-module-source-map',
    optimization: {
      minimize: isProduction,
      // Service Worker用の最適化
      splitChunks: {
        chunks: (chunk) => {
          // backgroundはチャンクを分割しない
          return chunk.name !== 'background';
        }
      }
    },
    // Service Worker関連の警告を抑制
    stats: {
      warningsFilter: [
        /require function/,
        /Critical dependency/
      ]
    }
  };
};