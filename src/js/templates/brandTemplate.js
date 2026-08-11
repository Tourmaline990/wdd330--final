export function BrandTemplate(brand) {
  return `
    <a href="../category/index.html?q=${brand.brand}" class="hashyper">
    <div>
     <img src="${brand.src}" alt = "${brand.alt}" loading="lazy">
     <p>${brand.brand} store </p>
     </div>
   </a>
   `;
}
//
//
