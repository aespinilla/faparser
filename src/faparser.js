const parser = require('./parser')
const requestfa = require('./requestfa')

const search = async (data) => {
    data.isFilm = false
    data.type = data.type || 'TITLE'
    let res = await requestfa.FArequest(data)
    res.lang = data.lang
    res.type = data.type
    return parser.parseSearch(res)
}

const film = async (data) => {
    // data.isFilm = true
    // const f = data
    // const trailers = { ...data }
    // trailers.isFilm = false
    // trailers.type = 'TRAILERS'
    // const i = { ...data }
    // i.isFilm = false
    // i.type = 'IMAGES'
    // const r = { ...data }
    // r.isFilm = false
    // r.type = 'PRO_REVIEWS'
    // let result = await Promise.all([
    //     requestfa.requestSource(f), 
    //     requestfa.requestSource(i), 
    //     requestfa.requestSource(trailers), 
    //     requestfa.requestSource(r)
    // ])
    // const film = parser.parseFilm(result[0])
    // film.id = data.id
    // film.images = parser.parseImages(result[1])
    // film.trailers = parser.parseTrailers(result[2])
    // film.proReviews = parser.parseProReviews(result[3])
    // return film

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
    const result = await requestfa.requestSource(filmData)
    const film = parser.parseFilm(result)
    film.id = data.id
    return film
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