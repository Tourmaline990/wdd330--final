export function CartTemplate(item) {
  return `
      <article class="cartItem">
      <img src="${item.p_id.images[0]}" alt="${item.p_id.title}" loading="lazy">
      <div class='info'>
      <h4> ${item.p_id.title}</h1>
      <p id="item cost">$${item.price}</p>
      <p> ${item.p_id.availabilityStatus} </p>
      </div>
       <div class="removectrl">
       <img src="/images/svgs/trash.svg" alt= "remove" loading="lazy">
       <button class="remove">Remove</button>
       </div>
       <div class="numctrl">
         <button title="increase item" class="increase"> + </button>
         <p> ${item.qty} </p>
         <button title="reduce item" class="decrease">-</button>
      </div>
      <p hidden class="id">${item.p_id.id}</p>
      </article>
   `;
}
export function Li(da) {
  return `<li class="cityname">${da} </li>`;
}

export function searchTemplate(data) {
  return `
     <li class="acountry"> <img src = "${data.flag.url_png}" alt="${data.names.common}" loading = "lazy"> <span> ${data.names.common} </span> </li>
   `;
}
export function SelectOptionTemplate(state) {
  return `
     <option value=${state.name}> ${state.name}</option>
   `;
}
export function CheckoutTp(product) {
  return `
      <p> <span> ${product.name} </span> <span> $${product.price} </span>
   `;
}
