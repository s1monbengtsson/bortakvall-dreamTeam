/**
 ********************************************************************************
 * IMPORTS
 */


import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import '../css/media.css'

import { fetchProducts, fetchOrder } from "./api"
import { IData, IProduct, IOrder, ICustomerInfo } from "./interface"


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
    localStorage.setItem('Total price', JSON.stringify(cartTotal))
}
// localStorage ends

console.log("cart items:", cartItems)


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
    localStorage.setItem('Total amount', JSON.stringify(cartTotal))
}

// Cart total price ends



/**
 ********************************************************************************
 * FUNCTIONS
 */

let prodQty = 1

const renderCartItems = () => {
    document.querySelector('#cart-list')!.innerHTML = cartItems
    .map(item => `
        <li class="cart-item">
            <img class="cart-image" src="https://www.bortakvall.se${item.images.thumbnail}" alt="${item.name}">
            <div class="card-body cart-descript">
                <p class="card-title text-dark">${item.name}</p>
                <p class="cart-adjust">
                <span data-product-id="${item.id}" class="decrease">-</span>
                <input class="prod-qty" type="text" value="${item.qty}" style="width: 30px; text-align: center">
                <span data-product-id="${item.id}" class="increase">+</span>
                </p>
                <p class="card-text text-dark" id="cart-item-price">${item.price} kr/st  </p>
                <p class="card-text text-dark">${item.price * item.qty} kr</p>
            </div>
            <button class="btn btn-danger cart-remove-item" data-set-id="${item.id}"><i class="bi bi-trash" data-set-id="${item.id}"></i></button>
        </li>
    `)
    .join('')
}



// + and -
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
    saveCart()
    renderCartItems()
    countTotalPrice()
    renderTotalPrice()
})


const getProducts = async (): Promise<void> => {
    products = await fetchProducts()
    // console.log(products)
    renderProducts()  
}

const renderProducts = (): void => {
    document.querySelector('.product-main')!.innerHTML = products.data
        .map( prod => `
            <div class="col- 12 col-sm-6 col-md-6 col-lg-3 product-cards">
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
}

// Allt denna funktion ska göra är att hitta produkten man clickar på
const findClickedProduct = async (clickedId: number): Promise<IProduct> => {

    const products = await fetchProducts()
    const foundProduct: IProduct = products.data.find(prod => clickedId === prod.id) as IProduct
    // console.log('foundProduct:', foundProduct)
    return foundProduct
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

            saveCart()
            renderCartItems()
            countTotalPrice()
            renderTotalPrice()

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
    saveCart()
    renderCartItems()
    // Counts the total price of every item in the cart
    countTotalPrice()
    // Display the total price of all items
    renderTotalPrice()
    setTimeout(() => {
    document.querySelector('.cart-background')!.classList.add('d-none')
    document.body.style.removeProperty('overflow');
    },950)
})

// remove single item in cart
document.querySelector('#cart-list')?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.setId) // get datasetid of item
    const founditem : IProduct = cartItems.find(item => clickedId === item.id) as IProduct // finds it in cart-array
    console.log(` tog bort ${founditem.name} ur varukorgen`)
    cartItems.splice(cartItems.indexOf(founditem), 1) // removes it from cart-array
    // Save cartItems in localStorage
    saveCart()
    // Display items from cartItems
    renderCartItems()
    // Counts the total price of every item in the cart
    countTotalPrice()
    // Display the total price of all items
    renderTotalPrice()
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
        // Save cartItems in localStorage
        saveCart()
        // Display items from cartItems
        renderCartItems()
        // Counts the total price of every item in the cart
        countTotalPrice()
        // Display the total price of all items
        renderTotalPrice()
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



// function that renders checkout-page and form to DOM

const checkout = () => {
    cartItems.map(product => {
        console.log('cart-item:', product)

        document.querySelector('.content-container')!.classList.add('d-none')
        document.querySelector('#title-cart')!.classList.add('d-none')
        document.querySelector('.cart-background')!.classList.add('d-none')
        document.querySelector('#order-content')!.classList.remove('d-none')
        document.querySelector('.customer-details')!.classList.remove('d-none')

        document.body.style.removeProperty('overflow');

        let productTotal = (product.price * product.qty)

        document.querySelector('#order-content')!.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center text-center">
                <img src="https://www.bortakvall.se/${product.images.thumbnail}" alt="${product.name}" class="checkout-img">
                ${product.name}<br>x ${product.qty}<span>Styckpris: <br>${product.price} kr</span><span>Total:<br> ${productTotal} kr</span>
            </li>
        `
    })

    document.querySelector('#order-content')!.innerHTML += `

            <h3 class="text-center mt-3">Att betala: ${cartTotal} kr</h3>
        `
}

    // prefill form with customer data on page load
    const formAutoFill = () => {

        const customerFirstName = document.querySelector('#customer-first-name')! as HTMLInputElement
        const customerLastName = document.querySelector('#customer-last-name')! as HTMLInputElement
        const customerAddress = document.querySelector('#customer-address')! as HTMLInputElement
        const customerPostal = document.querySelector('#customer-postal-number')! as HTMLInputElement
        const customerCity = document.querySelector('#customer-city')! as HTMLInputElement
        const customerPhone = document.querySelector('#customer-phone')! as HTMLInputElement
        const customerEmail = document.querySelector('#customer-email')! as HTMLInputElement
    
        customerFirstName.value = customerData.customer_first_name ?? ''
        customerLastName.value = customerData.customer_last_name ?? ''
        customerAddress.value = customerData.customer_address ?? ''
        customerPostal.value = customerData.customer_postcode ?? ''
        customerCity.value = customerData.customer_city ?? ''
        customerPhone.value = customerData.customer_phone ?? ''
        customerEmail.value = customerData.customer_email ?? ''

    }

