# text

This is a typical text component. 

This component has a `children` property in case some complex text needs to be done (see examples below).

## Examples

### Basic text

```json
{
    "type": "text",
    "value": "This is a text.",
}
```

### Complex text

This is an example involving a complex text. It is composed of bold and italic values all in one sentence.

```json
{
    "type": "text",
    "value": "This is a text involving",
    "children": [
        {
            "type": "text",
            "value": "bold",
            "style": {
              "fontWeight": "bold",
            },
        },
        {
            "type": "text",
            "value": "and",
        },
        {
            "type": "text",
            "value": "italic",
            "style": {
              "fontStyle": "italic",
            },
        },
        {
            "type": "text",
            "value": "values.",
        },
    ]
}
```