import { request } from "../request/request.js";
import { imagesUrlBuilder as urlBuilder } from "../urlBuilder/index.js";
import { imagesParser as parse } from "../parser/index.js";

export const fetchImages = async (data) => {
    data.type = 'IMAGES'
    const url = urlBuilder(data);
    const response = await request(url);
    const result = parse(response);
    return result;
}