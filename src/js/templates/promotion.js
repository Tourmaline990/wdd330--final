export function PromotionTemplate(obj) {
  return `<a href="../category/index.html?q=${splitArray(obj.filter.categories)}" class="hashyper">
         <section class="promotion">
         <img src="${obj.src}" alt="${obj.alt}" loading="lazy">
          <h1>${obj.title}</h1>
          <p>${obj.subtitle}</p>
          <span>${obj.discount}</span>
      </section> </a>`;
}

export function CategoryTemplate(obj) {
  return `<a href="../category/index.html?q=${splitArray(obj.filter.categories)}" class="hashyper">
     <img src="${obj.src}" alt="${obj.alt}" loading="lazy" class="image">
      <h1>${obj.filter.categories[0]}</h1>
   </a>
   `;
}
function splitArray(arr) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    result += `${arr[i]},`;
  }
  return result;
}
