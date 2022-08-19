const url = require('url');
const requestfa = require('../requestfa');

const filmParser = require('../parser/filmParser');
const specialSearchParser = require('../parser/specialSearch');
const searchParser = require('../parser/searchParser');

const search = async (data) => {
    const response = await requestfa.requestSource(data);
    response.lang = data.lang;
    response.type = data.type;

    if (isFilm(data.response.url)) {
        const id = getId(data.response.url);
        const film = filmParser.parse(data);
        const result = mapFilm(id, film);
        return buildOutput([result], false);
    }

    if (data.type === 'TOPIC' || data.type === 'GENRE') {
        const result = specialSearchParser.parse(data);
        return buildOutput(result, false);
    }

    const result = searchParser.parse(response);
    return buildOutput(result.result, result.hasMore);
}

const isFilm = (responseUrl) => {
    const pathname = url.parse(responseUrl).pathname;
    return pathname.includes('film');
}

const getId = (responseUrl) => {
    const pathname = url.parse(responseUrl).pathname;
    return pathname.substring(pathname.indexOf('film') + 'film'.length, pathname.indexOf('.'));
}

const mapFilm = (id, film) => {
    return {
        id: id,
        url: film.url,
        thumbnail: film.coverImages.imageUrlMed.replace("mmed", "msmall"),
        year: film.year,
        title: film.titles.title,
        directors: film.directors,
        cast: film.cast,
        country: film.country,
        rating: film.rating,
        votes: film.votes
    }
}

const buildOutput = (result, hasMore) => {
    return {
        more: hasMore || false,
        count: result.length,
        result: result
    }
}

module.exports = { search }