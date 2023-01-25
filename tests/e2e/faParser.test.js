import { film } from "../../index.js";

describe('faParser tests', () => {
    it('Should return film when lang and id are provided', async () => {
        const input = {id: '932476', lang: 'es'};
        const output = await film(input);
        expect(output.id).toBe('932476');
    });

    it('Should return film when no lang provided', async () => {
        const input = {id: '932476'};
        const output = await film(input);
        expect(output.id).toBe('932476');
    });
});