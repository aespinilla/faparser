const Config = require('../../config/config.json');

const build = (data) => {
    return `${Config.BASE_URL}/${data.lang}/film${data.id}.html`;
}

module.exports = { build }