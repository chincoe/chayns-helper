## [roundDate](src/functions/timeHelper/roundDate.ts)
Round a date to a specific amount of milliseconds

| Parameter | Description | Type | Required/Default |
|------|-------------|------|------------------|
| date | Date to be rounded | Date/string/number | required |
| ms | amount of milliseconds to be rounded to | number | `300000`(5 minutes) |
| roundFn | the function used to round | (x: number) => number | `Math.round` |
| **@returns** | a rounded Date | Date | |

