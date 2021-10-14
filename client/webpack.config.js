const path = require("path");

module.exports = {
    devServer: {
        open: true,
        historyApiFallback: true,
        devMiddleware: {
            publicPath: "/dist"
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
        ]
    }
};
