const trailersParser = require('../parser/trailersParser');
const requestfa = require('../requestfa');
const urlBuilder = require('../urlBuilder/trailersUrlBuilder');

const fetchTrailers = async (data) => {
    data.type = 'TRAILERS';
    const url = urlBuilder.build(data);
    const response = await requestfa.requestSource(url);
    const result = trailersParser.parse(response);
    return result;
}

module.exports = { fetchTrailers }