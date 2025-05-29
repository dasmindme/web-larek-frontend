import {Component} from "./base/Component";
import {IShopItem, IProductDetails} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    price: number;
    image: string;
    category: string;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _price?: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            
            // Добавляем класс для стилизации в зависимости от категории
            const categoryClass = `card__category_${value.toLowerCase()}`;
            this._category.className = `${this.blockName}__category ${categoryClass}`;
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set price(value: number | string) {
        if (this._price) {
            this.setText(this._price, typeof value === 'number' ? `${value} синапсов` : value);
        }
    }
}

export class ProductDetails extends Component<IShopItem> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        // Инициализация элементов
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.button', container);
        this._price = ensureElement<HTMLElement>('card__price', container);
        this._category = ensureElement<HTMLElement>('card__category', container);
        

        // Обработчик кнопки добавления
        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    // Установка изображения товара
    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent);
    }

    // Установка названия товара
    set title(value: string) {
        this.setText(this._title, value);
    }

    // Установка описания товара
    set description(value: string) {
        this.setText(this._description, value);
    }

    // Обновление состояния кнопки
    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    // Блокировка/разблокировка кнопки
    set buttonDisabled(state: boolean) {
        this.setDisabled(this._button, state);
    }

    set price(value: number) {
        this.setText(this._price, typeof value === 'number' ? `${value} синапсов` : value);
    }

        // Установка категории товара
    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = `card__category_${value.toLowerCase()}`;
            this.toggleClass(this._category, categoryClass, true);
        }
    }

    // // Основной метод рендеринга
    // render(data?: Partial<IShopItem>): HTMLElement {
    //     if (data) {
    //         if (data.image) this.image = data.image;
    //         if (data.title) this.title = data.title;
    //         if (data.description) this.description = data.description;
    //         if (data.category) this.category = data.category;
    //         if (data.price) this.buttonText = `В корзину за ${data.price} синапсов`;
    //     }
    //     return this.container;
    // }
}