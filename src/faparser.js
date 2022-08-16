const parser = require('./parser')
const requestfa = require('./requestfa')

async function search(data) {
    data.isFilm = false
    data.type = data.type || 'TITLE'
    let res = await requestfa.FArequest(data)
    res.lang = data.lang
    res.type = data.type
    return parser.parseSearch(res)
}

async function preview(data) {
    data.isFilm = true
    let result = await requestfa.FArequest(data)
    const film = parser.parseFilm(result)
    const filmResult = {
        id: data.id,
        url: film.url,
        thumbnail: film.imageUrlMed.replace("mmed", "msmall"),
        year: film.year,
        title: film.title,
        directors: film.directors,
        cast: film.cast,
        country: film.country,
        rating: film.rating ? film.rating.replace(',', '.') : 0,
        votes: film.votes
    }
    return filmResult
}

const film = async (data) => {
    data.isFilm = true
    let film = await filmTaskPromise(data)
    return film
}

async function filmTaskPromise(data) {
    const f = data
    const t = clone(data)
    t.isFilm = false
    t.type = 'TRAILERS'
    const i = clone(data)
    i.isFilm = false
    i.type = 'IMAGES'
    const r = clone(data)
    r.isFilm = false
    r.type = 'PRO_REVIEWS'
    let result = await Promise.all([requestfa.requestSource(f), requestfa.requestSource(i), requestfa.requestSource(t), requestfa.requestSource(r)])
    const film = parser.parseFilm(result[0])
    film.id = data.id
    film.images = parser.parseImages(result[1])
    film.trailers = parser.parseTrailers(result[2])
    film.proReviews = parser.parseProReviews(result[3])
    return film
}

function clone(o) {
    return JSON.parse(JSON.stringify(o))
}

module.exports = {
    film: film,
    preview: preview,
    search: search,
    types: {
        TITLE: 'TITLE',
        GENRE: 'GENRE',
        TOPIC: 'TOPIC',
        DIRECTOR: 'DIRECTOR',
        CAST: 'CAST'
    }
}