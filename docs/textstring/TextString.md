## TextString

There are several helpers that make using text strings more comfortable. To use those helpers, make sure you initialize
this package with the required information on initialization:

```javascript
// REQUIRED INITIALIZATION
// index.jsx
initTextStrings({
    prefix: 'txt_chayns_myapp_', // necessary to use all textString helpers
    libName: 'MyTextLib', // necessary for textString auto creation and to load the library automatically
});
```
This will automatically load your TextString library as well. If you wish to load multiple languages, pass an array of language strings as second parameter:
```javascript
// load multiple languages
initTextStrings({
    prefix: 'txt_chayns_myapp_',
    libName: 'MyTextLib', 
}, ['de', 'en', 'nl', 'fr']);
```

## [TextStringComplex](src/textstring/TextStringComplex.tsx)

This component wraps the `TextString` chayns-component and adds prefix usage, jsx replacements and auto-creation.

| Property | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|stringName| The name of the textString. The prefix will be added in front of this. | string | required |
|fallback| A fallback if no value is found | string | required |
|replacements| Replacements for the string. Key can be string or regex. Value can be a string or a function that receives the matched string, the regex (if the key was a regex) and the key (variable) and returns a string or jsx | Object<string/regex, string/function({ match: string, regexMatch: RegExpMatchArray?, variable: string/regex }): string/jsx> | `{}` |
|maxReplacements| Maximum iterations to check for replacements as a safeguard against infinite loops | number | `20` |
|useDangerouslySetInnerHTML| render HTML strings as HTML by converting it to react elements | boolean | `false` |
|language| Set a textString language | string | `undefined` |
|autoCreation| Automatically create the textString on render for authorized users if it does not exist yet | boolean | `process.env.NODE_ENV === 'production'`|
|children| An empty, self-closing tag to define the node that the string will be rendered into | ReactElement | `<p/>` |

### Examples

```jsx
<TextStringComplex
    stringName="string_name"
    fallback="This is a ##LINK##GREAT##LINK## ##NAME##"
    replacements={{
        // simple version
        '##NAME##': nameString,
        // complex version
        [/##LINK##(.*?)##LINK##/]: ({
            // the matching part of the string, here: '##LINK##GREAT##LINK##' 
            match,
            // the result of string.match(regex), here: ['##LINK##GREAT##LINK##', 'GREAT', index: 10, input: 'This is a ##LINK##GREAT##LINK## ##NAME##']
            regexMatch,
            // the original variable, as string or regex. here: /##LINK##(.*?)##LINK##/
            variable
        }) => (
            // access regexMatch[1] for the value of the first regex capture group, here: 'GREAT'
            <a href="https://google.com">{regexMatch[1]}</a>
        ) 
    }}
>
    <p/>
</TextStringComplex>
```

## [jsxReplace](src/textstring/jsxReplace.tsx)

A string replace function that can replace parts of strings with React nodes.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|text| The target string | string | required |
|replacements| Replacements for the string. Identical to the replacements in TextStringComplex |Object<string/RegExp, string/function({match: string, regexMatch: RegExpMatchArray, variable: string/RegExp}): string/jsx> | required |
|maxReplacements| Maximum iterations to check for replacements as a safeguard against infinite loops | number | `255` |
|useDangerouslySetInnerHTML| render HTML strings as HTML by converting it to react elements | boolean | `false` |
|guid | A guid as base for the keys in the result array | string | new Guid |
| **@returns** | An array of strings and react nodes that can be rendered | Array<string/ReactElement> | |

## [getTextStrings](src/textstring/getTextStrings.ts)

A function to get multiple text strings using the configured prefix.

This function has 3 overloads:
1. `getTextStrings(stringName: string, fallback: string, language?: string): string`
   
| Parameter | Description | Type | Default/required |
   |------|--------------|-----------|-------------|
   | textString | the stringName of the textString | string | required |
   | fallback | fallback if the string is not found | string | required |
   | language | specify a custom language that overrides the default language | string | `undefined` |
   | **@returns** | the textString  | string | |

2. `getTextStrings(stringNames: string[], language?: string): string[]`

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| textStrings | an array of stringNames | Array<string> | required |
| language | specify a custom language that overrides the default language | string | `undefined` |
| **@returns** | An array of strings in the input order.  | Array<string> | |

3. `getTextStrings(stringNames: Object<string, string>, language?: string): string[]`

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| textStrings | an with stringNames and fallbacks, like { stringName: fallback, ... } | Object<string, string> | required |
| language | specify a custom language that overrides the default language | string | `undefined` |
| **@returns** | An array of strings in the input order.  | Array<string> | |

Fallbacks can only be passed in the object notation. Otherwise, the fallback is `undefined` for an Array input and `''`
for a string input.

### Examples

```javascript
// Overload 1, inline, single textstring
const singleString = getTextStrings('stringName', 'fallback');
// Overload 2, get multiple strings, array notation
const [
    TXT_1 = 'fallback 1',
    TXT_2 = 'fallback 2'
] = getTextStrings([
    'stringName1',
    'stringName2'
]);
// Overload 3, get multiple with object notation
const [
    TXT_1,
    TXT_2
] = getTextStrings({
    stringName1: 'fallback 1',
    stringName2: 'fallback 2'
});
// alternative destructuring notation is available for Overload 2 and 3,
// because text strings are set as result[stringName] as well
const {
    stringName1: customStringName = 'fallback 1',
    stringName2 = 'fallback 2'
} = getTextStrings([
    'stringName1',
    'stringName2'
]);
const {
    stringName1,
    stringName2
} = getTextStrings({
    stringName1: 'fallback 1',
    stringName2: 'fallback 2'
});
```

## [useTextStrings](src/textstring/useTextStrings.ts)

A hook version of getTextStrings that wraps [getTextStrings](#gettextstrings) in a `useMemo` hook.
Only Overload 2 and 3 of getTextStrings are available for this hook.

### Examples
```javascript
// Overload 2, get multiple strings, array notation
const [
    TXT_1 = 'fallback 1',
    TXT_2 = 'fallback 2'
] = useTextStrings([
    'stringName1',
    'stringName2'
]);
// Overload 3, get multiple with object notation
const [
    TXT_1,
    TXT_2
] = useTextStrings({
    stringName1: 'fallback 1',
    stringName2: 'fallback 2'
});
// alternative destructuring notation is available for Overload 2 and 3,
// because text strings are set as result[stringName] as well
const {
    stringName1: customStringName = 'fallback 1',
    stringName2 = 'fallback 2'
} = useTextStrings([
    'stringName1',
    'stringName2'
]);
const {
    stringName1,
    stringName2
} = useTextStrings({
    stringName1: 'fallback 1',
    stringName2: 'fallback 2'
});
```
