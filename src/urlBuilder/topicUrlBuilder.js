import { Config } from '../config/config.js';

export const build = (data) => {
    return `${Config.BASE_URL}/${data.lang || 'es'}${Config.paths.TOPIC}${data.query.toUpperCase()}&attr=rat_count&nodoc`;
}