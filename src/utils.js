export const parseNumber = (value) => {
    const normalized = value.replace(',', '.').trim();
    return Number(normalized)
}