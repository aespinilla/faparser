import { proReviewsUrlBuilder } from "../../src/urlBuilder";

describe('Build pro review url', () => {
    it('should return pro reviews url given lang', async () => {
        const lang = 'xx';
        const id = '999999';
        const input = { id: id, lang: lang }
        const output = proReviewsUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/pro-reviews.php?movie-id=${id}`);
    });

    it('should return pro reviews url', async () => {
        const lang = 'es';
        const id = '999999';
        const input = { id: id }
        const output = proReviewsUrlBuilder(input);
        expect(output).toBe(`https://www.filmaffinity.com/${lang}/pro-reviews.php?movie-id=${id}`);
    });
});