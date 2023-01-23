import { 
    filmController, 
    searchController, 
    trailersController, 
    imagesController, 
    proReviewsController 
} from './controller/index.js';

const optionsFilm = {
    lang: 'es', // es, en
    extra: [] // trailers, images, reviews
}

const optionsSearch = {
    lang: 'es', // es, en
    type: 'TITLE', //'TITLE', 'GENRE', 'TOPIC', 'DIRECTOR', 'CAST'
    start: 0, // start page
}

export const types = {
    TITLE: 'TITLE',
    GENRE: 'GENRE',
    TOPIC: 'TOPIC',
    DIRECTOR: 'DIRECTOR',
    CAST: 'CAST'
}

export const search = async (data) => {
    const search = { ...data }
    search.type = data.type || 'TITLE'
    const result = await searchController(search);
    return result;
}

export const film = async (data) => {
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
    const result = await filmController(data);
    return result;
}

const fetchTrailers = async (data) => {
    const trailers = { ...data }
    const result = await trailersController(trailers);
    return result;
}

const fetchImages = async (data) => {
    const images = { ...data }
    const result = await imagesController(images);
    return result;
}

const fetchProReviews = async (data) => {
    const reviews = { ...data }
    const result = await proReviewsController(reviews);
    return result;
}