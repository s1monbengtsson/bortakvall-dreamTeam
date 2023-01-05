import 'bootstrap/dist/css/bootstrap.css'
import '../css/header.css'
import '../css/products.css'
import '../css/cart.css'
import '../css/checkout.css'
import '../css/footer.css'
import '../css/media.css'


import { fetchProducts, createNewOrder } from "./api"
import { IData, IProduct, IOrder, ICustomerInfo, IPostData } from "./interface"


const dqs = (el: string) => document.querySelector(`${el}`)!
const hide = (element: string) => dqs(element).classList.add('d-none')
const display = (element: string) => dqs(element).classList.remove('d-none')

const form = dqs('.customer-details') as HTMLFormElement
const customerFirstName = dqs('#customer-first-name') as HTMLInputElement
const customerLastName = dqs('#customer-last-name') as HTMLInputElement
const customerAddress = dqs('#customer-address') as HTMLInputElement
const customerPostal = dqs('#customer-postal-number') as HTMLInputElement
const customerCity = dqs('#customer-city') as HTMLInputElement
const customerPhone = dqs('#customer-phone') as HTMLInputElement
const customerEmail = dqs('#customer-email') as HTMLInputElement

let products: IData

// localStorage 
let jsonCartItems = localStorage.getItem('Shopping cart') ?? '[]'
let cartItems: IProduct[] = JSON.parse(jsonCartItems)

let jsonCartTotal = localStorage.getItem('Total price') ?? '0'
let cartTotal: number = JSON.parse(jsonCartTotal)

let jsonCustomerData = localStorage.getItem('Customer data') ?? '[]'
let customerData: ICustomerInfo = JSON.parse(jsonCustomerData)

const saveCart = () => {
    dqs('#cart-item-count').textContent = String(cartItems
        .map( item => item.qty )
        .reduce( (num, sum) => num + sum, 0))
    localStorage.setItem('Shopping cart', JSON.stringify(cartItems))
    countTotalPrice()
}

const renderCart = () => {
    saveCart()
    renderCartItems()
    renderTotalPrice()
}

// cart total price
const renderTotalPrice = () => {
    dqs('#cart-total').textContent = `${cartTotal}kr`
}

const countTotalPrice = () => {
    cartTotal = [0, ...cartItems
        .map(item => item.price * item.qty)]
        .reduce((price, sum) => sum += price)
    localStorage.setItem('Total price', JSON.stringify(cartTotal))
}

// find the product clicked
const findClickedProduct = async (clickedId: number): Promise<IProduct> => {
    const products = await fetchProducts()
    return products.data.find(prod => clickedId === prod.id) as IProduct
}

// find product in cart with same ID as the clicked product
const findCartItem = (clickedId: number) => cartItems.find(item => item.id === clickedId) as IProduct

const renderCartItems = () => {
    dqs('#cart-list').innerHTML = cartItems
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
                    <p class="card-text-cart text-dark cart-item-price">${item.price} kr/st  </p>
                    <p class="card-text-cart text-dark" id="item-price-${item.id}">${item.price * item.qty} kr</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-x-circle cart-remove-item" data-product-id="${item.id}" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </li>
        `)
        .join('')
        
    // disable checkout button if product qty < 1
    if (cartItems.length === 0) {
        dqs('#checkout-btn').setAttribute('disabled', 'disabled')
    } else {
        dqs('#checkout-btn').removeAttribute('disabled')
    }
}

// input field on every cart item
dqs('#cart-list').addEventListener('keyup', e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.inputId)
    if (!clickedId) return
    const inCartItem = findCartItem(clickedId)
    const inputField = dqs(`#input-${clickedId}`) as HTMLInputElement
    inCartItem.qty = Number(inputField.value)
    saveCart()
    const itemTotal = dqs(`#item-price-${clickedId}`) as HTMLParagraphElement
    itemTotal.textContent = `${inCartItem.price * inCartItem.qty} kr`
    renderTotalPrice()
})

dqs('#cart-list').addEventListener('focusout', e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.inputId)
    if (!clickedId) return
    const inCartItem = findCartItem(clickedId)

    if (!(inCartItem.qty > 0)) {
        cartItems.splice(cartItems.indexOf(inCartItem), 1)
        renderCart()
    }
    else if (inCartItem.qty > inCartItem.stock_quantity) {
        const inputField = dqs(`#input-${clickedId}`) as HTMLInputElement

        inputField.value = String(inCartItem.stock_quantity)
        inCartItem.qty = Number(inputField.value)
        
        console.log(inCartItem.qty)
        renderCart()
        noMoreCandy(inCartItem)
    }
})

