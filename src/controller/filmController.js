const filmParser = require('../parser/filmParser');
const requestfa = require('../request/request');
const urlBuilder = require('../urlBuilder/filmUrlBuilder');

const fetchFilm = async (data) => {
    const url = urlBuilder.build(data);
    const result = await requestfa.requestSource(url);
    result.lang = data.lang;
    const film = filmParser.parse(result);
    return { id: `${data.id}`, ...film }
}

module.exports = { fetchFilm }