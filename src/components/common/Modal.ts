import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

export interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    private _isOpened: boolean = false; // Флаг состояния

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement | null) {
        if (value) {
            this._content.replaceChildren(value);
        } else {
            this._content.innerHTML = ''; // Очищаем контент
        }
    }

    open() {
        this.container.classList.add('modal_active');
        this._isOpened = true;
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null; // Корректный сброс контента
        this._isOpened = false;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        
        // Открываем только если еще не открыто
        if (!this._isOpened) {
            this.open();
        }
        
        return this.container;
    }
}