// remove, increment or decrement products from cart
dqs('#cart-list').addEventListener('click', async e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.productId)
    if (!clickedId) return
    const inCartItem = findCartItem(clickedId)

    if (target.tagName === 'svg') {
        inCartItem.qty = 0
    }
    else if (target.className.includes('increase')) {
        increaseQty(inCartItem)
    }
    else if (target.className.includes('decrease')) {
        inCartItem.qty--
    }

    if (!(inCartItem.qty > 0)) {
        cartItems.splice(cartItems.indexOf(inCartItem), 1)
    }
    renderCart()
})

// gets products from API
const getProducts = async (): Promise<void> => {
    display('#spinner')
    try {
        products = await fetchProducts()
        renderProducts()  
    }
    catch {
        dqs('#output').innerHTML = `<h2 class="nav-item px-2">🚨 KUNDE INTE HÄMTA DATA FRÅN SERVER 🚨 <br> försök igen senare...</h2>`
        dqs('#main').innerHTML = `<h2 class="p-5">❌</h2>`
    }
    hide('#spinner')
}

// render products 
const renderProducts = (): void => {

    // counts products in assortment and products in stock
    const itemsInStock = products.data 
    .map( prod => prod.stock_status)
    .filter(x => x === 'instock').length
    dqs('#output').innerHTML = `Vi har ${itemsInStock} st av ${products.data.length} st produkter i lager`
     
    // sorts products by alphabetical order
    products.data 
    .sort((a, b) => a.name
    .localeCompare(b.name))

    dqs('.product-main').innerHTML = products.data
    .map( prod => `
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 product-cards">
            <div class="card product-wrap border-0">
                <img src="https://www.bortakvall.se${prod.images.thumbnail}" alt="${prod.name}" class="card-img-top card-img product-click-event" data-product-id="${prod.id}">
                <div class="card-body">
                    <p class="card-title product-click-event" data-product-id="${prod.id}">${prod.name}</p>
                    <p class="card-text text-dark">${prod.price} kr</p>
                    <p class="info-icon-wrap product-click-event">     
                        <svg xmlns="http://www.w3.org/2000/svg" class="product-click-event bi bi-info-square info-icon" data-product-id="${prod.id}" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
                            <path class="product-click-event" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path class="product-click-event" d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                    </p>
                    <button class="product-click-event product-btn ${(prod.stock_status === 'outofstock') ? 'product-btn-outofstock' : ''}" data-product-id="${prod.id}" ${(prod.stock_status === 'outofstock') ? 'disabled' : ''}>
                        ${(prod.stock_status === 'outofstock') ? 'SLUT I LAGER' : 'LÄGG TILL I VARUKORG'}
                    </button>
                    <p class="stock-qty">Antal i lager: ${(prod.stock_quantity === null) ? '0': prod.stock_quantity} </p>
                </div>
            </div>
        </div>
    `)
    .join('')
}

// when candy is out of stock
const noMoreCandy = (candy: IProduct) => {
    dqs('#no-more-candy').innerHTML = `<p>${candy.name}<br> är inte längre tillgängligt.</p>`
    display('#no-more-candy')
    setTimeout(() => {
        hide('#no-more-candy')
    }, 2000)
}

// adding a product to cart
const addProduct = (clickedProduct: IProduct) => {
    const clickedId = clickedProduct.id
    const inCartIds = cartItems.map(item => item.id)       
    const inCartItem = findCartItem(clickedId)

    // check if product already exist in cart
    if (!inCartItem || !inCartIds.includes(clickedId)) {
        clickedProduct.qty = 1
        cartItems.push(clickedProduct)
    }
    else if (inCartIds.includes(clickedId)) {
        increaseQty(inCartItem)
    }
    dqs('#title-cart').classList.add('shake')
    setTimeout( () => {
        dqs('#title-cart').classList.remove('shake')                
    },950)
}

// increment qty of a specific product
const increaseQty = (prod: IProduct) => {
    if (!(prod.stock_quantity > prod.qty)) {
        noMoreCandy(prod)
        return
    }
    else {
        prod.qty++
    }
}

// click event on each product
dqs('main').addEventListener('click', async e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.productId)
    const clickedProduct = await findClickedProduct(clickedId) 

    // if click did not happen on specific class, return
    if (!target.getAttribute('class')?.includes('product-click-event')) return
    
    // add clicked product to cart
    if (target.tagName === 'BUTTON') {
        addProduct(clickedProduct)
        renderCart()
    }
    // if click is not done on product
    else {
        renderInfo(clickedProduct)
        document.body.style.overflow = 'hidden'
    } 
})

