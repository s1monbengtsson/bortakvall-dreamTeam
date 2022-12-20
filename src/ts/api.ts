import { IData, IOrders } from "./interface";

/* Fetch products from api */

const BASE_URL = 'https://www.bortakvall.se/api'
const PRODUCTS = '/products'
// const orders = '/orders'
// response vid order


export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}${PRODUCTS}`)
  if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`)
	}
  
	return await res.json() as IData
}