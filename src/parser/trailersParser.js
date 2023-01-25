import jQuery from 'cheerio';

export const parse = (data) => {
    try {
        const content = jQuery(data.body);
        return content.find('iframe').map((_, element) => {
            const url = jQuery(element).attr('src');
            return url;
        }).toArray();
    } catch (error) {
        console.error(error);
        return [];
    }
}