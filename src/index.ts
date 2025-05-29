import './scss/styles.scss';
import { ShopAPI } from './components/ShopAPI';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./components/AppData";
import {Page} from "./components/Page";
import { Card, ProductDetails } from './components/Card';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import { Basket, BasketItem } from './components/common/Basket';
import { IShopItem } from './types';
import { IOrderForm, IOrderFormPayment } from './types';
import { OrderAddressForm, OrderContactsForm } from './components/Order';

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
    
    // Обновление корзины
    const basketItems = appData.basket.map((id, index) => {
        const item = appData.catalog.find(item => item.id === id);
        const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeItem(id)
        });
        
        return basketItem.render({
            index: index + 1,
            title: item.title,
            price: item.price
        });
    });
    
    basket.render({
        items: basketItems,
        total: appData.getTotal()
    });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    order.valid = !email && !phone;
    order.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^(order|contacts)\.(\w+):change/, (data: { field: string, value: string }) => {
    appData.setOrderField(data.field as keyof (IOrderForm & IOrderFormPayment), data.value);
});

// Открыть форму заказа
events.on('contacts:open', () => {
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
    const preview = new ProductDetails(
        cloneTemplate(cardPreviewTemplate),
        {
            onClick: () => {
                appData.addItem(item.id);
                modal.close();
                appData.setPreview(null);
            }
        }
    );

    preview.render({
        title: item.title,
        description: item.description,
        image: item.image,
        category: item.category,
        price: item.price // Теперь цена выводится отдельным элементом
    });

    modal.render({
        content: preview.render()
    });
    modal.open();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем товары с сервера
api.getItemList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error('Ошибка загрузки каталога:', err);
    });