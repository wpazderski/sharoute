export type Opaque<TPrimary, TUnique extends symbol> = TPrimary & { [P in TUnique]: never };

export type GetExtraKeys<TBase, TTarget> = Exclude<keyof TTarget, keyof TBase>;

export type AssertIsNever<T extends never> = T extends never ? true : false;
export type AssertIsTrue<T extends true> = T extends true ? true : false;
export type AssertIsFalse<T extends false> = T extends false ? true : false;

export type AreTypesEqual<T1, T2> = [T1] extends [T2] ? ([T2] extends [T1] ? true : false) : false;

export type Constructor<T extends Error = Error> = new () => T;

declare const _Timestamp: unique symbol;
export type Timestamp = Opaque<number, typeof _Timestamp>;
