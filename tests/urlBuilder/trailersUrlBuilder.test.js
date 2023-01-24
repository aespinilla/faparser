import { build as trailersUrlBuilder } from "../../src/urlBuilder/trailersUrlBuilder.js";

describe('Build trailers url', () => {
    it('should return trailers url given lang', () => {
        const lang = 'xx';
        const id = '999999';
        const input = {lang: lang, id: id};
        const output = trailersUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/evideos.php?movie_id=${id}`);
    });

    it('should return trailers url', () => {
        const lang = 'es';
        const id = '999999';
        const input = {id: id};
        const output = trailersUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/evideos.php?movie_id=${id}`);
    });
});