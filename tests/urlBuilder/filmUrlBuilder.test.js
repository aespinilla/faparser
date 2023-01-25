import { filmUrlBuilder } from "../../src/urlBuilder";

describe('Build film url', () => {
    it('should return film url', async () => {
        const lang = 'xx';
        const id = '999999';
        const input = { id: id, lang: lang }
        const output = filmUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/film${id}.html`);
    });
});