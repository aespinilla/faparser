import { jest } from '@jest/globals'
import { request } from "../src/request/request.js";

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('result'),
    })
);

beforeEach(() => {
    fetch.mockClear();
});

describe('Request tests', () => {
    it('Successful request', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve('result'),
        }));
        const result = await request('http://fake.address');
        expect(result.url).toBe('http://fake.address');
        expect(result.body).toBe('result');
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Failure request', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({ ok: false, status: 500, statusText: 'some error' }));
        await expect(request('http://fake.address')).rejects.toThrow('some error');
    })
});