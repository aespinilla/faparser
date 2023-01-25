import { imagesController } from "../../src/controller";
import * as requestMock from "../../src/request/request.js";
import * as imagesUrlBuilderMock from "../../src/urlBuilder/imagesUrlBuilder.js";
import * as parserMock from "../../src/parser/imagesParser.js";

describe('Images controller tests', () => {
    beforeEach(() => {
        requestMock.request = jest.fn().mockReturnValue(Promise.resolve({
            url: 'http://fake.address',
            response: {},
            body: 'Some body content'
        }));

        imagesUrlBuilderMock.build = jest.fn().mockReturnValue('http://fake.address');

        parserMock.parse = jest.fn().mockReturnValue({});
    });

    it('Should return images object', async () => {
        const input = {id: 'XX'};
        const output = await imagesController(input);
        expect(output).toMatchObject({});
        expect(requestMock.request).toHaveBeenCalledTimes(1);
        expect(imagesUrlBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(parserMock.parse).toHaveBeenCalledTimes(1);
    });
});