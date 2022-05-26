## Lenra's Devtool

Start creating your apps with the Lenra's Devtool Docker image.

```bash
docker run -it --rm -p 4000:4000 -v ${PWD}:/home/app/function lenra/devtools-node12:beta
```

You can now access the <a href="http://localhost:4000/" target="_blank" rel="noopener">Devtool</a> to test your app.
