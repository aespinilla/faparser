import { topicUrlBuilder } from "../../src/urlBuilder";

describe('Build trailers url', () => {
    it('should return topic url given lang', () => {
        const lang = 'xx';
        const query = 'XXXXXX';
        const input = {lang, query};
        const output = topicUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/movietopic.php?topic=${query}&attr=rat_count&nodoc`);
    });

    it('should return topic url', () => {
        const lang = 'es';
        const query = 'XXXXXX';
        const input = { query };
        const output = topicUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/movietopic.php?topic=${query}&attr=rat_count&nodoc`);
    });
});