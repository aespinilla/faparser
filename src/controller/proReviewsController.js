const proReviewsParser = require('../parser/proReviewsParser');
const requestfa = require('../requestfa');
const urlBuilder = require('../urlBuilder/proReviewsUrlBuilder');

const fetchProReviews = async (data) => {
    data.type = 'PRO_REVIEWS';
    const url = urlBuilder.build(data);
    const response = await requestfa.requestSource(url);
    const result = proReviewsParser.parse(response);
    return result;
}

module.exports = { fetchProReviews }