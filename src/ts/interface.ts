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

export interface IPostData {
    data: {
        id: number,
        order_date: string,
        order_total: number
    }
}
