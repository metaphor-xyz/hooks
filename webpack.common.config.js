module.exports = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
    rules: [
      {
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				exclude: /node_modules/,
        use: 'ts-loader',
			},
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
};
