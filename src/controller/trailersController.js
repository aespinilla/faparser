const trailersParser = require('../parser/trailersParser');
const requestfa = require('../requestfa');

const fetchTrailers = async (data) => {
    data.type = 'TRAILERS'
    const response = await requestfa.requestSource(trailers)
    const result = trailersParser.parse(result);
    return result;
}

module.exports = { fetchTrailers }