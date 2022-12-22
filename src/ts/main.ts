/**
 ********************************************************************************
 * IMPORTS
 */


import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import '../css/media.css'

import { fetchProducts, fetchOrder } from "./api"
import { IData, IProduct, IOrder } from "./interface"


/**
 ********************************************************************************
 * VARIABLES
 */

let products: IData
// let products: IProduct[] = []


// localStorage starts
let jsonCartItems = localStorage.getItem('Shopping cart') ?? '[]'
let cartItems: IProduct[] = JSON.parse(jsonCartItems)

let jsonCartTotal = localStorage.getItem('Total price') ?? '0'
let cartTotal: number = JSON.parse(jsonCartTotal)

const saveCart = () => {
        document.querySelector('#cart-item-count')!.textContent = String(cartItems.length)
        localStorage.setItem('Shopping cart', JSON.stringify(cartItems))
        countTotalPrice()
}

const renderCart = () => {
    saveCart()
    renderCartItems()
    renderTotalPrice()
}
// localStorage ends


const testOrder = await fetchOrder(
    {
        customer_first_name: 'Sean',
        customer_last_name: 'Banan',
        customer_address: 'Drottningatan 4b',
        customer_postcode: '21211',
        customer_city: 'Malmö',
        customer_email: 'testhejsan@gmail.com',
        customer_phone: '0723738495',
        order_total: 48,
        order_items: [
            {
                product_id: 6545,
                qty: 3,
                item_price: 8,
                item_total: 24,
            },
            {
                product_id: 6545,
                qty: 3,
                item_price: 8,
                item_total: 24,
            },
        ],
    }
)
// console.log(testOrder)

// Cart total price starts
const renderTotalPrice = () => {
    document.querySelector('#cart-total')!.textContent = `${cartTotal}kr`
}

const countTotalPrice = () => {
    let cartPrices = [0]
    cartPrices = [0, ...cartItems.map(item => item.price * item.qty)]
    cartTotal = cartPrices.reduce((price, sum) => sum += price)
    localStorage.setItem('Total price', JSON.stringify(cartTotal))
}

// Cart total price ends



/**
 ********************************************************************************
 * FUNCTIONS
 */


// Allt denna funktion ska göra är att hitta produkten man clickar på
const findClickedProduct = async (clickedId: number): Promise<IProduct> => {

    const products = await fetchProducts()
    const foundProduct: IProduct = products.data.find(prod => clickedId === prod.id) as IProduct
    // console.log('foundProduct:', foundProduct)
    return foundProduct
}

const renderCartItems = () => {
    document.querySelector('#cart-list')!.innerHTML = cartItems
    .map(item => `
        <li class="cart-item">
            <img class="cart-image" src="https://www.bortakvall.se${item.images.thumbnail}" alt="${item.name}">
            <div class="card-body cart-descript">
                <p class="card-title text-dark">${item.name}</p>
                <p class="cart-adjust">
                    <span data-product-id="${item.id}" class="decrease">-</span>
                    <input class="prod-qty" data-input-id="${item.id}" id="input-${item.id}" value="${item.qty}" style="width: 30px; text-align: center">
                    <span data-product-id="${item.id}" class="increase">+</span>
                </p>
                <p class="card-text text-dark" id="cart-item-price">${item.price} kr/st  </p>
                <p class="card-text text-dark item-total">${item.price * item.qty} kr</p>
            </div>
            <button class="btn btn-danger cart-remove-item" data-product-id="${item.id}"><i class="bi bi-trash cart-remove-item-i" data-product-id="${item.id}"></i></button>
        </li>
    `)
    .join('')
}

const renderItemTotal = (item: IProduct) => {
    const itemTotal = document.querySelector('.item-total') as HTMLParagraphElement
    itemTotal.textContent = `${item.price * item.qty} kr`
}

document.querySelector('#cart-list')?.addEventListener('keyup', e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.inputId)
    if (!clickedId) return
    const inCartItem = cartItems.find(item => item.id === clickedId) as IProduct
    
    const inputField = document.querySelector(`#input-${clickedId}`) as HTMLInputElement
    console.log(Number(inputField.value))

    inCartItem.qty = Number(inputField.value)
    
    saveCart()
    renderItemTotal(inCartItem)
    renderTotalPrice()

    if(target.className.includes('prod-qty')) {
        // console.log(inCartItem.qty)
    }
})

// Remove, + and - 
document.querySelector('#cart-list')?.addEventListener('click', async e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.productId)
    if (!clickedId) return
    const inCartItem = cartItems.find(item => item.id === clickedId) as IProduct  // Hitta produkten i cart som har samma ID som produkten jag klickade på

    if (target.className.includes('increase')) {
        inCartItem.qty++
    }
    else if (target.className.includes('decrease')) {
        inCartItem.qty--
    }
    else if (target.className.includes('cart-remove-item' || 'cart-remove-item-i')) {
        inCartItem.qty = 0
    }

    if (!(inCartItem.qty > 0)) {
        cartItems.splice(cartItems.indexOf(inCartItem), 1) // removes it from cart-array
    }
    renderCart()
})


const getProducts = async (): Promise<void> => {
    products = await fetchProducts()
    // console.log(products)
    renderProducts()  
}

