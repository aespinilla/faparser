const parser = require('./parser');
const requestfa = require('./requestfa');

const filmController = require('./controller/filmController');
const searchController = require('./controller/searchController');

const optionsFilm = {
    lang: 'es', // es, en
    extra: [] // trailers, images, reviews
}

const optionsSearch = {
    lang: 'es', // es, en
    type: 'TITLE', //'TITLE', 'GENRE', 'TOPIC', 'DIRECTOR', 'CAST'
    start: 0, // start page
}

const search = async (data) => {
    data.isFilm = false
    data.type = data.type || 'TITLE'
    const result = await searchController.search(data);
    return result;
}

const film = async (data) => {
    let result = await Promise.all([
        fetchFilm(data),
        fetchImages(data),
        fetchTrailers(data),
        fetchProReviews(data)
    ])
    const [film, images, trailers, reviews] = result
    film.images = images
    film.trailers = trailers
    film.proReviews = reviews
    return film
}

const fetchFilm = async (data) => {
    const filmData = { ...data }
    filmData.isFilm = true
    const result = await filmController.fetchFilm(data);
    return result;
}

const fetchTrailers = async (data) => {
    const trailers = { ...data }
    trailers.isFilm = false
    trailers.type = 'TRAILERS'
    let result = await requestfa.requestSource(trailers)
    return parser.parseTrailers(result)
}

const fetchImages = async (data) => {
    const images = { ...data }
    images.isFilm = false
    images.type = 'IMAGES'
    let result = await requestfa.requestSource(images)
    return parser.parseImages(result)
}

const fetchProReviews = async (data) => {
    const reviews = { ...data }
    reviews.isFilm = false
    reviews.type = 'PRO_REVIEWS'
    let result = await requestfa.requestSource(reviews)
    return parser.parseProReviews(result)
}

module.exports = {
    film: film,
    search: search,
    types: {
        TITLE: 'TITLE',
        GENRE: 'GENRE',
        TOPIC: 'TOPIC',
        DIRECTOR: 'DIRECTOR',
        CAST: 'CAST'
    }
}