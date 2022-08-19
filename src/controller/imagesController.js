const imagesParser = require('../parser/imagesParser');
const requestfa = require('../requestfa');

const fetchImages = async (data) => {
    data.type = 'IMAGES'
    const response = await requestfa.requestSource(data);
    const result = imagesParser.parse(response);
    return result;
}

module.exports = { fetchImages }