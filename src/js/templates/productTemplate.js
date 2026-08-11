export function ProductDetailsTemplate(product) {
  return ` 
       <div class="wrapper">
          <div class="imageContainer"> 
            ${ItemsLoop(product.images).join("")}
          </div>
          <div class="scrollbar">
               <div class="thumb"></div>
          </div>
      </div>
        <h2>${product.title}</h2>
        <div class='tags'>
        <p class="brand">Brand: <span>${brand(product.brand)}<span></p>
        <p class="instock"><span>${Instock(product.availabilityStatus)}<span></p>
        </div>
        <div class='units'>
        <p class='p'>$${product.price}</p>
        <p class='stock'> <span>${product.stock}</span> units left </p>
        </div>
        <p>${product.description}</p>
        <p class='r'>${product.returnPolicy}</p>
        <p>${product.shippingInformation}</p>
        <p>${product.warrantyInformation}</p>
        <div class="ting">Product Rating: <div class='forstar'>${rating(product.rating)}</div></div>
        <h3>Reviews</h3>
           <div class="reviews">
                ${ItemsLoop(product.reviews, false).join("")}
           </div>
        <button hidden class="holdsId">${product.id}</button>
   `;
}

export function BriefProductDisplay(product) {
  return ` 
   <a href="../productPage/index.html?q=${product.id}" class="hashyper brief">
    <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
     <h2> ${product.title} </h1>
     <p> $${product.price} </p>
     ${Instock(product.availabilityStatus)}
     <button hidden class="holdsId">${product.id}</button>
   </a>
   `;
}
function Instock(status) {
  if (status.toLowerCase() === "in stock") {
    return `<p class='instock in'>${product.availabilityStatus}</p>`;
  } else if (status.toLowerCase() === "low stock") {
    return `<p class='instock low'>${product.availabilityStatus}</p>`;
  } else {
    return `<p class='instock not'>${product.availabilityStatus}</p>`;
  }
}
function ItemsLoop(key, image = true) {
  let arr = [];
  if (!image) {
    for (let i = 0; i < key.length; i++) {
      arr[i] = `<div>
            <p>${key[i].comment}</p>
            <p class="date">${new Date(key[i].date).toDateString()}</p>
            <p>By ${key[i].reviewerName}</p>
            <p class="rev">${rating(key[i].rating)}</p>
            <p class="green">verified purchase</p>
           </div>`;
    }
    return arr;
  }

  for (let i = 0; i < key.length; i++) {
    arr[i] = `<img src="${key[i]}" alt="image icon" loading="lazy">`;
  }
  return arr;
}
function rating(rating) {
  let ratingnum = Math.floor(Number(rating));
  let arr = [1, 2, 3, 4, 5];
  arr = arr.map((i, index) => {
    if (index <= ratingnum) {
      return inputTemplate(true);
    }
    return inputTemplate();
  });
  return arr.join("");
}
function inputTemplate(num = false) {
  if (num) {
    return `
     <label class="star">
      <input type="checkbox">
       <span class="yellow">&#9733;<span>
     </label>  `;
  } else {
    return `
     <label class="star">
      <input type="checkbox">
       <span>&#9733;<span>
     </label>  `;
  }
}
function brand(brand) {
  if (brand === undefined) {
    return `N/A`;
  }
  return brand;
}
