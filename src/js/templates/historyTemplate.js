export function OrderHistoryTemplate(item) {
  return `
     <section>
         <p> ${new Date(item["order-date"]).toLocaleString()} </p>
         <p>Tax & Shipping  $${item.shipping + item.tax}</p>
         <p> ${Number(item.total).toFixed(2)} </p>
          ${forItems(item.items)}
     </section>
   
   `;
}

function forItems(item) {
  let callback = (it) => `<div> 
    <p> ${it.name} </p>
    <p> ${it.qty} </p>
    <p> $${it.price} </p>
    </div>`;
  return item.map(callback).join("");
}
