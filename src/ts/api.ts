import { IData, IOrder } from "./interface";

/* Fetch products from api */

const BASE_URL = 'https://www.bortakvall.se/api'
const PRODUCTS = '/products'
const ORDERS = '/orders'
// const orders = '/orders'
// response vid order


export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}${PRODUCTS}`)
  if (!res.ok) {
        document.querySelector('#nav-output')!.innerHTML = `<h2 class="nav-item px-2">${res.status} ${res.statusText}</h2>`
		
		throw new Error(`Could not get data, reason: ${res.status} ${res.statusText}`)
        
	}
  
	return await res.json() as IData
}

export const fetchOrder = async (order: IOrder) => {
    const res = await fetch(`${BASE_URL}${ORDERS}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order),
    })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
	}

    return await res.json() as IOrder
}