/**
 * Created by aespinilla on 20/6/17.
 */
const request = require('request')
const Promise = require('promise')

module.exports = {
    FArequest: rPromise
}

const BASE_URL = "http://www.filmaffinity.com"

const searchTypes = {
    TITLE: "title",
    CAST: "cast",
    DIRECTOR: "director",
    GENRE: "/moviegenre.php?genre=",
    TOPIC: "/movietopic.php?topic=",
    IMAGES: "/filmimages.php?movie_id=",
    TRAILERS: "/evideos.php?movie_id=",
    PRO_REVIEWS: "/pro-reviews.php?movie-id=",
}

function rPromise(data) {
    return new Promise(function (resolve, reject) {
        const url = computedUrl(data)
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve({
                    url: url,
                    response: response,
                    type: data.type,
                    isFilm: data.isFilm,
                    lang: data.lang,
                    body: body
                })
            } else {
                reject({
                    code: response.statusCode,
                    url: url,
                    error: response.error
                })
            }
        })
    })
}

function computedUrl(data) {
    if (data.isFilm == true) {
        return BASE_URL + '/' + data.lang + '/film' + data.id + '.html'
    }
    const lang = data.lang ? data.lang : 'es'
    const type = data.type && (searchTypes.hasOwnProperty(data.type)) ? data.type : searchTypes.TITLE
    const query = data.query
    const start = data.start ? data.start : 0
    const orderBy = (typeof data.orderByYear === 'undefined' || (data.orderByYear !== 'undefined' && data.orderByYear === true)) ? '&orderby=year' : ''
    let computedUrl = BASE_URL + '/' + lang
    if (type === 'CAST' || type === 'DIRECTOR') {
        computedUrl = computedUrl + '/search.php?stype=' + searchTypes[type] + '&sn'
        computedUrl = computedUrl + '&stext=' + encodeURIComponent(query) + '&from=' + start + orderBy
    } else if (type === 'GENRE' || type === 'TOPIC') {
        computedUrl = computedUrl + searchTypes[type] + query + '&attr=rat_count&nodoc'
    } else if (type === 'IMAGES' || type === 'TRAILERS' || type === 'PRO_REVIEWS') {
        computedUrl = computedUrl + searchTypes[type] + data.id
    } else {
        computedUrl = computedUrl + '/search.php?stype=' + searchTypes[type]
        computedUrl = computedUrl + '&stext=' + encodeURIComponent(query) + '&from=' + start + orderBy
    }
    console.info('[' + new Date() + '] faparser: ' + 'Generated URL: ' + computedUrl)
    return computedUrl.toLowerCase()
}