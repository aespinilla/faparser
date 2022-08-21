const Config = require('../../config/config.json');

const build = (data) => {
    return `${Config.BASE_URL}/${data.lang || 'es'}${Config.paths.PRO_REVIEWS}${data.id}`;
}

module.exports = { build }