import { request } from "../../src/request/request.js";

describe('Request tests', () => {
    it('should return successful response', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve('result'),
        }));
        const result = await request('http://fake.address');
        expect(result.url).toBe('http://fake.address');
        expect(result.body).toBe('result');
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return failure response', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({ 
            ok: false, 
            status: 500, 
            statusText: 'some error'
        }));
        await expect(request('http://fake.address')).rejects.toThrow('some error');
        expect(fetch).toHaveBeenCalledTimes(1);
    })
});