/**
 * Created by aespinilla on 8/3/17.
 */
const jQuery = require('cheerio')
const url = require('url')
const utils = require('./utils')
const filmParser = require('./parser/filmParser')

const BASE_URL = "https://www.filmaffinity.com"

const parseSearch = (data) => {
    const pathname = url.parse(data.response.url).pathname;
    if (pathname.includes('film')) {
        const idTemp = pathname.substring(pathname.indexOf('film') + 'film'.length, pathname.indexOf('.'));
        const film = filmParser.parse(data);
        return {
            more: false,
            count: 1,
            result: [{
                id: idTemp,
                url: film.url,
                thumbnail: film.coverImages.imageUrlMed.replace("mmed", "msmall"),
                year: film.year,
                title: film.titles.title,
                directors: film.directors,
                cast: film.cast,
                country: film.country,
                rating: film.rating,
                votes: film.votes
            }]
        }
    }

    if (data.type === 'TOPIC' || data.type === 'GENRE') {
        const sfilms = parseSpecialSearch({ container: jQuery(data.body).find('.title-movies'), lang: data.lang })
        return {
            more: false,
            count: sfilms.length,
            result: sfilms
        }
    }

    try {
        const outPut = {}
        const films = []
        const content = jQuery(data.body)
        let year;
        content.find('.se-it').each(function (index, a) {
            const filmview = {};
            const relUrl = jQuery(a).find('.mc-title').find('a').attr('href');
            const idMatch = relUrl.match(/.*\/film(\d*)/);
            filmview.id = idMatch !== null ? idMatch[1] : "";
            filmview.url = relUrl;
            filmview.country = {
                imgCountry: BASE_URL + jQuery(a).find('.mc-title').find('img').attr('src'),
                country: jQuery(a).find('.mc-title').find('img').attr('alt')
            }
            if (jQuery(a).hasClass('mt')) {
                year = jQuery(a).find('.ye-w').text();
            }
            filmview.year = year;
            let thumbnail = jQuery(a).find('.mc-poster').find('img').attr('src');
            if (thumbnail.includes('noimgfull')) {
                thumbnail = `${BASE_URL}${thumbnail}`
            }
            filmview.thumbnail = thumbnail
            filmview.title = jQuery(a).find('.mc-title').find('a').attr('title').trim();
            filmview.directors = parsePeople(a, '.mc-director', 'DIRECTOR', data.lang);
            filmview.cast = parsePeople(a, '.mc-cast', 'CAST', data.lang);
            let rating = jQuery(a).find('.avgrat-box').text()
            let votes = jQuery(a).find('.ratcount-box').text()
            filmview.rating = utils.parseNumber(rating)
            filmview.votes = utils.parseNumber(votes)
            films.push(filmview);
        })
        outPut.more = content.find('.see-all-button').length > 0
        outPut.count = films.length
        outPut.result = films
        return outPut
    } catch (err) {
        console.error(err)
    }
    return []
}

const parsePeople = (element, selector, type, lang) => {
    return jQuery(element).find(selector).find('.credits').find('a').map(function (_, b) {
        const name = jQuery(b).attr('title');
        return {
            name: name,
            request: {
                query: name,
                type: type,
                lang: lang
            }
        }
    }).toArray();
}

const parseTrailers = (data) => {
    const trailers = []
    try {
        const content = jQuery(data.body)
        content.find('iframe').each(function (index, data) {
            const urlt = jQuery(data).attr('src')
            trailers.push(urlt);
        })
        return trailers
    } catch (err) {
        console.error(err)
        return trailers
    }
}

const parseImages = (data) => {
    const items = []
    jQuery(data.body).find('#main-image-wrapper').find('a').each(function (index, item) {
        const href = jQuery(item).attr('href')
        if (href.indexOf('.jpg') != -1) {
            const item = {
                large: href
            }
            if (href.indexOf('large') != -1) {
                item.thumbnail = href.replace("large", "s200")
            } else {
                item.thumbnail = href
            }
            items.push(item)
        }
    })
    return items
}

const parseProReviews = (data) => {
    const reviews = [];
    try {
        jQuery(data.body).find('.wrap>table>tbody>tr').each(function (index, element) {
            const elHtml = jQuery(element)
            const review = {};
            const contryHtml = elHtml.find('.c>img')
            review.country = {
                imgCountry: BASE_URL + contryHtml.attr('src'),
                country: contryHtml.attr('title')
            };
            review.gender = elHtml.find('.gender>span').text().trim();
            const authorHtml = elHtml.find('.author');
            review.author = authorHtml.find('div').text().trim();
            review.source = authorHtml.find('strong').text().trim(); // This is for Filmaffinity review
            review.source = review.source === "" ? authorHtml.find('em').text().trim() : review.source;
            review.text = elHtml.find('.text').text().trim().replace(/"/g, '');
            review.url = elHtml.find('.text>a').attr('href');
            review.bias = elHtml.find('.fas.fa-circle').parent().find('span').text().trim();
            reviews.push(review);
        });
        return reviews;
    } catch (err) {
        console.error(err)
        return reviews;
    }
}

const parseSpecialSearch = (data) => {
    const films = []
    try {
        data.container.find('.record').each(function (index, element) {
            const elHtml = jQuery(element)
            const f = {}
            f.id = elHtml.find('.movie-card').attr('data-movie-id')
            f.thumbnail = elHtml.find('.mc-poster img').attr('src')
            const titleHtml = elHtml.find('.mc-title')
            f.url = BASE_URL + elHtml.find('a').attr('href')
            f.title = titleHtml.find('a').attr('title').trim()
            f.country = {
                imgCountry: BASE_URL + titleHtml.find('img').attr('src'),
                country: titleHtml.find('img').attr('alt')
            }
            f.year = titleHtml.text().substring(f.title.length + 2).replace(")", "").trim()
            f.directors = []
            elHtml.find('.mc-director .credits a').each(function (index, elDir) {
                const item = jQuery(elDir)
                f.directors.push({
                    name: item.attr('title'),
                    request: {
                        query: item.attr('title'),
                        type: 'DIRECTOR',
                        lang: data.lang
                    }
                })
            })
            f.cast = []
            elHtml.find('.mc-cast .credits a').each(function (index, elCast) {
                const item = jQuery(elCast)
                f.cast.push({
                    name: item.attr('title'),
                    request: {
                        query: item.attr('title'),
                        type: 'CAST',
                        lang: data.lang
                    }
                })
            })
            f.rating = elHtml.find('.avg-w').text().trim()
            f.votes = elHtml.find('.votes2').text().trim()
            //console.log(f)
            films.push(f)
        })
        return films
    } catch (err) {
        console.error(err);
        return films;
    }
}

module.exports = {
    parseSearch,
    parseTrailers,
    parseImages,
    parseProReviews
}