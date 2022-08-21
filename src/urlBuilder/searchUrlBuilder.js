const Config = require('../../config/config.json');

const peopleSearch = ['CAST', 'DIRECTOR'];
const types = ['TITLE', ...peopleSearch];

const build = (data) => {
    const lang = data.lang || 'es';
    const type = data.type && (types.includes(data.type)) ? data.type : 'TITLE';
    const start = data.start || 0;
    const orderBy = (typeof data.orderByYear === 'undefined' || (data.orderByYear !== 'undefined' && data.orderByYear === true)) ? '&orderby=year' : '';

    if (peopleSearch.includes(type.toUpperCase())) {
        return `${Config.BASE_URL}/${lang}${Config.paths.SEARCH}${type.toLowerCase()}&sn&stext=${encodeURIComponent(data.query)}&from=${start}${orderBy}`;
    }

    return `${Config.BASE_URL}/${lang}${Config.paths.SEARCH}${type.toLowerCase()}&stext=${encodeURIComponent(data.query)}&from=${start}${orderBy}`; 
}

module.exports = { build }