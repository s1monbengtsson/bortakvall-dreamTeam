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
		throw new Error(`${res.status} ${res.statusText}`)
	}
  
	return await res.json() as IData
}

export const createNewOrder = async (order: IOrder) => {
    const res = await fetch(`${BASE_URL}${ORDERS}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order),
    })

    const orderInfo =  await res.json() 


  if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`)
	} else {
        document.querySelector('.checkout-wrap')!.classList.add('d-none')
        document.querySelector('.back-button')!.classList.add('d-none')
        document.querySelector('.order-confirmation')!.innerHTML += `
            <h2> Tack för din beställning!</h2>
            <div class="border rounded w-75 py-5 my-5 mx-auto">
            <h3 class=""> Orderbekräftelse</h3>
            <p>Ordernummer: <strong>${orderInfo.data.id}</strong></p>
            <p>Beställningsdatum: <strong>${orderInfo.data.order_date}</strong></p>
            <p>Betalt: <strong>${orderInfo.data.order_total} kr</strong></p>
            </div>
            <p class="mt-5 text-muted">Du kan nu stänga sidan!</p>
            <button class="btn btn-dark close">Stäng X</button>
        `
        document.querySelector('.close')!.addEventListener('click', () => {
            window.location.reload()
            localStorage.removeItem('Shopping cart')
            localStorage.removeItem('Total price')
            localStorage.removeItem('Total amount')
        })
        
    }


    
    


}