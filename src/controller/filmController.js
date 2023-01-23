import { request } from "../request/request.js";
import { filmUrlBuilder as urlBuilder } from "../urlBuilder/index.js";
import { filmParser as parse } from "../parser/index.js";

export const fetchFilm = async (data) => {
    const url = urlBuilder(data);
    const result = await request(url);
    result.lang = data.lang;
    const film = parse(result);
    return { id: `${data.id}`, ...film }
}