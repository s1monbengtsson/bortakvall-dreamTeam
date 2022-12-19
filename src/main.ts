import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

import { fetchProducts } from "./ts/api"
import { IData, IProduct } from "./ts/interface"

let products: IData[] = []
// let products: IProduct[] = []
const getProducts = async () => {
  products = await fetchProducts()
  renderProducts()
}

const renderProducts = () => {
  console.log(products)
  console.log(products.status)
  console.log(products.data)
document.querySelector('.product-main')!.innerHTML = products.data.map( prod => `
<div class="product-wrap">
<img src="https://www.bortakvall.se${prod.images.thumbnail}" alt="${prod.name}">
  <p id="product-name">${prod.name}<span id="price">${prod.price}<span>kr</span></span></p>
  <button type="" id="${prod.id}">Lägg till i<br> varukorg</button>
</div>
 `).join('')
}

getProducts()
