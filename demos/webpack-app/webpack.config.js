const path = require('path');

function bundle(name) {
	return {
		entry: `./src/${name}.ts`,
		cache: false,
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		output: {
			filename: `${name}.js`,
			path: path.resolve(__dirname, 'public/builds'),
		}
	}
}

module.exports = [
	bundle('crop'),
	bundle('inpainting-mask'),
	bundle('template-creator'),
];
