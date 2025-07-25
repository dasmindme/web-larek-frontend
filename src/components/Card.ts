import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    price: number;
    image: string;
    category: string;
    disabled?: boolean;
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
        this._description = container.querySelector(`.${blockName}__text`);
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
		this.setText(this._category, value);
		if (this._category) {
			this._category.classList.add(
				`card__category_${
					new Map([
                        ['софт-скил', 'soft'],
                        ['другое', 'other'],
                        ['дополнительное', 'additional'],
                        ['кнопка', 'button'],
                        ['хард-скил', 'hard']
                      ]).get(value) ? new Map([
                        ['софт-скил', 'soft'],
                        ['другое', 'other'],
                        ['дополнительное', 'additional'],
                        ['кнопка', 'button'],
                        ['хард-скил', 'hard']
                      ]).get(value) : 'other'
				}`
			);
		}
	}

    get category(): string {
		return this._category.textContent || '';
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
        this.setText(this._description, value);
    }

    set price(value: number) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (this._button) {
            this._button.disabled = !value || value <= 0;
        }
    }

    get priceText(): string {
        return this._price?.textContent || '';
    }
}