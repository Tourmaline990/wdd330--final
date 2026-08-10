export function OrderHistoryTemplate(item) {
  return `
     <section class="contained">
         <p>Date Ordered <span> ${new Date(item.orderDate).toLocaleString()}</span> </p>
         <p>Tax & Shipping  <span>$${item.shipping + item.tax}</span></p>
         <p>Order Total <span>$${Number(item.total).toFixed(2)} </span></p>
          <h2 class="dpdown"> Order Items </h2>
          <article class="ctl"> ${forItems(item.items)} </article>
     </section>
   `;
}

function forItems(item) {
  let callback = (it) => `<div class="order-it"> 
    <p> ${it.name} </p>
    <p> ${it.qty} </p>
    <p> $${it.price} </p>
    </div>`;
  return item.map(callback).join("");
}
