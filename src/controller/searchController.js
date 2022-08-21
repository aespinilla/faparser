const url = require('url');

const searchUrlBuilder = require('../urlBuilder/searchUrlBuilder');
const genreUrlBuilder = require('../urlBuilder/genreUrlBuilder');
const topicUrlBuilder = require('../urlBuilder/topicUrlBuilder');

const requestfa = require('../requestfa');

const filmParser = require('../parser/filmParser');
const specialSearchParser = require('../parser/specialSearch');
const searchParser = require('../parser/searchParser');

const search = async (data) => {
    if (data.type === 'TOPIC') {
        const result = await getTopics(data);
        result.lang = data.lang;
        return buildOutput(result, false);
    }

    if (data.type === 'GENRE') {
        const result = await getGenres(data);
        result.lang = data.lang;
        return buildOutput(result, false);
    }

    const url = searchUrlBuilder.build(data);
    const response = await requestfa.requestSource(url);
    response.lang = data.lang;

    if (isFilm(response.response.url)) {
        const id = getId(response.response.url);
        const film = filmParser.parse(response);
        const result = mapFilm(id, film);
        return buildOutput([result], false);
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

const getTopics = async (data) => {
    const url = topicUrlBuilder.build(data);
    return await getSpecialSearch(url);
}

const getGenres = async (data) => {
    const url = genreUrlBuilder.build(data);
    return await getSpecialSearch(url);
}

const getSpecialSearch = async (url) => {
    const response = await requestfa.requestSource(url);
    const result = specialSearchParser.parse(response);
    return result;
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