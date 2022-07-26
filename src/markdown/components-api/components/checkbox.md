# checkbox

This component provides a toggleable checkbox with several presentation options.
 
## Examples

### Simple checkbox

Here is a checkbox in it's simplest form.
```json
{
    "type": "checkbox",
    // data["checkbox"] being either true/false
    "value": data["checkbox"],
    "onPressed": {
        "code": "checkbox",
    }
}
```

### Disabled checkbox

To disable a checkbox you only need to not use the `onPressed` property.

```json
{
    "type": "checkbox",
    // Checkbox will still be checked even if disabled when setting value to true
    "value": true,
}
```

### Tristate checkbox

The checkbox can be used as a tristate element. This means that in addition to being `true`/`false` it can also be `null`. This is commonly used on tables that contains multiple checkboxes, when only a part of the checkboxes are selected, the "parent" checkbox enters the third state, it is not checked because not all of its children have been selected and not unchecked beause some have been.

```json
{
    "type": "checkbox",
    // data["checkbox"] being either true/false/null
    "value": data["checkbox"],
    "tristate": true,
    "onPressed": {
        "code": "checkbox"
    }
}
```