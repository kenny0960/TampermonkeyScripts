export const isJson = (jsonText): boolean => {
    try {
        JSON.parse(jsonText);
    } catch (error) {
        return false;
    }
    return true;
};
