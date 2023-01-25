import * as utils from '../../src/utils/utils';

describe('Utils tests', () => {
    it('should return normalized number', () => {
        const input = '3,2';
        const output = utils.parseNumber(input);
        expect(output).toBe(3.2);
    });

    it('should return null', () => {
        const input = 'aabbcc';
        const output = utils.parseNumber(input);
        expect(output).toBeNaN();
    });
});