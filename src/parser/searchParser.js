import Config from '../../config/config.json' assert { type: "json" };
import jQuery from 'cheerio';
import { parseNumber } from '../utils.js';

const BASE_URL = Config.BASE_URL;

export const parse = (data) => {
    try {
        const content = jQuery(data.body)
        let year;
        const result = content.find('.se-it').map((_, a) => {
            if (jQuery(a).hasClass('mt')) {
                year = jQuery(a).find('.ye-w').text();
            }

            const filmview = {
                id: parseId(a),
                url: parseUrl(a),
                country: parseCountry(a),
                year: year,
                thumbnail: parseThumbnail(a),
                title: parseTitle(a),
                directors: parsePeople(a, '.mc-director', 'DIRECTOR', data.lang),
                cast: parsePeople(a, '.mc-cast', 'CAST', data.lang),
                rating: getNumber(a, '.avgrat-box'),
                votes: getNumber(a, '.ratcount-box')
            };

            return filmview;
        }).toArray();
        const hasMore = content.find('.see-all-button').length > 0
        return { result, hasMore }
    } catch (error) {
        console.error(error);
        return { result: [], hasMore: false }
    }
}

const parseUrl = (content) => {
    return jQuery(content).find('.mc-title').find('a').attr('href');
}

const parseId = (content) => {
    const url = parseUrl(content);
    const idMatch = url.match(/.*\/film(\d*)/);
    return idMatch !== null ? idMatch[1] : "";
}

const parseTitle = (content) => {
    return jQuery(content).find('.mc-title').find('a').attr('title').trim();
}

const parseThumbnail = (content) => {
    const thumbnail = jQuery(content).find('.mc-poster').find('img').attr('src');
    return thumbnail.includes('noimgfull') ? `${BASE_URL}${thumbnail}` : thumbnail;
}

const parseCountry = (content) => {
    const container = jQuery(content).find('.mc-title').find('img');
    const source = container.attr('src');
    const name = container.attr('alt');
    return {
        imgCountry: `${BASE_URL}${source}`,
        country: name
    }
}

const parsePeople = (element, selector, type, lang) => {
    return jQuery(element).find(selector).find('.credits').find('a').map((_, b) => {
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

const getNumber = (content, selector) => {
    const selection = jQuery(content).find(selector).text();
    return parseNumber(selection);
}