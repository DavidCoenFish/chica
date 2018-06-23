const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		standaloneedit: './source/standaloneedit/standaloneedit.js',
		standaloneaction: './source/standaloneaction/standaloneaction.js',
		standalonemission: './source/standalonemission/standalonemission.js',
	},
	output: {
		filename: 'js/[name].bundle.js'
	},
	//watch: true,
	//watchOptions: {
		//ignored: [/data/, "d:\\development\\chica\\client3\\data\\version.js"]
	//	ignored: ["d:\\development\\chica\\client3\\data\\version.js"]
	//},
	module: {
		rules: [
		{
			test: /\.css$/,
			use: [
			'style-loader',
			'css-loader'
			]
		},
		{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['es2015']
				}
			}
		}
		
		]
	}	
};
