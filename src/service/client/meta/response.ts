export interface Response<T, E> {
    ok: boolean;
    code: number;
    error?: E;
    data?: T;
}
