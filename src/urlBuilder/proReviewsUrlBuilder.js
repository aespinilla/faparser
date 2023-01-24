import { Config } from '../config/config.js';

export const build = (data) => {
    return `${Config.BASE_URL}/${data.lang || 'es'}${Config.paths.PRO_REVIEWS}${data.id}`;
}