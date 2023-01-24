import { build as genreUrlBuilder } from "../../src/urlBuilder/genreUrlBuilder.js";

describe('Build genre url', () => {
    it('should return genre url given lang', () => {
        const lang = 'xx';
        const query = 'xxxxxx';
        const expectedQuery = 'XXXXXX'
        const input = {lang, query};
        const output = genreUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/moviegenre.php?genre=${expectedQuery}&attr=rat_count&nodoc`);
    });

    it('should return genre url with default lang', () => {
        const query = 'XXXXXX';
        const expectedLang = 'es';
        const input = {query};
        const output = genreUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${expectedLang}/moviegenre.php?genre=${query}&attr=rat_count&nodoc`);
    });
});