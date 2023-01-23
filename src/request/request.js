export async function request(url) {
    const response = await fetch(url);
    if (!response.ok) {
        // throw { code: response.status, message: response.statusText, url: url }
        throw new Error(response.statusText);
    }
    const result = await response.text();
    return {
        url: url,
        response: response,
        body: result
    }
}