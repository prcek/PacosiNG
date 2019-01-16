
export interface IStore  {
    model1: string;
    model2: string;
    x: number;
}
export async function createStore(): Promise<IStore> {
    return { model1: 'a', model2: 'b', x: 1};
}
