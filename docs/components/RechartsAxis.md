## [RechartsAxis](src/components/recharts-axis/RechartsAxis.tsx)
A wrapper for an axis in a chart created with [recharts](https://recharts.org/).

If the amount of data ticks you have is too large to display labels for all of them on an axis, recharts will cut them down to intervals automatically.
This works great for certain data, but sometimes intervals of 5 or 10 are more pleasing than intervals of 7, and a label every hour is more useful than a label every 70 minutes.

This wrapper allows you to customize the interval of labels displayed on your axis to have better intervals, e.g. only multiples of 10 or only multiples of 30 minutes.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| children | A recharts YAxis or XAxis | ReactNode | required |
| start | The lowest value on your axis | number/T | required |
| end | The highest value on your axis | number/T | required |
| divisor | The parameter you're using this component for. All intervals are multiples of this property. If you supply an array of divisors, the component will first try to use other divisors before considering multiples of the last one | number/Array<number> | required
| minTicks | The minimum amount of labels you want to have | number | required |
| maxTicks | The maximum amount of labels you have space for | number | required |
| tickFormatter | A function to calculate the your tick values after calculation of tick number and interval length | (start: number, intervalLength: number, i: number) => number | (start, length, i) => (start + length * i) |

### Examples
* Basic usage
```jsx
// ticks: 0, 20, 40, 60, 80
<RechartsAxis
    start={0}
    end={100}
    divisor={5}
    minTicks={3}
    maxTicks={6}
>
    <XAxis/>
</RechartsAxis>
```
* Multiple divisors
```jsx
// ticks: 0, 25, 50, 75
<RechartsAxis
    start={0}
    end={100}
    divisor={[5, 10, 25]}
    minTicks={3}
    maxTicks={5}
>
    <XAxis/>
</RechartsAxis>
```
* Usage with dates
```jsx
<RechartsAxis
    start={startDate.getTime()}
    end={endDate.getTime()}
    divisor={1000 * 60 * 30}
    minTicks={3}
    maxTicks={5}
>
    <XAxis tickFormatter={(date) => fnsFormat(new Date(date), 'H:mm')} />
</RechartsAxis>
```
