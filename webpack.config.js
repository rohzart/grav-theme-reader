"use strict";
// #################################################################################
// #################################################################################
// #################################################################################
// REQUIRE
const path = require("path"); 
const glob = require('glob');
const webpack = require("webpack"); 
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const PurifyCSSPlugin = require('purifycss-webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");


// #################################################################################
// #################################################################################
// #################################################################################
// Custom variables
let webpackMode = 'development';
// let webpackMode = 'production';

// Paths
const sourceFolderName = "";
const distributionFolderName = "static";
// Paths - Styleguide pages
const StyleGuideFolder = sourceFolderName + "styleguide";
const pathStyleGuidePage1 = StyleGuideFolder + "/main.html";
const pathStyleGuidePages = [ 
    path.resolve(__dirname, "." + pathStyleGuidePage1)
];
// Paths - Entry points
const pathScss = path.resolve(__dirname, sourceFolderName + "scss/common.scss");
const pathTscript = path.resolve(__dirname, sourceFolderName + "tscript/common.ts");
const pathMain = path.resolve(__dirname, sourceFolderName + "testscripts/index.js");
const entryDefinition = {
    main: pathMain
}
// const entryDefinition = {
//     main: [ pathMain, pathScss, pathTscript ]
// }
// const entryDefinition = {
//     main: [ pathMain, pathScss, pathTscript ].concat(pathStyleGuidePages)
// }
// const entryDefinition = {
//     main: path.resolve(__dirname, pathStyleGuidePage1)
// }

const paths = {
    entry: entryDefinition,
    output: path.join(__dirname, distributionFolderName)
};

const nameTemplates = {
    scripts: "bundle.js",
    scriptsChunks: "bundle.js?v=[chunkhash]",
    styles: "bundle.css",
    stylesChunks: "[id].css",
    images: "[name].[ext]",
    fonts: "[name].[ext]"
};

// #################################################################################
// #################################################################################
// #################################################################################
// Plugins

const cleanWebpackPlugin = new CleanWebpackPlugin();
const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: "css/" + nameTemplates.styles,
    chunkFilename: "css/" + nameTemplates.stylesChunks
});
// const purifyCSSPlugin = new PurifyCSSPlugin({
//     paths: glob.sync(path.join(__dirname, StyleGuideFolder + '/**/*.html')),
// });
// const copyPlugin = new CopyWebpackPlugin([
//     { from: unifyimages, to: "img" },
//     { from: fontawesome, to: "fonts" }
// ]);
const definePlugin = new webpack.DefinePlugin({
    "process.env": {
        NODE_ENV: webpackMode
    }
});
const providePlugin = new webpack.ProvidePlugin({
    Promise: "es6-promise-promise",
});
const compressionPlugin = new CompressionPlugin({
    test: /\.js$|\.css$|\.html$/,
    filename: "[path].gz[query]",
    algorithm: "gzip"
});
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    title: 'From HtmlWebpackPlugin',
    // template: pathStyleGuidePage1,
    // filename: 'main.html'
});
const hmr = new webpack.HotModuleReplacementPlugin();

// #################################################################################
// #################################################################################
// #################################################################################
// FINAL

module.exports = function (env, argv) {

    if(argv.mode) webpackMode = argv.mode;
    let isProduction = webpackMode === 'production'

    return {
        mode: webpackMode,
        entry: entryDefinition,
        output: {
            path: paths.output
            ,filename: "js/" + nameTemplates.scripts
            ,chunkFilename: "js/" + nameTemplates.scriptsChunks
            // ,publicPath: "../"
            ,hotUpdateChunkFilename: 'hot/hot-update.js'
            ,hotUpdateMainFilename: 'hot/hot-update.json'
        },
        devtool: "inline-source-map",
        devServer: {
            port: 9000
            ,hot: true
            ,contentBase: "./static"
            // ,publicPath: "/static/"
            // ,inline: true
            // ,compress: true,
            // ,historyApiFallback: true,
            // ,noInfo: true,
            // ,overlay: true
        },
        module: {
            rules: [
                // {
                //     test: /\.html$/,
                //     use: {
                //         loader: 'html-loader'
                //     }
                // },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel-loader"
                },
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    options: { appendTsSuffixTo: [/\.vue$/], transpileOnly: isProduction }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: 
                    [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { publicPath: "../" }
                        },
                        {
                            loader: "css-loader",
                            options: { sourceMap: !isProduction, url: true }
                        },
                        {
                            loader: "postcss-loader",
                            options: { ident: 'postcss', sourceMap: !isProduction, sourceMapContents: !isProduction }
                        },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: !isProduction, sourceMapContents: !isProduction }
                        }
                    ]
                },
                // {
                //     test: /\.(png|jpe?g|gif|svg?)(\?[a-z0-9]+)?$/,
                //     use: 
                //     {
                //         loader: "file-loader",
                //         options: {
                //             name: ImagesNameTemplate,
                //             outputPath: ImagesFolder
                //         }
                //     }
                // },
                {
                    test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: 
                    { 
                        loader: "file-loader",
                        // exclude: [/images/,/image/,/img/],
                        options: {
                            name: nameTemplates.fonts,
                            outputPath: "fonts/"
                        }
                    }
                }
            ]
        },
        plugins: [
            cleanWebpackPlugin,
            miniCssExtractPlugin,
            // purifyCSSPlugin,
            // copyPlugin,
            definePlugin,
            providePlugin,
            compressionPlugin,
            htmlWebpackPlugin,
            hmr
        ]
    };
};