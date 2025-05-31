import { Form } from "./common/Form";
import {IOrderForm, IOrderFormPayment, PaymentMethod} from "../types";
import {IEvents, EventEmitter} from "./base/events";

export class OrderContactsForm extends Form<IOrderForm> {
    protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}

export class OrderAddressForm extends Form<IOrderFormPayment> {
    protected _paymentMethodCard: HTMLButtonElement;
	protected _paymentMethodCash: HTMLButtonElement;
	protected _address: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentMethodCard = this.container.elements.namedItem('card') as HTMLButtonElement;

        this._paymentMethodCash = this.container.elements.namedItem('cash') as HTMLButtonElement;

        this._paymentMethodCard.addEventListener('click', () => {
			this.paymentMethod = 'card';
			this.onInputChange('paymentMethod', 'card');
		});
		this._paymentMethodCash.addEventListener('click', () => {
			this.paymentMethod = 'cash';
			this.onInputChange('paymentMethod', 'cash');
		});
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set paymentMethod(value: PaymentMethod) {
		this.toggleClass(this._paymentMethodCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._paymentMethodCash, 'button_alt-active', value === 'cash');
	}
}