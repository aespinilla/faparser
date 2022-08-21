const Config = require('../../config/config.json');

const build = (data) => {
    return `${Config.BASE_URL}/${data.lang || 'es'}${Config.paths.TRAILERS}${data.id}`;
}

module.exports = { build }