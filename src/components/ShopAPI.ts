import { IShopAPI, IShopItem, IOrderResult, IOrder } from "../types/index";
import { Api, ApiListResponse } from "./base/api";

export class ShopAPI extends Api implements IShopAPI {
        readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

        getItemList(): Promise<IShopItem[]> {
        return this.get('/product').then((data: ApiListResponse<IShopItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}