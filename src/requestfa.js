const fetch = require('node-fetch');

const requestSource = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw { code: response.status, message: response.statusText, url: url }
    }
    const result = await response.text();
    return {
        url: url,
        response: response,
        body: result
    }
}

module.exports = { requestSource }