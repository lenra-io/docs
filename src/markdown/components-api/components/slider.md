# slider

The slider component can be used to select from a **range** of values.

A certain amount of **divisions** can be set for the slider using the `divisions` property. Then, the `min` and `max` properties need to be set to define the values of the slider. For example, in the case of a slider ranging from **1 to 10** the number of divisions would be 10 and the **min** and **max** properties would be respectively set to 1 and 10.

This component defines 3 types of listener. `onChanged` that is called when the value of the slider changes. `onChangeStart` called when the handle of the slider is pressed. `onChangeEnd` called when the handle of the slider is released.

## Examples

### Slider ranging from 1 to 10

For this example, the data should contain the `slider` value and the `onChanged` listener should properly change that value.

```json
{
    "type": "slider",
    "value": data["slider"],
    "divisions": 10,
    "label": data["slider"],
    "min": 1,
    "max": 10,
    "onChanged": {
        "code": "changeSliderValue",
    }
}
```