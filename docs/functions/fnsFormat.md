## [fnsFormat](src/functions/timeHelper/fnsFormat.ts)
A wrapper for [date-fns format](https://date-fns.org/v2.17.0/docs/format) that increases the ease of use and adds these features:
* Replace dates of today, tomorrow and yesterday with "Heute", "Morgen", "Gestern"
* Show year only if the year is not the current year

| Parameter | Description | Type | Required/Default |
|------|-------------|------|------------------|
| date | the date to be formatted | Date/string/number | required |
| formatString | the [date-fns format](https://date-fns.org/v2.17.0/docs/format) string | string | required |
| options.useToday | replace dates of today, tomorrow and yesterday with their respective string | boolean | `false` |
| options.appendYear | append the year to the result string if it's not the current year. Alternatively use `yyyy?` in your format string to have the year removed if it's the current year | boolean | `false` |
| options.locale | date-fns locale to support other languages | Locale | `deLocale` |
| **@returns** | the formatted date string | string |

### Examples
```javascript
// assume that the example date is today
const date = new Date(1600000000000); // 2020-09-13T14:26:40.000 +02:00
let str = fnsFormat(date, 'HH:mm'); // => '14:26'
str = fnsFormat(date, 'dd.MM., HH:mm', { useToday: true }); // => 'Heute, 14:26'
str = fnsFormat(date, 'dd.MM. yyyy'); // => '13.09. 2020'
str = fnsFormat(date, 'dd.MM. yyyy?'); // => '13.09.'
```
