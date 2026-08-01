// imports
import { LoadPartials } from "./utility.mjs";
import { GetUrlParams } from "./utility.mjs";
import Api from "./api.mjs";
import { MapTemplate } from "./utility.mjs";
import { ProductDetailsTemplate } from "../js/templates/productTemplate";
import { Render } from "./utility.mjs";

async function Init(){
  // partials display
LoadPartials("../public/partials/footer.html", "footer");
LoadPartials("../public/partials/head.html", "head", false);
LoadPartials("../public/partials/header.html", "header", false);

//env's
const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;

// initialization
const dummyjson = new Api(dummyJsonUrl);
const allProducts = await dummyjson.GetAllProducts();

// dom
const container = document.querySelector("#container");
const highlight = document.querySelector(".highlight");

//
let query = GetUrlParams("q");
if (!Number.isNaN(Number(query))) {
  query = Number(query);
  let product = await dummyjson.SearchById(query);
  highlight.innerHTML = product.title;
  product = ProductDetailsTemplate(product);
  Render(product, container, "beforeend", true, false);
} else {
  let product = await dummyjson.SearchByProductName(query);
  highlight.innerHTML = query;
  product = MapTemplate(product.products, ProductDetailsTemplate);
  Render(product, container, "beforeend");
}

}
Init()
