# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проект Web-larek реализует интернет-магазин товаров для разработчиков. В нем есть возможность добавить товары в корзину, удалить товар, очистить корзину, оформить заказ.

## Описание интерфейса

Интерфейс состоит из:

 - Просмотор каталога товаров
 - Просмотр корзины
 - Оформление заказа

 Все, кроме главной страницы, реализовано через типовые модальные окна. Для них создан класс Modal.

 ## Описание классов и компонентов

Абстрактный класс Component отвечает за отображение элементов на странице

export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {}

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {}

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {}

    // Скрыть
    protected setHidden(element: HTMLElement) {}

    // Показать
    protected setVisible(element: HTMLElement) {}

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {}

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {}
}

Абстрактный класс для описания модели Model

export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {}

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) { // Состав данных можно модифицировать }
}

Класс с общими параметрами модели данных AppState

export class AppState extends Model<IAppState> {
    catalog: IShopItem[];
    basket: string[] = [];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: ''
    };
    preview: string | null;
    formErrors: FormErrors = {};


    addItem(id: string) { // Добавляет товар в корзину } 

    removeItem(id: string) { // Удаляет товар из корзины }

    clearBasket() { //Очищает корзину }

    getTotal() { // расчитывает общую сумму заказа }

    setPreview(item: IShopItem) { // устанавливает товар для предпросмотра в модальном окне }

    setCatalog(items: IShopItem[]) { // устанавливает товары в каталоге }

    setOrderField(field: keyof (IOrderData), value: string) { //устанавливает значения для форм }

    validateOrderForm() { // валидирует форму с адресом }

    validateContacts() { // валидирует форму с контактами }

    clearOrder() { // очищает форму }

}


Класс ShopAPI для управляет данными из Api 

Методы:

getShopItem - загружает товар

getItemList — загружает список товаров

orderItems — отправляет данные заказа



Класс Card для отображения карточки товара в каталоге

Поля:

protected _title — заголовок карточки
protected _image? — изображение товара
protected _description? — описание товара
protected _price? - цена товара
protected _category? - категория товара
protected _button? — кнопка добавления в корзину


Методы:

set category

get category

set id

get id

set title

get title

set image

set description

set price

get price

set buttonState



Класс OrderAddressForm реализует форму ввода адреса доставки

Поля:

_address - адресс

_paymentMethodCard - способ оплаты безнал

_paymentMethodCash - способ оплаты нал

Методы: 

set address — ввод адреса 

set paymentMethod - устанавливает способ оплаты


Класс OrderContactsForm реализует форму ввода контактов

Поля:

_email - почта
_phone - телефон

Методы:

email — ввод электронной почты

phone — ввод номера телефона



Класс Page управляет основным интерфейсом страницы
Поля:

_counter — счетчик товаров в корзине

_catalog — каталог товаров

_wrapper — блокировка интерфейса при загрузке

_basket —  корзина

Методы:

counter — обновляет счетчик товаров

locked — блокирует взаимодействие с интерфейсом



Класс Basket управляет отображением корзины

Поля: 

list - список товаров в корзине

total - общая сумма товаров

button - кнопка  оформить заказ

Методы:

items - получает список товаров

total - устанавливает общую сумму заказа


Класс BasketItem реализует элемент списка товаров в корзине
Поля:

_index — порядковый номер товара

_title — название товара

_price — цена товара

_deleteButton — кнопка удаления из корзины

Методы:

index — устанавливает позицию в списке

title — задает название товара

price — отображает цену товара



Класс Form реализует компонент для работы с формами 

Поля:

_submit — кнопка отправки формы

_errors — блок отображения ошибок

Методы:

valid — блокирует/разблокирует кнопку отправки

errors — показывает сообщения об ошибках



Кдасс Modal реализует компонент модального окна 

Поля:

_closeButton — кнопка закрытия окна

_content — содержимое модалки

Методы:

open — открывает окно

close — закрывает окно

content — устанавливает содержимое



Класс Success реализует компонент для отображения уведомления об успешной оплате

Поля:

_close — кнопка закрытия

_total — отображение суммы заказа

Методы:

total — устанавливает итоговую сумму


Список событий, реализующий связь между слоями модели и представления:

items:changed - изменились элементы каталога
order:open - открытие формы заказа
order:submit - отправлена форма заказа
formErrors:change - изменилось состояние валидации формы
/^order\..*:change/ - изменилось одно из полей
preview:changed - изменился открытый выбранный товар
modal:open - блокировка прокрутки страницы если открыта модалка
modal:close - разблокировка прокрутки страницы если открыта модалка
