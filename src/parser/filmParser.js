const jQuery = require('cheerio')
const url = require('url')
const utils = require('../utils')

const BASE_URL = "https://www.filmaffinity.com"

const parseFilm = (data) => {
    try {
        const content = jQuery(data.body)
        const film = {
            title: parseTitle(content),
            url: data.url,
            coverImages: parseCoverImages(content),
            rating: parseRating(content),
            votes: parseVotes(content)
        }
        content.find('.movie-info dt').each((index, a) => {
            const bind = jQuery(a).text().trim().toLowerCase();
            switch (bind) {
                case "original title":
                case "título original": {
                    const element = jQuery(a)
                    const tO = element.next().text().trim()
                    film.titleOrig = tO
                    const akas = []
                    content.find('dd.akas li').each(function (index, akatitle) {
                        const ak = jQuery(akatitle).text()
                        akas.push(ak)
                    })
                    if (akas.length != 0) {
                        film.akas = akas
                        film.titleOrig = tO.substring(0, tO.length - 3).trim()
                    }
                    break
                }
                case "year":
                case "año": {
                    film.year = parseYear(a);
                    break
                }
                case "running time":
                case "duración": {
                    film.running = jQuery(a).next().text().trim()
                    break
                }
                case "country":
                case "país": {
                    film.country = parseCountry(a);
                    break
                }
                case "director":
                case "dirección": {
                    film.directors = parsePeople(a, 'DIRECTOR', data.lang)
                    break
                }
                case "screenwriter":
                case "guion":
                case "guión": {
                    // film.screenwriter = []
                    // jQuery(a).next().find('.nb span').each(function (index2, guion) {
                    //     film.screenwriter.push(jQuery(guion).text().trim())
                    // })
                    film.screenwriter = parseStaff(a);
                    break
                }
                case "music":
                case "música": {
                    // film.music = [];
                    // jQuery(a).next().find('.nb span').each(function (index3, music) {
                    //     film.music.push(jQuery(music).text().trim())
                    // })
                    film.music = parseStaff(a);
                    break
                }
                case "cinematography":
                case "fotografía": {
                    // film.cinematography = [];
                    // jQuery(a).next().find('.nb span').each(function (index3, foto) {
                    //     film.cinematography.push(jQuery(foto).text().trim())
                    // })
                    film.cinematography = parseStaff(a);
                    break
                }
                case "cast":
                case "reparto": {
                    film.cast = parsePeople(a, 'CAST', data.lang)
                    break
                }
                case "producer":
                case "productora": {
                    film.production = jQuery(a).next().find('.nb span').text().trim()
                    break
                }
                case "genre":
                case "género": {
                    film.genre = []
                    jQuery(a).next().find('a').each(function (index3, genero) {
                        const link = jQuery(genero).attr('href')
                        const g = jQuery(genero).text().trim()
                        let gnr = url.parse(link, true).query.genre
                        if (!gnr) {
                            gnr = url.parse(link, true).query.topic
                        }
                        film.genre.push({
                            name: g,
                            request: {
                                query: gnr,
                                type: link.includes('moviegenre.php') ? 'GENRE' : (link.includes('movietopic.php') ? 'TOPIC' : 'TITLE'),
                                lang: data.lang
                            }
                        })
                    })
                    break
                }
                case "synopsis / plot":
                case "sinopsis": {
                    film.synopsis = parseSypnosis(a);
                    break
                }
                default: {
                    break
                }
            }
        })

        // TODO: Refactor and handle languages.
        film.streamingPlatforms = {
            subscription: [],
            buy: [],
            rent: []
        }
        content.find('#stream-wrapper > .body > .sub-title').each(function (_, streamingTitle) {

            let providers
            const streamingType = jQuery(streamingTitle).text().trim().toLowerCase()
            switch (streamingType) {
                case 'suscripción': providers = film.streamingPlatforms.subscription; break;
                case 'compra': providers = film.streamingPlatforms.buy; break;
                case 'alquiler': providers = film.streamingPlatforms.rent; break;
                default:
                    console.warn('Streaming type not controlled: ', streamingType);
                    return;
            }

            jQuery(streamingTitle).next().find('a').each(function (_, providerNode) {
                const url = jQuery(providerNode).attr('href')
                const provider = jQuery(providerNode).find('img').attr('alt').trim()
                providers.push({ url, provider })
            })

        });

        // End of TODO

        return film;
    } catch (err) {
        console.error(err)
        //throw ({code: 4, msg: 'Can not parse film'})
    }
    return {}
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
        console.error(error)
        return ''
    }
}

const parseTitles = (content) => {
    // TODO: Implements
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
    try {
        return jQuery(content).next().find('.nb span').map((_, item) => {
            return jQuery(item).text().trim();
        }).toArray() 
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { parse: parseFilm }