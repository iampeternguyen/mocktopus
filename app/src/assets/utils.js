export function checkJsonInput(input) {
    const trimmedInput = input.trim();
    if (trimmedInput === "") {
        return "";
    }
    try {
        const parsed = JSON.stringify(JSON.parse(input || "{}"), null, 2)

        return typeof parsed === "string" ? parsed : parsed;
    } catch (e) {
        return trimmedInput;
    }
}
