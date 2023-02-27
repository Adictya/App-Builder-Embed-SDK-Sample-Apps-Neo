This repository is for the following [blog](https://appbuilder-docs.agora.io/sdks/guides/embed_web_sdk_vanillajs)

# Build Web-sdk

- Build web-sdk via cli, refer to the blog for instructions on how to do it.

# Copy generated js file into the project folder

- Go to where this directory is cloned

For mac/unix
- `cd html-app`
- `cp <path-to-app-builder>/Builds/web-sdk/app-builder-web-sdk.var.js ./app-builder-web-sdk.var.js`

For windows
- `cd html-app`
- `copy <path-to-app-builder>\\Builds\\web-sdk\\app-builder-web-sdk.var.js .\app-builder-web-sdk.var.js`

<!-- # Install additional dependencies [NOT NEEDED FOR SAMPLE APP]
- `npm install react-router-dom@5 @apollo/client@3 nanoid@4` -->

# Run the app

- `npm run start`
