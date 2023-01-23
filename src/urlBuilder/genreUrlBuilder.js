import Config from '../../config/config.json' assert { type: "json" };

export const build = (data) => {
    return `${Config.BASE_URL}/${data.lang || 'es'}${Config.paths.GENRE}${data.query.toUpperCase()}&attr=rat_count&nodoc`;
}