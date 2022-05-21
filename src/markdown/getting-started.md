## Lenra's Devtool

Start creating your apps with the Lenra's Devtool Docker image.

```bash
docker run -it --rm -p 4000:4000 -v ${PWD}:/home/app/function lenra/devtools-node12:beta
```