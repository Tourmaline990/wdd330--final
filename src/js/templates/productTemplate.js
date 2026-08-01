export function ProductDetailsTemplate(product) {
  return `<a href="../productPage/index.html?q=${product.id}"> 
        <div class="imageContainer"> 
           ${ItemsLoop(product.images).join("")}
        </div>
        <h1>${product.title}</h1>
        <p>${product.description}</p>
        <p>${product.price}</p>
        <p>${product.returnPolicy}</p>
        <p>${product.stock} left </p>
        <p>Rating: ${product.rating}</p>
        <h2>Reviews</h2>
           <div class="reviews">
                ${ItemsLoop(product.reviews, false).join("")}
           </div>
        <p>${product.shippingInformation}</p>
        <p>${product.warrantyInformation}</p>
   </a>`;
}

export function BriefProductDisplay(product) {
  return `<a href="../productPage/index.html?q=${product.id}"> 
    <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
     <h1> ${product.title} </h1>
     <p> ${product.price} </p>
   </a>
   `;
}
function ItemsLoop(key, image = true) {
  let arr = [];
  if (!image) {
    for (let i = 0; i < key.length; i++) {
      arr[i] = `<div>
            <p>${key[i].comment}</p>
            <p>${key[i].date}</p>
            <p>${key[i].reviewerName}</p>
            <p>${key[i].rating}</p>
           </div>`;
    }
    return arr;
  }

  for (let i = 0; i < key.length; i++) {
    arr[i] = `<img src="${key[i]}" alt="image icon" loading="lazy">`;
  }
  return arr;
}
