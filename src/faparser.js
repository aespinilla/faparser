const filmController = require('./controller/filmController');
const searchController = require('./controller/searchController');
const trailersController = require('./controller/trailersController');
const imagesController = require('./controller/imagesController');
const proReviewsController = require('./controller/proReviewsController');

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
    const search = { ...data }
    search.isFilm = false
    search.type = data.type || 'TITLE'
    const result = await searchController.search(search);
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
    const result = await trailersController.fetchTrailers(trailers);
    return result;
}

const fetchImages = async (data) => {
    const images = { ...data }
    images.isFilm = false
    const result = await imagesController.fetchTrailers(images);
    return result;
}

const fetchProReviews = async (data) => {
    const reviews = { ...data }
    reviews.isFilm = false
    const result = await proReviewsController.fetchTrailers(reviews);
    return result;
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