const imagesParser = require('../parser/imagesParser');
const requestfa = require('../requestfa');

const fetchImages = async (data) => {
    images.type = 'IMAGES'
    const response = await requestfa.requestSource(images);
    const result = imagesParser.parseImages(response);
    return result;
}

module.exports = { fetchImages }