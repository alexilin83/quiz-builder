const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        "./public/**/*.html",
        "./src/**/*.js"
    ],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.blueGray,
            teal: colors.teal,
            red: colors.rose,
            yellow: colors.yellow,
            blue: colors.blue,
        }
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
