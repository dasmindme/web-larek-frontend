export interface IShopItem {
    id: string;
    image: string;
    category: string;
    title: string;
    about: string;
    price: number;
    description?: string;
}

export type IBasketItem = Pick<IShopItem, 'id' | 'title' | 'price'>;

export interface IAppState {
    catalog: IShopItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IBid {
    price: number
}

export interface IOrderResult {
    id: string;
}

export interface IOrderPayment {
    paymentMethod: 'card' | 'cash' | null;
    adress: string;
}