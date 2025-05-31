import { ShopAPI } from './components/ShopAPI';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./components/AppData";
import {Page} from "./components/Page";
import { Card } from './components/Card';
import { cloneTemplate, createElement, ensureElement} from "./utils/utils";
import { Modal } from "./components/common/Modal";
import { Basket, BasketItem } from './components/common/Basket';
import { IOrderData, IShopItem } from './types';
import { IOrderForm, IOrderFormPayment, IOrderResult, IOrder } from './types';
import { OrderAddressForm, OrderContactsForm } from './components/Order';
import { Success } from './components/common/Success';
import './scss/styles.scss';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderAddressForm(cloneTemplate(orderTemplate), events);
const contacts = new OrderContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events, {
	onClick: () => modal.close(),
});

// Изменились элементы каталога
events.on<IShopItem>('catalog:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            description: item.about,
            price: item.price,
            category: item.category
        });
    });
});

// Обработчик изменения корзины
events.on('basket:changed', () => {
    // Обновление счетчика
    page.counter = appData.basket.length;
    basket.items = appData.basket.map((id) => {
        const item = appData.catalog.find(item => item.id === id);
        const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), { onClick: () => appData.removeItem(id) });
        return basketItem.render(item);
    });
    basket.total = appData.getTotal();
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    })
})

// Изменилось состояние валидации формы
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
    const isValid = !errors.email && !errors.phone;
    
    contacts.valid = isValid;
    
    if (errors.email || errors.phone) {
        contacts.errors = Object.values(errors).filter(i => !!i).join('; ');
    } else {
        contacts.errors = '';
    }
});

events.on('formErrors:change', (errors: Partial<IOrderFormPayment>) => {
    const { address, paymentMethod} = errors;
    order.valid = !address && !paymentMethod;
    order.errors = Object.values({paymentMethod, address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change$/, (data: { field: string, value: string }) => {
    appData.setOrderField(data.field as keyof (IOrderFormPayment), data.value);
    appData.validateOrderForm();
});

events.on(/^contacts\..*:change$/, (data: { field: string, value: string }) => {
		appData.setContactsField(data.field as keyof (IOrderForm), data.value);
		appData.validateContacts();
	});

// Открыть форму заказа
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

events.on('order:open', () => {
    appData.clearOrder();
    appData.setOrderField('paymentMethod', 'card');
    modal.render({
        content: order.render({
            address: '',
            paymentMethod: 'card',
            valid: false,
            errors: []
        })
    });
});

// Инициализация начального значения
page.counter = appData.basket.length;

// Обработка выбора карточки товара
events.on('card:select', (item: IShopItem) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: IShopItem) => {
    const hasItemInBasket = appData.basket.includes(item.id);
    const preview = new Card(
      'card', cloneTemplate(cardPreviewTemplate),
      {
        onClick: () => {
            if (hasItemInBasket) {
                appData.removeItem(item.id);
            } else {
                appData.addItem(item.id);
                modal.close();
            }
        }
      }
    );
  
    // Первоначальный рендер с доступными данными
    modal.render({
        content: preview.render({
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      price: item.price,
      disabled: !item.price || item.price <= 0
    })
  });
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    const paymentMap = {
        card: 'online',
        cash: 'cash'
    };
    
    const orderData = {
        payment: paymentMap[appData.order.paymentMethod],
        email: appData.contacts.email,
        phone: appData.contacts.phone,
        address: appData.order.address,
        total: appData.getTotal(),
        items: appData.basket
    };

    api.orderItems(orderData)
        .then((data: IOrderResult) => {
            success.total = data.total;
            
            modal.render({
                content: success.render(),
            });
            
            appData.clearBasket();
            appData.clearOrder();
        })
        .catch(console.error)
});

// Получаем товары с сервера
api.getItemList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error('Ошибка загрузки каталога:', err);
    });