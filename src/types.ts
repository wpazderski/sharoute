export type Opaque<TPrimary, TUnique extends symbol> = TPrimary & { [P in TUnique]: never };

declare const _Timestamp: unique symbol;
export type Timestamp = Opaque<number, typeof _Timestamp>;
