import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'

import { fetchProducts } from "./api"
import { IData, IProduct } from "./interface"

let products: IData
// let products: IProduct[] = []

const getProducts = async () => {
  products = await fetchProducts()
  console.log(products)
  renderProducts()
  
}

const renderProducts = () => {

    // console.log(products.data)

    const mainEl = document.querySelector('.product-main')!
    
    mainEl.innerHTML = products.data
        .map( prod => `
            <div class="product-wrap">
                <img class="product-img"  src="https://www.bortakvall.se${prod.images.thumbnail}" alt="${prod.name}">

                <p class="product-p" id="product-name">${prod.name}<span id="price">${prod.price}<span>kr</span></span></p>

                <button class="product-btn" type="" id="${prod.id}">Lägg till i<br> varukorg</button>
            </div>
        `)
        .join('')
}

getProducts()



// Click event on each product
document.querySelector('main')?.addEventListener('click', e => {
    const target = e.target as HTMLElement

    // console.log(e)

    if (target.className === 'product-wrap'
        || target.className === 'product-img'
        || target.className === 'product-p'
        || target.className === 'product-btn') {

        // console.log(target.className)

        if (target.tagName === 'BUTTON') {
            // addToCart()
            console.log('added to cart')
        }
        else {
            // showInfo()
            console.log('view prodoct')
        }
    }
})

// const cart: IProduct[] = []

// const addToCart = async () => {
//     console.log(await fetchProducts())


// }

// // addToCart()
