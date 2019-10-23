const parser = require('./parser')
const requestfa = require('./requestfa')
const Promise = require('promise')

module.exports = {
    film: film,
    preview: preview,
    search: search,
    TITLE: 'TITLE',
    GENRE: 'GENRE',
    TOPIC: 'TOPIC',
    DIRECTOR: 'DIRECTOR',
    CAST: 'CAST'
}

function search(data) {
    return new Promise(function (resolve, reject) {
        const now = new Date()
        data.isFilm = false
        requestfa.FArequest(data).then(function (res) {
            res.lang = data.lang
            res.type = data.type
            const result = parser.parseSearch(res)
            log(now, data, result.result)
            return resolve(result)
        }).catch(function (error) {
            log(now, data, {error: error})
            return reject({
                code: error.code,
                error: error.error
            })
        })
    })
}

function preview(data) {
    return new Promise(function (resolve, reject) {
        const now = new Date()
        data.isFilm = true
        requestfa.FArequest(data).then(function (result) {
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
            log(now, data, film)
            return resolve(filmResult)
        }).catch(function (error) {
            log(now, data, {error: error})
            return reject({
                code: error.code,
                error: error.error
            })
        })
    })
}

function film(data) {
    return new Promise(function (resolve, reject) {
        const now = new Date()
        data.isFilm = true
        filmTaskPromise(data).then(function (film) {
            log(now, data, film)
            return resolve(film)
        }).catch(function (error) {
            log(now, data, {error: error})
            return reject({
                code: error.code,
                error: error.error
            })
        })
    })
}

function filmTaskPromise(data) {
    return new Promise(function (resolve, reject) {
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

        Promise.all([requestfa.FArequest(f), requestfa.FArequest(i), requestfa.FArequest(t), requestfa.FArequest(r)])
            .then(function (result) {
                const film = parser.parseFilm(result[0])
                film.id = data.id
                film.images = parser.parseImages(result[1])
                film.trailers = parser.parseTrailers(result[2])
                film.proReviews = parser.parseProReviews(result[3])
                return resolve(film)
            }).catch(function (error) {
            return reject(error)
        })
    })
}

function clone(o) {
    return JSON.parse(JSON.stringify(o))
}

function log(now, data, response) {
    const diff = new Date().getTime() - now.getTime()
    console.log('Process time: ' + diff + 'ms for request data: ' + JSON.stringify(data) + ' with response: ' + JSON.stringify(response))
}