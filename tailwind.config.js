module.exports = {
    content: [
        "./src/client/templates/**/*.html",
        "./src/client/static/**/*.js",
        "./src/client/static/css/**/*.css"
    ],
    theme: {
        extend: {
            colors: {
                table: '#2c333e',
                gold: '#d4af37',
                goldLight: '#e9d08e',
                goldDark: '#b08c1a',
                win: '#48bb78',
                loss: '#f56565',
                background: '#f8f9fa',
                secondary: '#4a5568',
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
            },
        }
    }
}
