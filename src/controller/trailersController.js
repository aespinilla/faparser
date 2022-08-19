const trailersParser = require('../parser/trailersParser');
const requestfa = require('../requestfa');

const fetchTrailers = async (data) => {
    data.type = 'TRAILERS'
    const response = await requestfa.requestSource(data);
    const result = trailersParser.parse(response);
    return result;
}

module.exports = { fetchTrailers }