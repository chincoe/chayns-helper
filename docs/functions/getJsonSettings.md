## [getJsonSettings](src/functions/getJsonSettings.ts)
Modify the output of JSON.stringify with this function.
### Usage
```javascript
JSON.stringify(myObject, getJsonSettings({
    dateTimeZoneHandling: DateTimeZoneHandling.LocalOffset,
    ignoreNullValues: false,
    includeUndefined: false,
    includeNotSerializable: false,
    excludeKeys: ['excludeThisKey', 'uselessData']
}));
```

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| options | An object of JsonSettings | JsonSettings | required |
| **@returns** | A replacer function for JSON.stringify | function(key, value) | |

### JsonSettings
A config object with the following possible keys:

| Property | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| ignoreNullValues | Remove null values from result | boolean | `false`|
| includeUndefined | Includes undefined values as null | boolean | `false` |
| includeNotSerializable | Include not serializable values like functions as a string | boolean | `false`|
| excludeKeys | Exclude these keys everywhere | boolean | `false`|
| dateTimeZoneHandling | Adjust the date format. Can either result in a utc date or a dateTimeOffset | `'utc'`/`'localoffset'` | `'utc'` |

> Note: You can pass JsonSettings to [request.fetch()](httpRequest.md) as well. 
> That helper will call `getJsonSettings()` for you, so only the settings object should be passed there. 
