const plugin = require('tailwindcss/plugin');

module.exports = {
    content: [
        "./public/**/*.html",
        "./src/**/*.js"
    ],
    theme: {
        extend: {},
    },
    variants: {
        extend: {
            opacity: ['disabled'],
            cursor: ['disabled'],
            pointerEvents: ['disabled'],
            borderColor: ['invalid'],
            ringColor: ['invalid'],
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        plugin(function({ addVariant, e }) {
            addVariant('invalid', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.${e(`invalid${separator}${className}`)}:invalid`
                })
            })
        })
    ],
};
