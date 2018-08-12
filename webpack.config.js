const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

new UglifyJsPlugin({
    sourceMap: true
})

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
	  { from: './app/about.html', to: "about.html"},
	  { from: './app/result.html', to: "result.html"}
    ])
  ],
  module: {
    rules: [
			{
				test: /\.(jpg|png)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "./app/img/[hash].[ext]",
					},
				},
			},
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ]	
  }
}
