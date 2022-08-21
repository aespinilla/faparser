const jQuery = require('cheerio');
const utils = require('../utils');

const BASE_URL = require('../../config/config.json').BASE_URL;

const parse = (data) => {
    try {
        const content = jQuery(data.body).find('.title-movies');
        return content.find('.record').map((_, element) => {
            const elHtml = jQuery(element)
            const titleHtml = elHtml.find('.mc-title')
            return {
                id: parseId(elHtml),
                title: parseTitle(titleHtml),
                thumbnail: parseThumbnail(elHtml),
                url: parseUrl(elHtml),
                country: parseCountry(titleHtml),
                year: parseYear(titleHtml),
                rating: parseNumberValue(elHtml, '.avg-w'),
                votes: parseNumberValue(elHtml, '.votes2'),
                directors: parsePeople(elHtml, '.mc-director', 'DIRECTOR', data.lang),
                cast: parsePeople(elHtml, '.mc-cast', 'CAST', data.lang)
            }
        }).toArray();
    } catch (error) {
        console.error(error);
        return [];
    }
}

const parseId = (content) => {
    return content.find('.movie-card').attr('data-movie-id');
}

const parseThumbnail = (content) => {
    return content.find('.mc-poster img').attr('src');
}

const parseTitle = (content) => {
    return content.find('a').attr('title').trim();
}

const parseUrl = (content) => {
    const href = content.find('a').attr('href');
    return href;
}

const parseNumberValue = (content, selector) => {
    const value = content.find(selector).text().trim();
    return utils.parseNumber(value);
}

const parseCountry = (content) => {
    const countryContainer = content.find('img');
    const imgSource = countryContainer.attr('src');
    const countryName = countryContainer.attr('alt')
    return {
        imgCountry: `${BASE_URL}${imgSource}`,
        country: countryName
    }
}

const parseYear = (content) => {
    const title = parseTitle(content);
    return content.text().substring(title.length + 2).replace(")", "").trim();
}

const parsePeople = (content, selector, type, lang) => {
    return content.find(`${selector} .credits a`).map((_, item) => {
        const name = jQuery(item).attr('title');
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

module.exports = { parse }