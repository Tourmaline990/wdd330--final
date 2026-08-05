export function CartTemplate(item) {
  return `
      <div class="cartItem">
      <img src="${item.p_id.images[0]}" alt="${item.p_id.title}" loading="lazy">
      <h1> ${item.p_id.title}</h1>
      <p id="item cost">${item.price}</p>
      <p> ${item.p_id.availabilityStatus} </p>
      <p> Quantity: ${item.qty} </p>
       <div>
       <img src="/images/svgs/trash.svg" alt= "remove" loading="lazy">
       <button class="remove">Remove</button>
       </div>
      <button title="increase item" class="increase"> + </button>
      <button title="reduce item" class="decrease">-</button>
      <p hidden class="id">${item.p_id.id}</p>
      </div>
   `;
}
