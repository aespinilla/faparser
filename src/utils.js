const parseNumber = (value) => {
    const normalized = value.replace(',', '.').trim();
    return Number(normalized)
}

module.exports = { parseNumber }