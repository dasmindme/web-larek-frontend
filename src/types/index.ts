export interface IShopItem {
    id: string;
    image: string;
    category: string;
    title: string;
    about: string;
    price: number;
    description?: string;
}

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
    address: string;
}

export type orderData = IOrderForm & IOrderPayment;

export interface IShopAPI {
    getItemList: () => Promise<IShopItem[]>;
    orderItems: (order: IOrder) => Promise<IOrderResult>;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    image: string;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IBasketItem {
    index: HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    deleteButton: HTMLButtonElement;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IModalData {
    content: HTMLElement;
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export type TabState = {
    selected: string
};

export type TabActions = {
    onClick: (tab: string) => void
}

export interface ProductDetails {
    image: HTMLImageElement;
    title: HTMLElement;
    description: HTMLElement;
    addButton: HTMLButtonElement;
}