// view cart
dqs('#title-cart').addEventListener('click', () => {
    dqs('.cart-background').classList.add('show')
    document.body.style.overflow = 'hidden'
    
})

// close cart
dqs('#cart-close').addEventListener('click', () => {
    dqs('.cart-background').classList.remove('show')
    document.body.style.removeProperty('overflow')

})

// remove items from local storage(cart)
dqs('#clear-cart-btn').addEventListener('click', async () => {
    localStorage.removeItem('Shopping cart')
    jsonCartItems = localStorage.getItem('Shopping cart') ?? '[]'
    cartItems = JSON.parse(jsonCartItems)
    renderCart()
    setTimeout(() => {
    dqs('.cart-background').classList.remove('show')
    document.body.style.removeProperty('overflow')
    },500)
})

// info-section start
const renderInfo = (productInfo: IProduct) => {
    display('.info-background')
    dqs('.info-background').classList.add('show-info')
    dqs('#info-section').innerHTML = `    
        <div class="info-section-l">
            <img src="https://www.bortakvall.se/${productInfo.images.large}" alt="${productInfo.name}" class="info-img">
            <p class="info-name" class="mt-3">
                ${productInfo.name}
                <span class="info-price">
                    ${productInfo.price}
                    <span>kr</span>
                </span>
            </p>
            <button class="product-btn m-2 p-2 ${(productInfo.stock_status === 'outofstock') ? 'product-btn-outofstock' : ''}" data-product-id="${productInfo.id}" style="font-weight: bold;" ${(productInfo.stock_status === 'outofstock') ? 'disabled' : ''}>${(productInfo.stock_status === 'outofstock') ? 'SLUT I LAGER' : 'LÄGG TILL I VARUKORG'}</button>
            <p class="stock-qty">Antal i lager: ${(productInfo.stock_quantity === null) ? '0': productInfo.stock_quantity} </p>
        </div>
        <div class="info-section-r">
            <h3>Beskrivning</h3>
            ${productInfo.description}
            <p class="info-close">
                <svg class="bi-x-lg close-info" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z">
                </svg>
            </p>
        </div>
    `
}

// click event on info-section
dqs('.info-background').addEventListener('click', async e => {
    const target = e.target as HTMLElement
    const clickedId = Number(target.dataset.productId)
    const clickedProduct = await findClickedProduct(clickedId)

    if (target.tagName === 'BUTTON') {      
        addProduct(clickedProduct)
        renderCart()
        
        document.body.style.removeProperty('overflow');
    }
    else if (target.tagName === 'svg' || target.tagName === 'path' || target.className.includes('info-background')) {
        hide('.info-background')
        document.body.style.removeProperty('overflow');
    }
})


