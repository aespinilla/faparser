const filmParser = require('../parser/filmParser')
const requestfa = require('../requestfa')

const fetchFilm = async (data) => {
    const result = await requestfa.requestSource(data)
    const film = filmParser.parse(result)
    return { id: `${data.id}`, ...film }
}

module.exports = { fetchFilm }