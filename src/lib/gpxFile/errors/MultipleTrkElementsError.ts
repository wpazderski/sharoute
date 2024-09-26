export class MultipleTrkElementsError extends Error {
    constructor() {
        super("Multiple trk elements are not supported");
    }
}