// renders checkout-page to DOM
const checkout = () => {
    window.scrollTo(0,0)
    window.scrollTo(0,0)
    hide('.content-display')
    hide('#title-cart')
    hide('#main')
    hide('footer')
    display('.order-content-wrap')
    display('.customer-details')
    display('.back-button')
    dqs('.content-wrapper').classList.add('banner-checkout')
    dqs('.cart-background').classList.remove('show')

    cartItems.map(product => {
        document.body.style.removeProperty('overflow')

        let productTotal = (product.price * product.qty)

        dqs('#order-content').innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center text-center rounded col-12">
                <img src="https://www.bortakvall.se/${product.images.thumbnail}" alt="${product.name}" class="checkout-img col-3">
                <p class="col-3">${product.name}<br>x ${product.qty}</p><p class="col-3">Á pris: <br>${product.price} kr</p><p class="col-3">Total:<br> ${productTotal} kr</p>
            </li>
        `
    })

    dqs('#order-content').innerHTML += `
        <h3 class="text-center mt-4">Att betala: ${cartTotal} kr</h3>
    `
}


// renders form to DOM
const renderForm = () => {
    display('.customer-details')
    // prefill form with customer data on page load
    customerFirstName.value = customerData.customer_first_name ?? ''
    customerLastName.value = customerData.customer_last_name ?? ''
    customerAddress.value = customerData.customer_address ?? ''
    customerPostal.value = customerData.customer_postcode ?? ''
    customerCity.value = customerData.customer_city ?? ''
    customerPhone.value = customerData.customer_phone ?? ''
    customerEmail.value = customerData.customer_email ?? ''
}


// saving customer data to localStorage
const saveCustomerData = () => {
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
}


// add clickEvent to proceed to check out with all products from cart
dqs('#checkout-btn').addEventListener('click',() => {
    checkout()
    renderForm()
    const looseFocus = dqs('#checkout-btn') as HTMLElement
    looseFocus.blur()    
})

// if error posting to server
const errorWarning = () => {
    document.querySelector('.order-confirmation')!.innerHTML = `
        <div class="alert alert-danger">Your order could not be placed. Please try again</div>
    `
}


// sets default value for formSubmitted
let formSubmitted = false;

// listen for submits, and save customer data to localStorage
form.addEventListener('submit', async e => {
    e.preventDefault()
    saveCustomerData()
    // prevents user from spamming button and order confirmation being printed several times
    formSubmitted = true;

    if (formSubmitted) {
        dqs('.send-order').setAttribute('disabled', 'disabled')
    }

    // mapping over cartItems to store only needed keys
    const orderedItems = cartItems.map(item => ({product_id: item.id, qty: item.qty, item_price: item.price, item_total:item.price*item.qty}))

    // object containing order content
    const newOrder: IOrder =   {
        customer_first_name: customerFirstName.value,
        customer_last_name: customerLastName.value,
        customer_address: customerAddress.value,
        customer_postcode: customerPostal.value,
        customer_city: customerCity.value,
        customer_email: customerEmail.value,
        customer_phone: customerPhone.value,
        order_total: cartTotal,
        order_items: orderedItems
    }
        
    // store ordered items and print to DOM
    const orderConfirmation = async () => {
        window.scrollTo(0,0)

        const orderInfo:IPostData = await createNewOrder(newOrder)

        // creating order confirmation template
        try{
            hide('.checkout-wrap')
            hide('.back-button')
            dqs('.order-confirmation').innerHTML += `
                <h2 class="mb-3"> Tack för din beställning!</h2>
                <div class="row mx-auto pt-3 col-12 border rounded confirmation-wrapper">
                    <h3 class="mb-3"> Orderbekräftelse</h3>
                    <div class="customer-info col text-center mx-5">
                        <p><strong>Beställare</strong><br>${customerData.customer_first_name} ${customerData.customer_last_name}</p>
                        <p><strong>Leveransadress</strong><br>${customerData.customer_address}, ${customerData.customer_postcode}, ${customerData.customer_city}</p>
                        <p><strong>Kontaktuppgifter</strong><br>Telefon: ${customerData.customer_phone}<br>Email: ${customerData.customer_email}
                    </div>
                    <div class="order-details col text-center mx-5">
                        <p><strong>Ordernummer</strong><br>${orderInfo.data.id}</p>
                        <p><strong>Beställningsdatum</strong><br>${orderInfo.data.order_date}</p>
                        <p><strong>Betalt</strong><br>${orderInfo.data.order_total} kr</p>
                    </div>
                    <ul class="list-group item-container px-0"></ul>
                </div>
                
            `
            // prints every ordered item to order confirmation
            cartItems.forEach(product => {
                dqs('.item-container').innerHTML += `
                    <li class="list-group-item d-flex align-items-center col-12">
                        <img class="confirmation-img col-4 img-fluid mx-auto" src="https://www.bortakvall.se/${product.images.thumbnail}" alt="${product.name}">
                        <p class="col-4 my-auto">${product.name}<br>x ${product.qty}</p>
                        <p class="col-4 my-auto">Total<br>${product.qty*product.price} kr</p>
                    </li>
                `
            })

            // button for closing the page
            dqs('.order-confirmation').innerHTML += `
                <p class="mt-5 text-muted">Du kan nu stänga sidan!</p>
                <button class="btn btn-dark close mb-5">Återgå</button>
            `

            // when closing page, site is refreshed and cart and localStorage shopping cart reset
            dqs('.close').addEventListener('click', () => {
                window.location.reload()
                localStorage.removeItem('Total price')
                localStorage.removeItem('Shopping cart')
            })
        }
        // if post errror occurs, print error message
        catch {
            errorWarning()
        }
  }
    await orderConfirmation()
})


// remove saved customer data when reset button is clicked
dqs('.customer-details').addEventListener('reset', () => {
    localStorage.removeItem('Customer data')
})

// go back to product page once back button is clicked
dqs('.back-button').addEventListener('click', () => {
    display('.content-display')
    display('#title-cart')
    display('#main')
    display('footer')
    hide('.order-content-wrap')
    hide('.customer-details')
    hide('.back-button')
    dqs('.content-wrapper').classList.remove('banner-checkout')

    // empty HTML before checkout() runs again
    dqs('#order-content').innerHTML = ''
})

/* functions that are called when the page loads */
getProducts()
renderCart()
