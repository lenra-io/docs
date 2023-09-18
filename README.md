# Documentation

Lenra's documentation web site

## Development
To launch the server in dev mode, run the following commands:

```bash
# Install dependencies
npm i
# Load external API pages
npm run load-api
# Start the server
npm start
```

## Release

To release a new version of the documentation, run the following commands:

```bash
# Install dependencies
npm i
# Load external API pages
npm run load-api
# Build the static site
npm run build
# Build the docker image
docker build -t lenra/docs:local .
```

You can then run the docker image with:

```bash
docker run -p 8080:8080 lenra/docs:local
```

and access the documentation at http://localhost:8080

The search engine is only available with the release version.