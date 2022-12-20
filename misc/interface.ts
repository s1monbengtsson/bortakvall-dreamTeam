
export interface IPost {
    status: string,
    message: string,
    data: Array<ICheckout>
  }
  
  export interface ICheckout {
      customer_first_name: string,
      customer_last_name: string,
      customer_address: string,
      customer_postcode: string,
      customer_city: string,
      customer_mail: string,
      customer_phone?: number,
      order_total: string,
      order_items: Array<ICart>,
  }
  
      export interface ICart {
      product_id: number,
      qty: number,
      item_price: number,
      item_total: number
  }
  
  export interface IResponse {
      status: string,
      data: Array<IResData>,
  }
  
  export interface IResData {
      id: number,
      order_date: string,
      customer_first_name: string,
      customer_last_name: string,
      customer_address: string,
      customer_postcode: string,
      customer_city: string,
      customer_phone?: number,
      order_total: number,
      created_at: string,
      updated_at: string,
      items: Array<IResDataItem>
  }
  export interface IResDataItem {
      id: number,
      order_id: number,
      product_id: number,
      qty: number,
      item_price: number,
      item_totoal: number
  }