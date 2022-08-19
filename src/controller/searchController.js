const parser = require('../parser');
const requestfa = require('../requestfa');

const search = async (data) => {
    const response = await requestfa.requestSource(data);
    response.lang = data.lang;
    response.type = data.type;
    const searchResult = parser.parseSearch(response);
    return searchResult;
}

module.exports = { search }