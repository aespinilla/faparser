import { request } from "../request/request.js";
import { proReviewsUrlBuilder as urlBuilder } from "../urlBuilder/index.js";
import { proReviewsParser as parse } from "../parser/index.js";

export const fetchProReviews = async (data) => {
    data.type = 'PRO_REVIEWS';
    const url = urlBuilder(data);
    const response = await request(url);
    const result = parse(response);
    return result;
}