import { request } from "../request/request.js";
import { trailersUrlBuilder as urlBuilder } from "../urlBuilder/index.js";
import { trailersParser as parse } from "../parser/index.js";

export const fetchTrailers = async (data) => {
    data.type = 'TRAILERS';
    const url = urlBuilder(data);
    const response = await request(url);
    const result = parse(response);
    return result;
}