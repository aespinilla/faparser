const imagesParser = require('../parser/imagesParser');
const requestfa = require('../request/request');
const urlBuilder = require('../urlBuilder/imagesUrlBuilder');

const fetchImages = async (data) => {
    data.type = 'IMAGES'
    const url = urlBuilder.build(data);
    const response = await requestfa.requestSource(url);
    const result = imagesParser.parse(response);
    return result;
}

module.exports = { fetchImages }