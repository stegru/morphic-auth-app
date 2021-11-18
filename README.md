# morphic-auth-app

Login and user registration for Morphic.

## Running locally

This requires the [Morphic API Server](https://github.com/raisingthefloor/morphic-api-server/) to be running.

Install the project dependencies:

    npm install

Serve the web-app:

    npm run serve

This will start a development server on `0.0.0.0:8081` ([http://localhost:8081/](http://localhost:8081/)), which reloads
when a file has been changed. Additionally, the web-app will assume the API server is listening at the same address
(the development server redirects requests to the real address), so there should be no cross-origin related issues. This
also provides the ability to hook-up to an external API server.

Inspect [src/config.js](src/config.js) and `devServer` in [webpack.config.js](webpack.config.js) for the details.

### Production build

    npm run build

Output is in [dist/](dist)

### Lints and fixes files

    npm run lint



