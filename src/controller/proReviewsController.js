const proReviewsParser = require('../parser/proReviewsParser');
const requestfa = require('../requestfa');

const fetchProReviews = async (data) => {
    data.type = 'PRO_REVIEWS'
    const response = await requestfa.requestSource(reviews);
    const result = proReviewsParser.parse(response);
    return result;
}

module.exports = { fetchProReviews }