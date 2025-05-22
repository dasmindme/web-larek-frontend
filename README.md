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
    protected constructor(protected readonly container: HTMLElement) {
        
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {

    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {

    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {

    }

    // Скрыть
    protected setHidden(element: HTMLElement) {

    }

    // Показать
    protected setVisible(element: HTMLElement) {

    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
    }
}

Абстрактный класс для описания модели Model

export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {

    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать

    }
}

Класс с общими параметрами модели данных AppState

export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: IShopItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};



  async loadCatalog() {
// Загрузка каталога товаров
  }

    addItem(id: string) {
// Добавляет товар в корзину 
    } 

    removeItem(id: string) {
// Удаляет товар из корзины
    }

    getTotal() {
// расчитывает общую сумму заказа
    }

    setPreview(item: IShopItem) {
// устанавливает товар для предпросмотра в модальном окне
    }


    setOrderField(field: keyof IOrderForm, value: string) {
// обновляет значение конкретного поля в объекте заказа и проверяет валидность всего заказа и при успешной проверке генерирует событие
    }

    async checkout(orderData: IOrderForm & IOrderPayment) {
// Оформление заказа
  }

    validateOrder() {
// валидирует поля формы
}

}

Класс ShopAPI для управляет данными из Api 

class ShopAPI extends Api implements IShopAPI {
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }


    getItemList(): Promise<IShopItem[]> {
// Получает список товаров
    }

    orderLots(order: IOrder): Promise<IOrderResult> {
// Отправляет сообщение об успешном оформлении товара
    }

}

Класс Card управляет элементами карточки товара

class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {

    }

    set id(value: string) {

    }

    get id(): string {

    }

    set title(value: string) {

    }

    get title(): string {

    }

    set image(value: string) {

    }

    set description(value: string | string[]) {

    }
}

Класс Order выступает в роли контроллера для заказов

class Order extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {

    }

    set email(value: string) {

    }

    set paymentMethod(value: 'card' | 'cash' | null) {

    }

    set address(value: string) {

    }
}

Класс Page управляет основным интерфейсом страницы 

class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {

    }

    set counter(value: number) {

    }

    set catalog(items: HTMLElement[]) {

    }

    set locked(value: boolean) {

    }
}

Класс Basket управляет отображением корзины

class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {

    }

    set items(items: HTMLElement[]) {

    }

    set selected(items: string[]) {

    }

    set total(total: number) {

    }
}

Класс Form реализует компонент для работы с формами 

class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {

    }

    protected onInputChange(field: keyof T, value: string) {

    }

    set valid(value: boolean) {

    }

    set errors(value: string) {

    }

    render(state: Partial<T> & IFormState) {

    }
}

Кдасс Modal реализует компонент модального окна 

class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {

    }

    set content(value: HTMLElement) {

    }

    open() {

    }

    close() {

    }

    render(data: IModalData): HTMLElement {

    }
}

Класс Success реализует компонент для отображения уведомления об успешной оплате

class Success extends Component<ISuccess> {
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {

    }
}
