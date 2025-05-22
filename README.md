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


    clearBasket() {
// очищает корзину
    }

    removeItem(id: string) {
// Удаляет товар из корзины
    }

    getTotal() {
// расчитывает общую сумму заказа
    }

    setCatalog(items: IShopItem[]) {
// добавляет товары в каталог
    }

    setPreview(item: IShopItem) {
// устанавливает товар для предпросмотра в модальном окне
    }


    setOrderField(field: keyof IOrderForm, value: string) {
// обновляет значение конкретного поля в объекте заказа и проверяет валидность всего заказа и при успешной проверке генерирует событие
    }

    validateOrder() {
// валидирует поля формы
}

}

