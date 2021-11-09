module.exports = {
    purge: [
        "./public/**/*.html",
        "./src/**/*.js"
    ],
    darkMode: false,
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [
        require('@tailwindcss/forms')
    ],
};
