const fetch = require('node-fetch')
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

const requestSource = async (data) => {
    const url = buildURL(data)
    const response = await fetch(url);
    const result = await response.text();
    return {
        url: url,
        response: response,
        type: data.type,
        isFilm: data.isFilm,
        lang: data.lang,
        body: result
    }
}

function buildURL(data) {
    if (data.isFilm == true) {
        return BASE_URL + '/' + data.lang + '/film' + data.id + '.html'
    }
    const lang = data.lang || 'es'
    const type = data.type && (searchTypes.hasOwnProperty(data.type)) ? data.type : searchTypes.TITLE
    const query = data.query
    const start = data.start || 0
    const orderBy = (typeof data.orderByYear === 'undefined' || (data.orderByYear !== 'undefined' && data.orderByYear === true)) ? '&orderby=year' : ''
    let computedUrl = BASE_URL + '/' + lang

    // TODO: Add switch
    switch (type) {
        case 'CAST':
        case 'DIRECTOR': {
            computedUrl = computedUrl + '/search.php?stype=' + searchTypes[type] + '&sn' + '&stext=' + encodeURIComponent(query) + '&from=' + start + orderBy
        }
        case 'GENRE':
        case 'TOPIC': {
            computedUrl = computedUrl + searchTypes[type] + query + '&attr=rat_count&nodoc'
        }
        case 'IMAGES':
        case 'TRAILERS':
        case 'PRO_REVIEWS': {
            computedUrl = computedUrl + searchTypes[type] + data.id
        }
        default: {
            computedUrl = computedUrl + '/search.php?stype=' + searchTypes[type] + '&stext=' + encodeURIComponent(query) + '&from=' + start + orderBy
        }
    }
    // if (type === 'CAST' || type === 'DIRECTOR') {
    //     computedUrl = computedUrl + '/search.php?stype=' + searchTypes[type] + '&sn'
    //     computedUrl = computedUrl + '&stext=' + encodeURIComponent(query) + '&from=' + start + orderBy
    // } else if (type === 'GENRE' || type === 'TOPIC') {
    //     computedUrl = computedUrl + searchTypes[type] + query + '&attr=rat_count&nodoc'
    // } else if (type === 'IMAGES' || type === 'TRAILERS' || type === 'PRO_REVIEWS') {
    //     computedUrl = computedUrl + searchTypes[type] + data.id
    // } else {
    //     computedUrl = computedUrl + '/search.php?stype=' + searchTypes[type]
    //     computedUrl = computedUrl + '&stext=' + encodeURIComponent(query) + '&from=' + start + orderBy
    // }
    return computedUrl.toLowerCase()
}

module.exports = { requestSource: requestSource }