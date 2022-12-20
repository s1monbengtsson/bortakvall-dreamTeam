/**
 ********************************************************************************
 * IMPORTS
 */


import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'

import { fetchProducts } from "./api"
import { IData, IProduct } from "./interface"


/**
 ********************************************************************************
 * VARIABLES
 */

let products: IData
// let products: IProduct[] = []

const jsonCart = localStorage.getItem('Shopping cart') ?? '[]'
const cart: IProduct[] = JSON.parse(jsonCart)


/**
 ********************************************************************************
 * FUNCTIONS
 */


const renderCart = async () => {
    document.querySelector('#cart-list')!.innerHTML = cart
    .map(item => `
        <li class="cart-item">
            <img class="cart-image" src="https://www.bortakvall.se${item.images.thumbnail}" alt="${item.name}">
            <div class="card-body" data-product-id="${item.id}">
                <p class="card-title text-dark" data-product-id="${item.id}">${item.name}</p>
                <p class="card-text text-dark" data-product-id="${item.id}">${item.price} kr</p>
            </div>
            <button class="btn btn-danger" remove-cart-item>X</button>
        </li>
    `)
    .join('')
}

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
}

// Allt denna funktion ska göra är att hitta produkten man clickar på
const findClickedProduct = async (clickedId: number): Promise<IProduct> => {

    const products = await fetchProducts()
    const foundProduct: IProduct = products.data.find(prod => clickedId === prod.id) as IProduct
    // console.log('foundProduct:', foundProduct)
    return foundProduct
}

const saveCart = () => {
    localStorage.setItem('Shopping cart', JSON.stringify(cart))
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
            console.log('added to cart')

            cart.push(clickedProduct)
            saveCart()
            renderCart()
        }
        // Om man klickar någon annan stans på produkten. (info)
        else {
            console.log('viewing product')

            renderInfo(clickedProduct)
        }
    }
})


/**
 ********************************************************************************
 * START
 */


getProducts()
renderCart()


// start info-section
const renderInfo = (productInfo: IProduct) => {
    document.querySelector('.info-background')!.classList.remove('d-none')
    document.querySelector('.info-background')!.classList.add('show-info')
    document.querySelector('#info-section')!.innerHTML = `    
        <div class="info-section-l">
            <img src="https://www.bortakvall.se/${productInfo.images.large}" alt="${productInfo.name}" class="my-4 info-img">
            <p class="info-name" class="mt-3">${productInfo.name}<span class="info-price">${productInfo.price}<span>kr</span></span></p>
            <button class="btn btn-warning m-2 p-2" data-prod-id="${productInfo.id}">Lägg till i varukorg</button>
        </div>
        <div class="mt-3 info-section-r"><h3 class="p-4">Beskrivning</h3>${productInfo.description}
            <p class="info-close"><i class="bi bi-x-lg"></i></p>
        </div>
    `
}

document.querySelector('.info-background')!.addEventListener('click', async e => {
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON') {
        const clickedId = Number(target.dataset.prodId)
        const clickedProduct = await findClickedProduct(clickedId)
        
        cart.push(clickedProduct)
        saveCart()
        renderCart()

        document.querySelector('.info-background')!.classList.add('d-none')
    }
    else {
        document.querySelector('.info-background')!.classList.add('d-none')
    }
})
// end info-section