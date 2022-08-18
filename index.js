const faparser = require('./src/faparser')

module.exports = { 
    getFilm: faparser.film, 
    search: faparser.search
}