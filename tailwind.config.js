module.exports = {
    purge: [
        "./src/**/*.html",
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
