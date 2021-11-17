const HtmlWebpackPlugin = require("html-webpack-plugin");
const svgToMiniDataURI = require("mini-svg-data-uri");

const path = require("path");
const fs = require("fs");

// Get the pages
const pages = (function (pagesDir) {
  const files = fs.readdirSync(path.resolve(pagesDir));
  const togo = {};

  files.filter(file => path.extname(file) === ".js").forEach(file => {
    const name = path.basename(file, ".js");
    const html = `${name}.html`;

    if (files.includes(html)) {
      togo[name] = "./" + path.join(pagesDir, file);
    }
  });

  return togo;
})("./src/pages");

// Entry point for each page.
const html = Object.entries(pages).map(([key]) => {
  return new HtmlWebpackPlugin({
    template: "public/index.html",
    filename: `${key}.html`,
    chunks: [key],
    partial: `${key}.html`
  });
});

module.exports = {
  mode: "development",
  entry: pages,
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name]-[fullhash].js",
    clean: true,
    assetModuleFilename: "img/[name]-[hash][ext]"
  },

  devServer: {
    port: 8081,
    hot: false,

    // Redirect API requests to the API server.
    proxy: {
      "/api": {
        target: "http://localhost:5002/",
        pathRewrite: { "^/api": "" },
        secure: false
      }
    }
  },

  devtool: "source-map",

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        },
        css: {
          test: /\.s?css$/,
          name: "style",
          chunks: "all"
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.html$/,
        exclude: /public/,
        loader: "html-loader",
        options: {
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(svg|png)$/,
        exclude: /bootstrap-icons/,
        type: "asset/resource"
      },
      {
        test: /\.svg$/,
        include: /bootstrap-icons/,
        type: "asset/inline",
        generator: {
          dataUrl: content => svgToMiniDataURI(content.toString())
        }
      }
    ]
  },
  plugins: [
  ].concat(html)
};

