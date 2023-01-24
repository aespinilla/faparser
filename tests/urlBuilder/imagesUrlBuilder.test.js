import { build as imagesUrlBuilder } from "../../src/urlBuilder/imagesUrlBuilder.js";

describe('Build images url', () => {
    it('should return images url given lang', () => {
        const lang = 'xx';
        const id = '999999';
        const input = {lang, id};
        const output = imagesUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/filmimages.php?movie_id=${id}`);
    });

    it('should return images url', () => {
        const lang = 'es';
        const id = '999999';
        const input = { id };
        const output = imagesUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/filmimages.php?movie_id=${id}`);
    });
});