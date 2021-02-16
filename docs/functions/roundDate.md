## [roundDate](src/functions/timeHelper/roundDate.ts)
Round a date to a specific amount of milliseconds

| Parameter | Description | Type | Required/Default |
|------|-------------|------|------------------|
| date | Date to be rounded | Date/string/number | required |
| ms | amount of milliseconds to be rounded to | number | `300000`(5 minutes) |
| roundFn | the function used to round | (x: number) => number | `Math.round` |
| **@returns** | a rounded Date | Date | |

### Examples 
```javascript
const date = roundDate(Date.now()); // => Date rounded to 5 minutes
const roundedDate = roundDate(Date.now(), time.minute * 15); // => Date rounded to 15 minutes
const flooredDate = roundDate(Date.now(), time.minute * 30, Math.floor); // => Date rounded down to 30 minutes
```
