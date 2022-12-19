import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'

import { fetchProducts } from "./api"
import { IData, IProduct } from "./interface"

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
<div class="product-cards row col-3 my-5 bg-white>
    <div class="product-wrap">
        <img src="https://www.bortakvall.se${prod.images.thumbnail}" alt="${prod.name}" class="card-img-top card-img">
        <div class="card-body">
            <p id="product-name" class="card-title text-dark">${prod.name}</p>
            <p id="product-price" class="card-text text-dark">${prod.price} kr</p>
            <button type="" class="btn btn-warning py-2" id="${prod.id}" value="${prod.id}">Lägg till i<br> varukorg</button>
        </div>
    </div>
</div>

 `).join('')
}

getProducts()
