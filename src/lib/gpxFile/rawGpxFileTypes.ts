export interface RawGpxFile {
    gpx: {
        trk: RawGpxFileTrk | RawGpxFileTrk[];
        metadata?: RawGpxFileMetadata;
    };
}

export interface RawGpxFileTrk {
    trkseg: RawGpxFileTrkSeg | RawGpxFileTrkSeg[];
    name?: string;
}

export interface RawGpxFileTrkSeg {
    trkpt: RawGpxFileTrkPt | RawGpxFileTrkPt[];
}

export interface RawGpxFileTrkPt {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "@lat": string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "@lon": string;
    "ele"?: number | string | undefined;
}

export interface RawGpxFileMetadata {
    name?: string;
}
