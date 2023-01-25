import { filmController } from "../../src/controller";
import  * as requestMock from "../../src/request/request.js";
import * as filmUrlBuilderMock from "../../src/urlBuilder/filmUrlBuilder";
import * as filmParserMock from "../../src/parser/filmParser";

describe('Film controller tests', () => {
    beforeEach(() => {
        requestMock.request = jest.fn().mockReturnValue(Promise.resolve({
            url: 'http://fake.address',
            response: {},
            body: 'Some body content'
        }));

        filmUrlBuilderMock.build = jest.fn().mockReturnValue('http://fake.address');

        filmParserMock.parse = jest.fn().mockReturnValue({
            id: 'xxxxx',
            title: 'random',
            url: 'http://fake.address'
        });
    });

    it('should return film object', async () => {
        const id = 'xx';
        const lang = 'es';
        const input = { id, lang }
        const output = await filmController(input);

        expect(output.url).toBe('http://fake.address');
        expect(requestMock.request).toHaveBeenCalledTimes(1);
        expect(filmUrlBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(filmParserMock.parse).toHaveBeenCalledTimes(1);
    });
});