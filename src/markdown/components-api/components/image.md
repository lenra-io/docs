# image

The image component. 

This component can be used to load an image online or directly from the application.

## Examples

### Simple image

```json
{
    "type": "image",
    "src": "https://avatars.githubusercontent.com/u/18312505?s=200&v=4",
}
```

### Image with placeholders

```json
{
    "type": "image",
    "src": "https://avatars.githubusercontent.com/u/18312505?s=200&v=4",
    "errorPlaceHolder": {
        "type": "text",
        "value": "This placeholder is shown when the image encounters an error."
    },
    "framePlaceholder": {
        "type": "text",
        "value": "This placeholder is shown over the image as a custom frame."
    },
    "loadingPlaceholder": {
        "type": "text",
        "value": "This placeholder is shown when the image is still loading."
    }
}
```

### Image size

```json
{
    "type": "image",
    "src": "https://avatars.githubusercontent.com/u/18312505?s=200&v=4",
    "width": 150,
    "height": 150,
}
```