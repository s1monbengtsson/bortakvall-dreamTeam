import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'

import { fetchProducts } from "./api"
import { IData } from "./interface"

let products: IData[] = []
// let products: IProduct[] = []
const getProducts = async () => {
  products = await fetchProducts()
  renderProducts()
  renderInfo() // temp.  info-section, should only run when user clicked on product div
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
// start info-section
const renderInfo = () => {
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
getProducts()

