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

// start info-section
const renderInfo = (x) => {
  const temp = products.data[0] // changes to what user clicked on, dataset.Setid?
  document.getElementById('#info-section')!.innerHTML = `    
  <div class="info-section-l">
      <img src="https://www.bortakvall.se/${temp.image.large}" alt="${temp.name}" class="mt-3 info-img">
      <p id="product-name" class="mt-3">${temp.name}<span id="price">${temp.name}<span>kr</span></span></p>
      <button class="btn btn-warning m-2" value="${temp.id}">Lägg till i varukorg</button>
  </div>
    <div class="mt-3 info-section-r"><h3 class="p-4">Beskrivning</h3>${temp.description}
  </div>
  `
}
// end info-section