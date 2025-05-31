import {Model} from "./base/Model";
import {FormErrors, IAppState, IShopItem, IOrderForm, IOrderFormPayment, IOrderData, PaymentMethod} from "../types";

export const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
export const TEL_REGEXP = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

export class AppState extends Model<IAppState> { 
    catalog: IShopItem[] = []; 
    basket: string[] = []; 
    loading: boolean = false; 
    contacts: IOrderForm = { email: '', phone: '' };
    order: IOrderFormPayment = {address: '', paymentMethod: 'card' as PaymentMethod}
    preview: string | null; 
    formErrors: FormErrors = {};

addItem(id: string) { 
    this.basket.push(id);
    this.emitChanges('basket:changed');
} 

removeItem(id: string) { 
    this.basket = this.basket.filter(item => item !== id);
    this.emitChanges('basket:changed');
}

clearBasket() {
    this.basket = [];
    this.events.emit('basket:changed');
}

getTotal() {
    return this.basket.reduce((total, id) => {
        const item = this.catalog.find(item => item.id === id);
        return item ? total + item.price : total;
    }, 0);
}

setCatalog(items: IShopItem[]) {
    this.catalog = items;
    this.emitChanges('catalog:changed', { catalog: this.catalog });
}

setPreview(item: IShopItem) { 
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
}

setOrderField(field: keyof (IOrderData), value: string) {
    if (field === 'paymentMethod') {
        this.order.paymentMethod = value as PaymentMethod; 
    } else {
        this.order[field as 'address'] = value;
    }
    }

    setContactsField(field: keyof IOrderForm, value: string) {
        this.contacts[field] = value;
    }

validateOrderForm() {
    const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        
        if (!this.order.paymentMethod) {
            errors.paymentMethod = 'Необходимо выбрать способ оплаты';
        }
        
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        
        return Object.keys(errors).length === 0;
 }

 validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.contacts.email) {
        errors.email = 'Необходимо указать email';
    } else if (!EMAIL_REGEXP.test(this.contacts.email)) {
        errors.email = 'Неправильно указан email';
    }
    if (!this.contacts.phone) {
        errors.phone = 'Необходимо указать телефон';
    } else if (!TEL_REGEXP.test(this.contacts.phone)) {
        errors.phone = 'Неправильно указан телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}

 clearOrder() {
    this.contacts = {
        email: '',
        phone: '',
    }
    this.order = {
        address: '',
        paymentMethod: 'card',
    };
}
}