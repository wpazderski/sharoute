export class MultipleTrkSegElementsError extends Error {
    constructor() {
        super("Multiple trkseg elements are not supported");
    }
}
