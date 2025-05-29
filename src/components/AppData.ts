import {Model} from "./base/Model";
import {FormErrors, IAppState, IBasketItem, IShopItem, IOrderForm, IOrderFormPayment, IOrderData, PaymentMethod} from "../types";

export class AppState extends Model<IAppState> { 
    catalog: IShopItem[]; 
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

getTotal() {
    return this.basket.reduce((total, id) => {
        const item = this.catalog.find(item => item.id === id);
        return item ? total + item.price : total;
    }, 0);
}

setCatalog(items: IShopItem[]) {
    this.catalog = items;
    this.preview = null;
    this.emitChanges('catalog:changed', { catalog: this.catalog });
}

setPreview(item: IShopItem) { 
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
}


setOrderField(field: keyof (IOrderForm & IOrderFormPayment), value: string) {
    if (field in this.contacts) {
        this.contacts[field as keyof IOrderForm] = value;
    } else if (field in this.order) {
        // Специальная обработка для paymentMethod
        if (field === 'paymentMethod') {
            // Проверяем допустимые значения
            if (value === 'card' || value === 'cash' || value === '') {
                this.order.paymentMethod = value as PaymentMethod;
            } else {
                // Обработка недопустимого значения
                console.warn(`Недопустимый способ оплаты: ${value}`);
                this.order.paymentMethod = '';
            }
        }
    }
    
    this.validateOrder();
}

validateOrder() {
    const errors: typeof this.formErrors = {};
        if (!this.contacts.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.contacts.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
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
}