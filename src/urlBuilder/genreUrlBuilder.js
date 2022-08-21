const Config = require('../../config/config.json');

const build = (data) => {
    return `${Config.BASE_URL}/${data.lang || 'es'}${Config.paths.GENRE}${data.query.toUpperCase()}&attr=rat_count&nodoc`;
}

module.exports = { build }