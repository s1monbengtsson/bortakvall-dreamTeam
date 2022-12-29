export interface IData {
  status: string,
  data: Array<IProduct>  
}

export interface IProduct {
      id: number,
      name: string,
      description: string,
      price: number,
      on_sale: boolean,
      images: {
        thumbnail: string,
        large: string,
      },
      stock_status: string,
      stock_quantity: number,  
      qty: number,
}

export interface IOrder {
    customer_first_name: string,
    customer_last_name: string,
    customer_address: string,
    customer_postcode: string,
    customer_city: string,
    customer_email: string,
    customer_phone?: string,
    order_total: number,
    order_items: object[]
}

export interface ICustomerInfo {
    customer_first_name: string,
    customer_last_name: string,
    customer_address: string,
    customer_postcode: string,
    customer_city: string,
    customer_phone?: string,
    customer_email: string
}

export interface IPostResponse {
    order_id: number,
    order_date: string
}

export interface IPostData {
    data:Array<IPostData>
}





/* 
product api:et ger

object ->
status: string, data:array of objects
*/


/*

{
  "status": "success",
  "data": [
      {
          "id": 5216,
          "name": "Gott & Blandat Giants",
          "description": "<p>En mix av lakrits och gelé med fruktsmak</p>\n<p>Innehållsförteckning: Socker, glukossirap, glukos-fruktossirap, stärkelse, VETEMJÖL, melass, syra (citronsyra), fuktighetsbevarande medel (sorbitoler, glycerol), lakritsextrakt, salt, vegetabiliska oljor (kokos, palm), aromer, färgämnen (E153, E120, E100, E141), ytbehandlingsmedel (bivax), stabiliseringsmedel (E471).</p>\n<p><em>Alla priser är per skopa.</em></p>\n",
          "price": 12,
          "on_sale": false,
          "images": {
              "thumbnail": "/storage/products/thumbnails/1997509-300x300.png",
              "large": "/storage/products/1997509.png"
          },
          "stock_status": "instock",
          "stock_quantity": null
      }
  ]
}

*/