// function that renders form to DOM
const renderForm = () => {
    document.querySelector('.customer-details')!.innerHTML = `
        <h2 class="form-heading text-center mt-5">Beställare</h2>
            <div class="form-row">
                <div class="form-group">
                    <label for="customer-first-name"></label>
                    <input type="text" placeholder="Förnamn" id="customer-first-name" required class="form-control form-input">
                </div>
                <div class="form-group">
                    <label for="customer-last-name"></label>
                    <input type="text" placeholder="Efternamn" id="customer-last-name" required class="form-control form-input">
                </div>
                <div class="form-group">
                    <label for="customer-address"></label>
                    <input type="text" placeholder="Adress" id="customer-address" required class="form-control form-input">
                </div>


                <div class="form-group">
                    <label for="customer-postal-number"></label>
                    <input type="text" placeholder="Postnummer" id="customer-postal-number" required class="form-control form-input">
                </div>

                <div class="form-group">
                    <label for="customer-city"></label>
                    <input type="text" placeholder="Ort" id="customer-city" required class="form-control form-input">
                </div>

                <div class="form-group">
                    <label for="customer-phone"></label>
                    <input type="text" placeholder="Telefon" id="customer-phone" class="form-control form-input">
                </div>

                <div class="form-group">
                    <label for="customer-email"></label>
                    <input type="email" placeholder="Email" id="customer-email" required class="form-control form-input mb-3">
                </div>


                <div class="form-group">
                    <input type="checkbox" value="" id="customer-checkbox" class="form-check-input">
                    <label for="customer-checkbox" class="form-check-label">Jag har kontrollerat att informationen jag angett stämmer</label>
                </div>  

                <button type="submit" class="send-order btn btn-primary my-3 py-2">Skicka beställning</button>
                <button type="reset" class="empty-form btn btn-warning my-3 py-2">Töm formulär</button>

            </div> 
    `
    formAutoFill()
    
}

    // get json data from localStorage
    let jsonCustomerData = localStorage.getItem('Customer data') ?? '[]'

    // parse json data into object
    let customerData: ICustomerInfo = JSON.parse(jsonCustomerData)


const saveCustomerData = () => {

    const customerFirstName = document.querySelector('#customer-first-name')! as HTMLInputElement
    const customerLastName = document.querySelector('#customer-last-name')! as HTMLInputElement
    const customerAddress = document.querySelector('#customer-address')! as HTMLInputElement
    const customerPostal = document.querySelector('#customer-postal-number')! as HTMLInputElement
    const customerCity = document.querySelector('#customer-city')! as HTMLInputElement
    const customerPhone = document.querySelector('#customer-phone')! as HTMLInputElement
    const customerEmail = document.querySelector('#customer-email')! as HTMLInputElement


    customerData = {
        customer_first_name: customerFirstName.value,
        customer_last_name:  customerLastName.value,
        customer_address: customerAddress.value,
        customer_postcode: customerPostal.value,
        customer_city: customerCity.value,
        customer_phone: customerPhone.value,
        customer_email: customerEmail.value
    }

    // converts customerData to JSON
    const json = JSON.stringify(customerData)

    // saves JSON to localStorage
    localStorage.setItem('Customer data', json)

    console.log("customer data:", customerData)


}

// Add clickEvent to proceed to check out with all products from cart

document.querySelector('#checkout-btn')!.addEventListener('click', async e => {
    const target = e.target as HTMLButtonElement
    if (target.id === 'checkout-btn') {
        console.log('clicked on checkout')
        checkout()
        renderForm()
    }
})

// listen for submits, and save customer data to localStorage
document.querySelector('.customer-details')!.addEventListener('submit', e => {
    e.preventDefault()
    saveCustomerData()
})

// remove saved customer data when reset button is clicked
document.querySelector('.customer-details')!.addEventListener('reset', () => {
    localStorage.removeItem('Customer data')
    document.querySelector('#customer-first-name')?.setAttribute
})


/* functions that are called when the page loads */
getProducts()
saveCart() // called to view number of item in cart when page loads
countTotalPrice()
renderTotalPrice()
renderCartItems()



    
