import { trailersController } from "../../src/controller";
import * as requestMock from "../../src/request/request.js";
import * as urlBuilderMock from "../../src/urlBuilder/trailersUrlBuilder.js";
import * as parserMock from "../../src/parser/trailersParser.js";

describe('TrailersController tests', () => {
    beforeEach(() => {
        requestMock.request = jest.fn().mockReturnValue(Promise.resolve({
            url: 'http://fake.address',
            response: {},
            body: 'Some body content'
        }));

        urlBuilderMock.build = jest.fn().mockReturnValue('http://fake.address');

        parserMock.parse = jest.fn().mockReturnValue({});
    });

    it('Should return trailers object', async () => {
        const input = {id: 'XX'};
        const output = await trailersController(input);
        expect(output).toMatchObject({});
        expect(requestMock.request).toHaveBeenCalledTimes(1);
        expect(urlBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(parserMock.parse).toHaveBeenCalledTimes(1);
    });
});