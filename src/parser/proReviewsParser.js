const jQuery = require('cheerio');

const BASE_URL = "https://www.filmaffinity.com";

const parse = (data) => {
    try {
        return jQuery(data.body).find('.wrap>table>tbody>tr').map((_, element) => {
            const elHtml = jQuery(element);
            const authorHtml = elHtml.find('.author');

            const review = {
                country: parseCountry(elHtml),
                gender: parseGenre(elHtml),
                author: parseAuthor(authorHtml),
                url: parseUrl(elHtml),
                text: parseText(elHtml),
                bias: parseBias(elHtml),
                source: parseSource(authorHtml)
            };
            
            return review;
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

const parseCountry = (content) => {
    const contryHtml = content.find('.c>img')
    const href = contryHtml.attr('src');
    return {
        imgCountry: `${BASE_URL}${href}`,
        country: contryHtml.attr('title')
    };
}

const parseGenre = (content) => {
    return content.find('.gender>span').text().trim();
}

const parseAuthor = (content) => {
    return content.find('div').text().trim();
}

const parseUrl = (content) => {
    return content.find('.text>a').attr('href');
}

const parseText = (content) => {
    return content.find('.text').text().trim().replace(/"/g, '');
}

const parseBias = (content) => {
    return content.find('.fas.fa-circle').parent().find('span').text().trim();
}

const parseSource = (content) => {
    const source = content.find('strong').text().trim(); // This is for Filmaffinity review
    return source === "" ? content.find('em').text().trim() : source;
}

module.exports = { parse }