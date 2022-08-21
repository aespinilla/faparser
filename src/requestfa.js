const fetch = require('node-fetch');
const Config = require('../config/config.json');
const BASE_URL = Config.BASE_URL


const requestSource = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw { code: response.status, message: response.statusText, url: url }
    }
    const result = await response.text();
    return {
        url: url,
        response: response,
        // type: data.type,
        // isFilm: data.isFilm,
        // lang: data.lang,
        body: result
    }
}

module.exports = { requestSource }