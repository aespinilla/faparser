import Config from '../../config/config.json' assert { type: "json" };

export const build = (data) => {
    return `${Config.BASE_URL}/${data.lang || 'es'}${Config.paths.TRAILERS}${data.id}`;
}