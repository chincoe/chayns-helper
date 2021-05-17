module.exports = {
    env: {
        browser: true,
        jquery: false,
        es6: true
    },
    globals: {
        chayns: true,
        NodeJS: true
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        'react-hooks',
        'react',
        'jsx-a11y',
        'import',
        '@typescript-eslint'
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    rules: {
        'import/no-unresolved': [
            2,
            {
                ignore: [
                    'chayns-components',
                    'chayns-logger',
                    'react-redux',
                    'react',
                    'chayns-doc'
                ]
            }
        ],
        'import/extensions': [
            1, 'ignorePackages', {
                js: 'never',
                ts: 'never',
                jsx: 'never',
                tsx: 'never'
            }
        ],
        'react-hooks/rules-of-hooks': 'warn',
        'max-len': ['warn', 120],
        'linebreak-style': 'off',
        indent: 0,
        strict: 0,
        'comma-dangle': 'off',
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-tag-spacing': 0,
        'react/jsx-indent': 0,
        'react/jsx-indent-props': 0,
        'jsx-a11y/no-static-element-interactions': 'off',
        'react/no-danger': 'warn',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'react/prefer-stateless-function': 'off',
        'no-cond-assign': 1,
        'no-console': [
            1,
            {
                allow: [
                    'error',
                    'group',
                    'groupCollapsed',
                    'groupEnd'
                ]
            }
        ],
        'no-constant-condition': 1,
        'no-control-regex': 1,
        'no-debugger': 1,
        'no-dupe-args': 1,
        'no-dupe-keys': 1,
        'no-duplicate-case': 1,
        'no-empty-character-class': 1,
        'no-empty': 1,
        'no-ex-assign': 1,
        'no-extra-boolean-cast': 1,
        'no-extra-semi': 1,
        'no-func-assign': 1,
        'no-inner-declarations': 1,
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 1,
        'no-negated-in-lhs': 1,
        'no-obj-calls': 1,
        'no-regex-spaces': 1,
        'no-sparse-arrays': 1,
        'no-unreachable': 2,
        'use-isnan': 1,
        'valid-typeof': 1,
        'no-fallthrough': 1,
        'no-octal': 1,
        'no-redeclare': 1,
        'no-delete-var': 1,
        'no-undef': 2,
        'no-mixed-spaces-and-tabs': 1,
        'no-trailing-spaces': 'warn',
        'arrow-body-style': 'warn',
        'react/self-closing-comp': 'warn',
        'jsx-a11y/media-has-caption': 0,
        'function-paren-newline': 1,
        'keyword-spacing': 1,
        'brace-style': 1,
        'padded-blocks': 1,
        'react/prop-types': 0,
        'object-curly-spacing': 1,
        'quote-props': 1,
        'react/jsx-closing-bracket-location': 1,
        'react/jsx-filename-extension': 0,
        'spaced-comment': 1,
        'import/order': 1,
        'react/jsx-boolean-value': 1,
        quotes: 1,
        'prefer-template': 1,
        'no-multi-spaces': 1,
        'arrow-parens': 1,
        'no-multiple-empty-lines': 1,
        'consistent-return': 1,
        'space-before-blocks': 1,
        'no-else-return': 1,
        'arrow-spacing': 1,
        'import/prefer-default-export': 1,
        semi: 1,
        'operator-linebreak': 1,
        'react/jsx-one-expression-per-line': 1,
        'array-bracket-spacing': 1,
        'space-in-parens': 1,
        'react/jsx-closing-tag-location': 1,
        'space-infix-ops': 1,
        'block-spacing': 1,
        'no-restricted-syntax': 1,
        'prefer-const': 1,
        'no-unused-expressions': 1,
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['warn'],
        'no-await-in-loop': 1,
        'object-curly-newline': 1,
        'comma-spacing': 1,
        'react/jsx-curly-spacing': 1,
        'operator-assignment': 1,
        'space-before-function-paren': 1,
        'no-unneeded-ternary': 1,
        'key-spacing': 1,
        'guard-for-in': 1,
        'react/jsx-wrap-multilines': 1,
        'no-nested-ternary': 1,
        'no-plusplus': 0,
        'react/jsx-curly-brace-presence': 1,
        'no-lonely-if': 1,
        curly: 1,
        'object-property-newline': 1,
        'jsx-a11y/anchor-is-valid': 0,
        camelcase: 0,
        'no-case-declarations': 0,
        'react/jsx-props-no-spreading': 0,
        'no-param-reassign': [
            2,
            {
                props: true,
                ignorePropertyModificationsFor: [
                    'draft'
                ]
            }
        ]
    },
    extends: [
        'airbnb',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ]
};
