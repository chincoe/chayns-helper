## [TextString](TextStringComplex.tsx)
There are several helpers that make using text strings more comfortable.
To use those helpers, make sure you initialize this package with the required information:
```javascript
initChaynsHelper({
    textStringPrefix: 'txt_chayns_myapp_', // necessary to use all textString helpers
    textLibName: 'MyTextLib', // necessary for textString auto creation
});
```
### TextStringComplex
This component wraps the `TextString` chayns-component and adds prefix usage, jsx replacements and auto-creation.

| Property | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|stringName| The name of the textString. The prefix will be added in front of this. | string | required |
|fallback| A fallback if no value is found | string | required |
|replacements| Replacements for the string. Key can be string or regex. Value can be a string or a function that receives the matched string, the regex (if the key was a regex) and the key (variable) and returns a string or jsx | Object<string/regex, string/function({ match: string, regex: RegExp?, variable: string }): string/jsx> | `{}` |
|maxReplacements| Maximum iterations to check for replacements as a safeguard against infinite loops | number | `20` |
|useDangerouslySetInnerHTML| render HTML strings as HTML. Wraps everything in spans to achieve that | boolean | `false` |
|language| Set a textString language | string | `undefined` |
|autoCreation| Automatically create the textString on render for authorized users if it does not exist yet | boolean | `process.env.NODE_ENV === 'production'`|
|children| An empty, self-closing tag to define the node that the string will be rendered into | ReactElement | `<span/>` |

#### Examples
```jsx
<TextStringComplex
    stringName="string_name"
    fallback="This is a ##LINK##GREAT##LINK## ##NAME##"
    replacements={{ 
        '##NAME##': nameString, // simple version
        [/##LINK##(.*?)##LINK##/]: ({ match, regex, variable }) => (<a href="https://google.com">{match.match(regex)[1]}</a>)
    }}
>
    <p/>
</TextStringComplex>
```

### jsxReplace
A string replace function that can replace parts of strings with React nodes.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|text| The target string | string | required |
|replacements| Replacements for the string. Identical to the replacements in TextStringComplex |Object<string/regex, string/function(...string): string/jsx> | required |
|maxReplacements| Maximum iterations to check for replacements as a safeguard against infinite loops | number | `20` |
|useDangerouslySetInnerHTML| render HTML strings as HTML. Wraps everything in spans to achieve that | boolean | `false` |
|guid | A guid as base for the keys in the result array | string | new Guid |
| **@returns** | An array of strings and react nodes that can be rendered | Array<string/ReactElement> | |

