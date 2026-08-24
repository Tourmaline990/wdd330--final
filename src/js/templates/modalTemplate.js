export const added =
     `<p> Product added successfully </p>`

export function cartDuplicate(product) {
  return `<p> <span class="highlight">${product.title}</span> already in cart,add or increase quantity</p>`
}