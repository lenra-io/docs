# wrap

This component can be used to display a long list of components, if they get out of the screen the wrap component will make the overflowing ones use a new row.

## Examples

### Simple wrap

```json
{
    "type": "wrap",
    "spacing": 10,
    "children": [
        {
            "type": "text",
            "value": "Foo",
        },
        // This text will be wrapped, this means that it will show itself right under the "Foo" text instead of out of the screen
        {
            "type": "text",
            "value": "Wrapped",
        }
    ]
}
```