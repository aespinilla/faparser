import { searchUrlBuilder } from "../../src/urlBuilder";

describe('Build search url', () => {
    it('should return search url with title', () => {
        const orderByYear = false;
        const lang = 'xx';
        const type = 'TITLE';
        const query = "lorem ipsum";
        const start = 10;
        const expectedType = 'title';
        const expectedQuery = 'lorem%20ipsum';
        const input = { orderByYear, lang, type, query, start }
        const output = searchUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/search.php?stype=${expectedType}&stext=${expectedQuery}&from=${start}`);
    });

    it('should return search url with actor', () => {
        const orderByYear = false;
        const lang = 'xx';
        const type = 'CAST';
        const query = "lorem ipsum";
        const expectedStart = 0;
        const expectedType = 'cast';
        const expectedQuery = 'lorem%20ipsum';
        const input = { orderByYear, lang, type, query }
        const output = searchUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/search.php?stype=${expectedType}&sn&stext=${expectedQuery}&from=${expectedStart}`);
    });

    it('should return search url with title given required values', () => {
        const expectedLang = 'es';
        const query = "lorem ipsum";
        const expectedStart = 0;
        const expectedType = 'title';
        const expectedQuery = 'lorem%20ipsum';
        const input = { query }
        const output = searchUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${expectedLang}/search.php?stype=${expectedType}&stext=${expectedQuery}&from=${expectedStart}&orderby=year`);
    });
});