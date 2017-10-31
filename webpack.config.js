var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
	context: __dirname,
	entry: ["./client.js", "./index.css"],
	output: {
		path: path.join(__dirname, 'build/'),
		filename: "app.js",
		publicPath: '/build/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader",
				  publicPath: "/build/"
				})
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new ExtractTextPlugin({
			filename: "app.css",
			disable: false,
			allChunks: true
		}),
		new webpack.optimize.UglifyJsPlugin({ minimize: true, mangle: false, sourcemap: false }),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$/
		})
	]
};
