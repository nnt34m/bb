export type Constructor<T> = new (...args: any[]) => T
export type KV<T = any> = { [key: string]: T }
export type XORY = 'x' | 'y'