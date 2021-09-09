/**
 * Created by aespinilla on 20/6/17.
 */
const bent = require('bent')

module.exports = {
    FArequest: requestServer
}

const BASE_URL = "https://www.filmaffinity.com"

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

async function requestServer(data) {
    const url = computedUrl(data)
    const get = bent(url)
    try {
        let getResult = await get()
        const body = await getResult.text()
        return {
            url: url,
            type: data.type,
            isFilm: data.isFilm,
            lang: data.lang,
            body: body
        }
    } catch (error) {
        throw {
            code: error.statusCode,
            url: url,
            error: error.message
        }
    }
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
    //console.info('[' + new Date() + '] faparser: ' + 'Generated URL: ' + computedUrl)
    return computedUrl.toLowerCase()
}