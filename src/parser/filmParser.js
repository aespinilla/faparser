const jQuery = require('cheerio');
const url = require('url');
const utils = require('../utils');

const BASE_URL = require('../../config/config.json').BASE_URL;

const parse = (data) => {
    try {
        const content = jQuery(data.body)
        const titles = {
            title: parseTitle(content),
        }
        const film = {
            url: data.url,
            coverImages: parseCoverImages(content),
            rating: parseRating(content),
            votes: parseVotes(content),
            streamingPlatforms: parseStreamingPlatforms(content),
            ...parseMovieInfo(content, titles, data.lang)
        }
        return film;
    } catch (error) {
        console.error(error);
        return {}
    }
}

const parseCoverImages = (content) => {
    try {
        const imagesContainer = content.find('#movie-main-image-container');
        const imageUrl = imagesContainer.find('a').attr('href');
        let imageUrlMed = imagesContainer.find('img').attr('src');
        if (imageUrlMed.includes('noimgfull')) {
            imageUrlMed = `${BASE_URL}${imageUrlMed}`
        }
        return { imageUrl, imageUrlMed }
    } catch (error) {
        console.error(error)
        return null
    }
}

const parseTitle = (content) => {
    try {
        const title = content.find('#main-title').find('span').text();
        return title.trim();
    } catch (error) {
        console.error(error);
        return '';
    }
}

const parseTitles = (element, content) => {
    try {
        let original = jQuery(element).next().text().trim()
        const akas = content.find('dd.akas li').map((_, akatitle) => {
            const ak = jQuery(akatitle).text();
            return ak;
        }).toArray();

        if (akas.length > 0) {
            original = original.substring(0, original.length - 3).trim();
            return { akas, original }
        }
        return { original }
    } catch (error) {
        console.error(error);
        return {};
    }
}

const parseCountry = (content) => {
    try {
        const countryContainer = jQuery(content).next().find('img');
        const countryPath = countryContainer.attr('src')
        return {
            imgCountry: `${BASE_URL}${countryPath}`,
            country: countryContainer.attr('alt'),
        }
    } catch (error) {
        console.error(error)
        return null;
    }
}

const parseRating = (content) => {
    try {
        const rating = content.find('#movie-rat-avg').attr('content');
        return utils.parseNumber(rating)
    } catch (error) {
        console.error(error)
        return null
    }
}

const parseVotes = (content) => {
    try {
        const votes = content.find('#movie-count-rat').find('span').attr('content');
        return utils.parseNumber(votes)
    } catch (error) {
        console.error(error)
        return null
    }
}

const parseYear = (content) => {
    try {
        const year = jQuery(content).next().text();
        return year.trim();
    } catch (error) {
        console.log(error)
        return ''
    }
}

const parseProduction = (content) => {
    const productions = [];
    jQuery(content).next().find('span.nb').each((_, item) => {
        const container = jQuery(item);
        const name = jQuery(item).text().trim().replace(',', '');
        productions.push(name);
        if (container.next().is('i')) {
            return false;
        }
    });
    return productions;
}

const parseRunning = (content) => {
    let text = jQuery(content).next().text().trim();
    text = text.replace('min.', '').trim();
    return utils.parseNumber(text);
}

const parseSypnosis = (content) => {
    try {
        const synopsis = jQuery(content).next().text();
        return synopsis.trim();
    } catch (error) {
        console.log(error)
        return ''
    }
}

const parsePeople = (content, type, lang) => {
    return jQuery(content).next().find('a').find('span').map((_, item) => {
        const name = jQuery(item).text().trim();
        return {
            name: name,
            request: {
                query: name,
                type: type,
                lang: lang
            }
        }
    }).toArray()
}

const parseStaff = (content) => {
    return jQuery(content).next().find('.nb span').map((_, item) => {
        return jQuery(item).text().trim();
    }).toArray()
}

const parseGenres = (content, lang) => {
    return jQuery(content).next().find('a').map((_, item) => {
        const linkContent = jQuery(item)
        const link = linkContent.attr('href')
        const name = linkContent.text().trim()
        const query = url.parse(link, true).query.genre || url.parse(link, true).query.topic
        return {
            name: name,
            request: {
                query: query,
                type: link.includes('moviegenre.php') ? 'GENRE' : (link.includes('movietopic.php') ? 'TOPIC' : 'TITLE'),
                lang: lang
            }
        }
    }).toArray();
}

const parseStreamingPlatforms = (content) => {
    const streamingPlatforms = {
        subscription: [],
        buy: [],
        rent: []
    }

    content.find('#stream-wrapper > .body > .sub-title').each(function (_, streamingTitle) {
        let providers
        const streamingType = jQuery(streamingTitle).text().trim().toLowerCase()
        switch (streamingType) {
            case 'suscripción': providers = streamingPlatforms.subscription; break;
            case 'compra': providers = streamingPlatforms.buy; break;
            case 'alquiler': providers = streamingPlatforms.rent; break;
            default:
                console.warn('Streaming type not controlled: ', streamingType);
                return;
        }

        jQuery(streamingTitle).next().find('a').each((_, providerNode) => {
            const url = jQuery(providerNode).attr('href');
            const provider = jQuery(providerNode).find('img').attr('alt').trim();
            providers.push({ url, provider });
        })
    });

    return streamingPlatforms
}

const parseMovieInfo = (content, titles, lang) => {
    const info = {
        titles: titles
    }
    content.find('.movie-info dt').each((_, a) => {
        const bind = jQuery(a).text().trim().toLowerCase();
        switch (bind) {
            case "original title":
            case "título original": {
                info.titles = { ...info.titles, ...parseTitles(a, content) }
                break
            }
            case "year":
            case "año": {
                info.year = parseYear(a);
                break
            }
            case "running time":
            case "duración": {
                info.running = parseRunning(a);
                break
            }
            case "country":
            case "país": {
                info.country = parseCountry(a);
                break
            }
            case "director":
            case "dirección": {
                info.directors = parsePeople(a, 'DIRECTOR', lang)
                break
            }
            case "screenwriter":
            case "guion":
            case "guión": {
                info.screenwriter = parseStaff(a);
                break
            }
            case "music":
            case "música": {
                info.music = parseStaff(a);
                break
            }
            case "cinematography":
            case "fotografía": {
                info.cinematography = parseStaff(a);
                break
            }
            case "cast":
            case "reparto": {
                info.cast = parsePeople(a, 'CAST', lang)
                break
            }
            case "producer":
            case "productora": {
                info.production = parseProduction(a);
                break
            }
            case "genre":
            case "género": {
                info.genre = parseGenres(a, lang);
                break
            }
            case "synopsis / plot":
            case "sinopsis": {
                info.synopsis = parseSypnosis(a);
                break
            }
            default: {
                break
            }
        }
    })
    return info;
}

module.exports = { parse }