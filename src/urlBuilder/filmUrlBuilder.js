import Config from '../../config/config.json' assert { type: "json" };

export const build = (data) => {
    return `${Config.BASE_URL}/${data.lang}/film${data.id}.html`;
}