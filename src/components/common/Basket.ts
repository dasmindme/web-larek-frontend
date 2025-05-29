import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { IBasketItem } from "../../types";

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IBasketItemActions {
    onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__total');
        this._button = this.container.querySelector('.basket__action');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }
}

export class BasketItem extends Component<IBasketItem> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

     constructor(container: HTMLElement, actions?: IBasketItemActions) {
        super(container);
        
        // Инициализация элементов
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        // Обработчик кнопки удаления
        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    // Установка порядкового номера
    set index(value: number) {
        this.setText(this._index, String(value));
    }

    // Установка названия товара
    set title(value: string) {
        this.setText(this._title, value);
    }

    // Установка цены
    set price(value: number | string) {
        this.setText(this._price, typeof value === 'number' ? `${value} синапсов` : value);
    }
}