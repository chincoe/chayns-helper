## [getJsonSettings](getJsonSettings.ts)
Modify the output of JSON.stringify with this function.
### Usage
```javascript
JSON.stringify(myObject, getJsonSettings(options));
```

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| options.ignoreNullValues | Remove null values from result | boolean | `false`|
| options.includeUndefined | Includes undefined keys as null | boolean | `false` |
| options.includeNotSerializable | Include not serializable values like functions as a string | boolean | `false`|
| options.excludeKeys | Exclude these keys everywhere | boolean | `false`|
| options.dateTimeZoneHandling | Adjust the date format | `'default'`/`'localoffset'` | `'default'` |
| **@returns** | A replacer function for JSON.stringify | function(key, value) | |
