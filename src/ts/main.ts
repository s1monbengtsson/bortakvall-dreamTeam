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

    document.querySelector('.product-main')!.innerHTML = products.data
        .map( prod => `
            <div class="product-cards row col-3 my-5 bg-white>
                <div class="product-wrap"  data-product-id="${prod.id}">
                    <img src="https://www.bortakvall.se${prod.images.thumbnail}" alt="${prod.name}" class="card-img-top card-img product-wrap-child" data-product-id="${prod.id}">

                    <div class="card-body product-wrap-child" data-product-id="${prod.id}">
                        <p id="product-name" class="card-title text-dark product-wrap-child" data-product-id="${prod.id}">${prod.name}</p>

                        <p id="product-price" class="card-text text-dark product-wrap-child" data-product-id="${prod.id}">${prod.price} kr</p>
                        
                        <button class="btn btn-warning py-2 product-wrap-child" data-product-id="${prod.id}">Lägg till i<br> varukorg</button>
                    </div>
                </div>
            </div>
        `)
        .join('')
}

getProducts()



// Click event on each product
document.querySelector('main')?.addEventListener('click', e => {
    const target = e.target as HTMLElement

    // console.log(target.className)

    if (target.className.includes('product-wrap' || 'product-wrap-child')) {

        if (target.tagName === 'BUTTON') {
            console.log('added to cart')
            // addToCart()

            const productId = Number(target.dataset.productId)
            console.log('product id:', productId)
        }
        else {
            console.log('viewing product')
            // showInfo()

            const productId = Number(target.dataset.productId)
            console.log('product id:', productId)
        }
    }
})

