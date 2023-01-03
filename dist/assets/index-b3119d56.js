(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const v of c.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&r(v)}).observe(document,{childList:!0,subtree:!0});function o(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerpolicy&&(c.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?c.credentials="include":a.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(a){if(a.ep)return;a.ep=!0;const c=o(a);fetch(a.href,c)}})();const T="https://www.bortakvall.se/api",E="/products",O="/orders",x=async()=>{const t=await fetch(`${T}${E}`);if(!t.ok)throw document.querySelector("#nav-output").innerHTML=`<h2 class="nav-item px-2">${t.status} ${t.statusText}</h2>`,new Error(`Could not get data, reason: ${t.status} ${t.statusText}`);return await t.json()},M=async t=>{const e=await fetch(`${T}${O}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw new Error(`${e.status} ${e.statusText}`);return await e.json()},s=t=>document.querySelector(`${t}`),l=t=>s(t).classList.add("d-none"),d=t=>s(t).classList.remove("d-none"),A=s(".customer-details"),b=s("#customer-first-name"),k=s("#customer-last-name"),y=s("#customer-address"),h=s("#customer-postal-number"),w=s("#customer-city"),$=s("#customer-phone"),L=s("#customer-email");let m,f=localStorage.getItem("Shopping cart")??"[]",i=JSON.parse(f),P=localStorage.getItem("Total price")??"0",p=JSON.parse(P),H=localStorage.getItem("Customer data")??"[]",n=JSON.parse(H);const S=()=>{s("#cart-item-count").textContent=String(i.map(t=>t.qty).reduce((t,e)=>t+e,0)),localStorage.setItem("Shopping cart",JSON.stringify(i)),R()},u=()=>{S(),j(),q()},q=()=>{s("#cart-total").textContent=`${p}kr`},R=()=>{p=[0,...i.map(t=>t.price*t.qty)].reduce((t,e)=>e+=t),localStorage.setItem("Total price",JSON.stringify(p))},I=async t=>(await x()).data.find(o=>t===o.id),g=t=>i.find(e=>e.id===t),j=()=>{s("#cart-list").innerHTML=i.map(t=>`
            <li class="cart-item">
                <img class="cart-image" src="https://www.bortakvall.se${t.images.thumbnail}" alt="${t.name}">
                <div class="card-body cart-descript">
                    <p class="card-title text-dark">${t.name}</p>
                    <p class="cart-adjust">
                        <span data-product-id="${t.id}" class="decrease">-</span>
                        <input class="prod-qty" data-input-id="${t.id}" id="input-${t.id}" value="${t.qty}" style="width: 30px; text-align: center">
                        <span data-product-id="${t.id}" class="increase">+</span>
                    </p>
                    <p class="card-text-cart text-dark cart-item-price">${t.price} kr/st  </p>
                    <p class="card-text-cart text-dark" id="item-price-${t.id}">${t.price*t.qty} kr</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-x-circle cart-remove-item" data-product-id="${t.id}" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </li>
        `).join(""),i.length===0?s("#checkout-btn").setAttribute("disabled","disabled"):s("#checkout-btn").removeAttribute("disabled")};s("#cart-list").addEventListener("keyup",t=>{const e=t.target,o=Number(e.dataset.inputId);if(!o)return;const r=g(o),a=s(`#input-${o}`);r.qty=Number(a.value),S();const c=s(`#item-price-${o}`);c.textContent=`${r.price*r.qty} kr`,q()});s("#cart-list").addEventListener("focusout",t=>{const e=t.target,o=Number(e.dataset.inputId);if(!o)return;const r=g(o);r.qty>0||(i.splice(i.indexOf(r),1),u())});s("#cart-list").addEventListener("click",async t=>{const e=t.target,o=Number(e.dataset.productId);if(!o)return;const r=g(o);e.tagName==="svg"?r.qty=0:e.className.includes("increase")?C(r):e.className.includes("decrease")&&r.qty--,r.qty>0||i.splice(i.indexOf(r),1),u()});const B=async()=>{d("#spinner");try{m=await x(),D()}catch{s("#output").innerHTML='<h2 class="nav-item px-2">🚨 KUNDE INTE HÄMTA DATA FRÅN SERVER 🚨 <br> försök igen senare...</h2>',s("#main").innerHTML='<h2 class="p-5">❌</h2>'}l("#spinner")},D=()=>{const t=m.data.map(e=>e.stock_status).filter(e=>e==="instock").length;s("#output").innerHTML=`Vi har ${t} st av ${m.data.length} st produkter i lager`,m.data.sort((e,o)=>e.name.localeCompare(o.name)),s(".product-main").innerHTML=m.data.map(e=>`
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 product-cards">
            <div class="card product-wrap border-0">
                <img src="https://www.bortakvall.se${e.images.thumbnail}" alt="${e.name}" class="card-img-top card-img product-click-event" data-product-id="${e.id}">
                <div class="card-body">
                    <p class="card-title product-click-event" data-product-id="${e.id}">${e.name}</p>
                    <p class="card-text text-dark">${e.price} kr</p>
                    <p class="info-icon-wrap product-click-event">     
                        <svg xmlns="http://www.w3.org/2000/svg" class="product-click-event bi bi-info-square info-icon" data-product-id="${e.id}" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
                            <path class="product-click-event" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path class="product-click-event" d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                    </p>
                    <button class="product-click-event product-btn ${e.stock_status==="outofstock"?"product-btn-outofstock":""}" data-product-id="${e.id}" ${e.stock_status==="outofstock"?"disabled":""}>
                        ${e.stock_status==="outofstock"?"SLUT I LAGER":"LÄGG TILL I VARUKORG"}
                    </button>
                    <p class="stock-qty">Antal i lager: ${e.stock_quantity===null?"0":e.stock_quantity} </p>
                </div>
            </div>
        </div>
    `).join("")},U=t=>{s("#no-more-candy").innerHTML=`<p>${t.name}<br> är inte längre tillgängligt.</p>`,d("#no-more-candy"),setTimeout(()=>{l("#no-more-candy")},2e3)},N=t=>{const e=t.id,o=i.map(a=>a.id),r=g(e);!r||!o.includes(e)?(t.qty=1,i.push(t)):o.includes(e)&&C(r),s("#title-cart").classList.add("shake"),setTimeout(()=>{s("#title-cart").classList.remove("shake")},950)},C=t=>{if(t.stock_quantity>t.qty)t.qty++;else{U(t);return}};s("main").addEventListener("click",async t=>{var a;const e=t.target,o=Number(e.dataset.productId),r=await I(o);(a=e.getAttribute("class"))!=null&&a.includes("product-click-event")&&(e.tagName==="BUTTON"?(N(r),u()):(G(r),document.body.style.overflow="hidden"))});s("#title-cart").addEventListener("click",()=>{s(".cart-background").classList.add("show"),document.body.style.overflow="hidden"});s("#cart-close").addEventListener("click",()=>{s(".cart-background").classList.remove("show"),document.body.style.removeProperty("overflow")});s("#clear-cart-btn").addEventListener("click",async()=>{localStorage.removeItem("Shopping cart"),f=localStorage.getItem("Shopping cart")??"[]",i=JSON.parse(f),u(),setTimeout(()=>{s(".cart-background").classList.remove("show"),document.body.style.removeProperty("overflow")},500)});const G=t=>{d(".info-background"),s(".info-background").classList.add("show-info"),s("#info-section").innerHTML=`    
        <div class="info-section-l">
            <img src="https://www.bortakvall.se/${t.images.large}" alt="${t.name}" class="info-img">
            <p class="info-name" class="mt-3">
                ${t.name}
                <span class="info-price">
                    ${t.price}
                    <span>kr</span>
                </span>
            </p>
            <button class="product-btn m-2 p-2 ${t.stock_status==="outofstock"?"product-btn-outofstock":""}" data-product-id="${t.id}" style="font-weight: bold;" ${t.stock_status==="outofstock"?"disabled":""}>${t.stock_status==="outofstock"?"SLUT I LAGER":"LÄGG TILL I VARUKORG"}</button>
            <p class="stock-qty">Antal i lager: ${t.stock_quantity===null?"0":t.stock_quantity} </p>
        </div>
        <div class="info-section-r">
            <h3>Beskrivning</h3>
            ${t.description}
            <p class="info-close">
                <svg class="bi-x-lg close-info" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z">
                </svg>
            </p>
        </div>
    `};s(".info-background").addEventListener("click",async t=>{const e=t.target,o=Number(e.dataset.productId),r=await I(o);e.tagName==="BUTTON"?(N(r),u(),document.body.style.removeProperty("overflow")):(e.tagName==="svg"||e.tagName==="path"||e.className.includes("info-background"))&&(l(".info-background"),document.body.style.removeProperty("overflow"))});const J=()=>{window.scrollTo(0,0),window.scrollTo(0,0),l(".content-display"),l("#title-cart"),l("#main"),l("footer"),d(".order-content-wrap"),d(".customer-details"),d(".back-button"),s(".content-wrapper").classList.add("banner-checkout"),s(".cart-background").classList.remove("show"),i.map(t=>{document.body.style.removeProperty("overflow");let e=t.price*t.qty;s("#order-content").innerHTML+=`
            <li class="list-group-item d-flex justify-content-between align-items-center text-center rounded col-12">
                <img src="https://www.bortakvall.se/${t.images.thumbnail}" alt="${t.name}" class="checkout-img col-3">
                <p class="col-3">${t.name}<br>x ${t.qty}</p><p class="col-3">Á pris: <br>${t.price} kr</p><p class="col-3">Total:<br> ${e} kr</p>
            </li>
        `}),s("#order-content").innerHTML+=`
        <h3 class="text-center mt-4">Att betala: ${p} kr</h3>
    `},z=()=>{d(".customer-details"),b.value=n.customer_first_name??"",k.value=n.customer_last_name??"",y.value=n.customer_address??"",h.value=n.customer_postcode??"",w.value=n.customer_city??"",$.value=n.customer_phone??"",L.value=n.customer_email??""},F=()=>{n={customer_first_name:b.value,customer_last_name:k.value,customer_address:y.value,customer_postcode:h.value,customer_city:w.value,customer_phone:$.value,customer_email:L.value};const t=JSON.stringify(n);localStorage.setItem("Customer data",t)};s("#checkout-btn").addEventListener("click",()=>{J(),z(),s("#checkout-btn").blur()});const V=()=>{document.querySelector(".order-confirmation").innerHTML=`
        <div class="alert alert-danger">Your order could not be placed. Please try again</div>
    `};let _=!1;A.addEventListener("submit",async t=>{t.preventDefault(),F(),_=!0,_&&s(".send-order").setAttribute("disabled","disabled");const e=i.map(a=>({product_id:a.id,qty:a.qty,item_price:a.price,item_total:a.price*a.qty})),o={customer_first_name:b.value,customer_last_name:k.value,customer_address:y.value,customer_postcode:h.value,customer_city:w.value,customer_email:L.value,customer_phone:$.value,order_total:p,order_items:e};await(async()=>{window.scrollTo(0,0);const a=await M(o);try{l(".checkout-wrap"),l(".back-button"),s(".order-confirmation").innerHTML+=`
                <h2 class="mb-3"> Tack för din beställning!</h2>
                <div class="row mx-auto pt-3 col-12 border rounded confirmation-wrapper">
                    <h3 class="mb-3"> Orderbekräftelse</h3>
                    <div class="customer-info col text-center mx-5">
                        <p><strong>Beställare</strong><br>${n.customer_first_name} ${n.customer_last_name}</p>
                        <p><strong>Leveransadress</strong><br>${n.customer_address}, ${n.customer_postcode}, ${n.customer_city}</p>
                        <p><strong>Kontaktuppgifter</strong><br>Telefon: ${n.customer_phone}<br>Email: ${n.customer_email}
                    </div>
                    <div class="order-details col text-center mx-5">
                        <p><strong>Ordernummer</strong><br>${a.data.id}</p>
                        <p><strong>Beställningsdatum</strong><br>${a.data.order_date}</p>
                        <p><strong>Betalt</strong><br>${a.data.order_total} kr</p>
                    </div>
                    <ul class="list-group item-container px-0"></ul>
                </div>
                
            `,i.forEach(c=>{s(".item-container").innerHTML+=`
                    <li class="list-group-item d-flex align-items-center col-12">
                        <img class="confirmation-img col-4 img-fluid mx-auto" src="https://www.bortakvall.se/${c.images.thumbnail}" alt="${c.name}">
                        <p class="col-4 my-auto">${c.name}<br>x ${c.qty}</p>
                        <p class="col-4 my-auto">Total<br>${c.qty*c.price} kr</p>
                    </li>
                `}),s(".order-confirmation").innerHTML+=`
                <p class="mt-5 text-muted">Du kan nu stänga sidan!</p>
                <button class="btn btn-dark close mb-5">Återgå</button>
            `,s(".close").addEventListener("click",()=>{window.location.reload(),localStorage.removeItem("Total price"),localStorage.removeItem("Shopping cart")})}catch{V()}})()});s(".customer-details").addEventListener("reset",()=>{localStorage.removeItem("Customer data")});s(".back-button").addEventListener("click",()=>{d(".content-display"),d("#title-cart"),d("#main"),d("footer"),l(".order-content-wrap"),l(".customer-details"),l(".back-button"),s(".content-wrapper").classList.remove("banner-checkout"),s("#order-content").innerHTML=""});B();u();