const renderProducts = (): void => {
    document.querySelector('.product-main')!.innerHTML = products.data
        .map( prod => `
            <div class="col-12 col-md-6 col-lg-3 product-cards">
                <div class="card product-wrap border-0"  data-product-id="${prod.id}">
                    <img src="https://www.bortakvall.se${prod.images.thumbnail}" alt="${prod.name}" class="card-img-top card-img product-wrap-child" data-product-id="${prod.id}">
                    <div class="card-body product-wrap-child" data-product-id="${prod.id}">
                        <p id="product-name" class="card-title text-dark product-wrap-child" data-product-id="${prod.id}">${prod.name}</p>
                        <p id="product-price" class="card-text text-dark product-wrap-child" data-product-id="${prod.id}">${prod.price} kr</p>
                        <button class="btn btn-warning btn-span mb-0 py-1 product-wrap-child product-btn" data-product-id="${prod.id}">LÄGG I VARUKORG</button>
                    </div>
                </div>
            </div>
        `)
        .join('')
    document.querySelector('#nav-output')!.innerHTML +=
    `<h2 class="nav-item px-2">VISAR ALLA ${products.data.length} PRODUKTER</h2> `
}




/**
 ********************************************************************************
 * EVENT LISTENERS
 */




// Click event on each product
document.querySelector('main')?.addEventListener('click', async e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.productId)
    // console.log('clicked product id:', clickedId)
    const clickedProduct = await findClickedProduct(clickedId)

    if (target.className.includes('product-wrap' || 'product-wrap-child')) {

        // Om man klickar på 'Lägg till i varukorgen' knappen på en produkt
        if (target.tagName === 'BUTTON') {
            // console.log(clickedProduct)

            const inCartIds = cartItems.map(item => item.id)       
            const inCartItem = cartItems.find(item => item.id === clickedId) as IProduct  // Hitta produkten i cart som har samma ID som produkten jag klickade på
            // console.log(clickedId)

            if (!inCartItem || !inCartIds.includes(clickedId)) {
                clickedProduct.qty = 1
                cartItems.push(clickedProduct)
            }
            else if (inCartIds.includes(clickedId)) {
                // console.log('already here')
                inCartItem.qty++
            }

            renderCart()

            document.querySelector('#cart-wrap')!.classList.add('shake')
            document.querySelector('#cart-wrap')!.classList.add('move')
            setTimeout( () => {
                document.querySelector('#cart-wrap')!.classList.remove('shake')                
                document.querySelector('#cart-wrap')!.classList.remove('move')
            },950)
        }
        // Om man klickar någon annan stans på produkten. (info)
        else {
            console.log('viewing product')

            renderInfo(clickedProduct)
            document.body.style.overflow = 'hidden';
            findClickedProduct(clickedId)
        }
    }
})

// View cart
document.querySelector('#title-cart')!.addEventListener('click', () => {
    document.querySelector('.cart-background')!.classList.remove('d-none')
    document.body.style.overflow = 'hidden';
    
})
// close cart
document.querySelector('#cart-close')!.addEventListener('click', () => {
    document.querySelector('.cart-background')!.classList.add('d-none')
    document.body.style.removeProperty('overflow');

})


// Remove items from local storage(cart)
document.querySelector('#clear-cart-btn')?.addEventListener('click', async () => {
    localStorage.removeItem('Shopping cart')
    jsonCartItems = localStorage.getItem('Shopping cart') ?? '[]'
    cartItems = JSON.parse(jsonCartItems)
    renderCart()
    setTimeout(() => {
    document.querySelector('.cart-background')!.classList.add('d-none')
    document.body.style.removeProperty('overflow');
    },950)
})

/**
 ********************************************************************************
 * START
 */


// start info-section
const renderInfo = (productInfo: IProduct) => {
    document.querySelector('.info-background')!.classList.remove('d-none')
    document.querySelector('.info-background')!.classList.add('show-info')
    document.querySelector('#info-section')!.innerHTML = `    
    <div class="info-section-l">
        <img src="https://www.bortakvall.se/${productInfo.images.large}" alt="${productInfo.name}" class="info-img">
        <p class="info-name" class="mt-3">${productInfo.name}<span class="info-price">${productInfo.price}<span>kr</span></span></p>
        <button class="btn btn-warning m-2 p-2" data-prod-id="${productInfo.id}" style="font-weight: bold;">Lägg till i varukorg</button>
    </div>
      <div class="info-section-r"><h3>Beskrivning</h3>${productInfo.description}
      <p class="info-close"><i class="bi bi-x-lg"></i></p>
    </div>
    `
}

document.querySelector('.info-background')!.addEventListener('click', async e => {
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON') {
        const clickedId = Number(target.dataset.prodId)
        const clickedProduct = await findClickedProduct(clickedId)
        
        // Push item into cartItems
        cartItems.push(clickedProduct)
        renderCart()
        console.log(cartTotal)
        
        document.body.style.removeProperty('overflow');
        document.querySelector('#cart-wrap')!.classList.add('shake')
        setTimeout( () => { 
            document.querySelector('.info-background')!.classList.add('d-none')
            document.querySelector('#cart-wrap')!.classList.remove('shake')                
        },950)
    }
    else {
        document.querySelector('.info-background')!.classList.add('d-none')
        document.body.style.removeProperty('overflow');
    }
})
// end info-section

/* functions that are called when the page loads */
getProducts()
renderCart()
