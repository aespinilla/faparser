const jQuery = require('cheerio');

const parse = (data) => {
    return jQuery(data.body).find('#main-image-wrapper').find('a').map((_, item) => {
        const href = jQuery(item).attr('href');
        if (href.includes('.jpg')) {
            const item = {
                large: href
            }
            if (href.includes('large')) {
                item.thumbnail = href.replace("large", "s200");
            } else {
                item.thumbnail = href;
            }
            return item;
        }
    }).toArray();
}

module.exports = { parse }