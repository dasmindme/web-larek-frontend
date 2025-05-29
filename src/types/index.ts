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
    loading: boolean;
    contacts: IOrderForm;
    order: IOrderFormPayment;
    preview: string | null;
    formErrors: FormErrors;
}

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export type FormErrors = Partial<Record<keyof (IOrderForm & IOrderFormPayment), string>>;

export interface IBid {
    price: number
}

export interface IOrderResult {
    id: string;
}

export type PaymentMethod = 'card' | 'cash' | '';

export interface IOrderFormPayment {
    address: string;
    paymentMethod: PaymentMethod; // Используем новый тип
}

export type IOrderData = IOrderForm & IOrderFormPayment;

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
}

export interface IBasketItem {
    index: number;
    title: string;
    price: number;
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

export interface IProductDetails {
    image: HTMLImageElement;
    title: HTMLElement;
    description: HTMLElement;
    price: HTMLElement;
    button: HTMLButtonElement;
    render: HTMLElement;
}