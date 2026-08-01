// Imports
import { LoadPartials, Randomize, Render } from "./utility.mjs";
import { ProductDetailsTemplate } from "../js/templates/productTemplate";
import { MapTemplate } from "./utility.mjs";
import FetchJson from "../js/fetch-json.mjs";
import Api from "./api.mjs";
import { GetUrlParams } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import { LimitArray } from "./utility.mjs";
import { BrandTemplate } from "../js/templates/brandTemplate";
import { BriefProductDisplay } from "../js/templates/productTemplate";
import { PromotionTemplate } from "../js/templates/promotion";
import { CategoryTemplate } from "../js/templates/promotion";
import { ArrayPrep } from "./utility.mjs";

async function Init(){
  // Partials Display
LoadPartials("/partials/footer.html", "footer");
LoadPartials("/partials/head.html", "head", false);
LoadPartials("/partials/header.html", "header", false);

// env's
const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;
const promotionPath = import.meta.env.VITE_JSON_PROMOTION_PATH;
const brandPath = import.meta.env.VITE_BRAND_PATH;

// Dom Selection
const category = document.querySelector("#category");
const promotion = document.querySelector("#promotions");
const searchIcon = document.querySelector("#searchIcon");
const searchInput = document.querySelector("#search");
const form = document.querySelector("#searchform");
const lastViewed = document.querySelector("#lastViewed");
const lastSearched = document.querySelector("#lastSearched");
const topSellers = document.querySelector("#topSellers");
const limitedStocks = document.querySelector("#limited");
const brandsStore = document.querySelector("#brandsStore");
const contain = document.querySelector(".viewedgroup");
const contain1 = document.querySelector(".searchedgroup");

// Initialization
const dummyjson = new Api(dummyJsonUrl);
const promotionjson = new FetchJson(promotionPath);
const storage = new DataStorage();
storage.init();
const allProducts = await dummyjson.GetAllProducts();
const brandJson = new FetchJson(brandPath);

// searchBar

// form.addEventListener("keydown",(event) => {event.preventDefault()})
searchIcon.addEventListener("click", SearchBar);
searchIcon.addEventListener("keydown", SearchBar);

function SearchBar() {
  if (searchInput.value.trim() === "" || searchInput.value === null) {
    return;
  }
  window.location.href = `../productPage/index.html?q=${searchInput.value}`;
}

// Promotion
await promotionjson.RenderData(promotion, "afterbegin", PromotionTemplate);

// categories
const val = await promotionjson.RenderData(
  category,
  "beforeend",
  CategoryTemplate,
  8,
);

// last viewed display
const viewed = storage.Get("viewed");

if (viewed === undefined || viewed.length === 0) {
  contain.querySelector("h1").textContent = "Sponsored Products";
  contain.querySelector("a").href = "../category/index.html?q=randoms";
  let sponsored = ArrayPrep(allProducts.products, BriefProductDisplay, 15);
  Render(sponsored, lastViewed, "beforeend");
} else {
  contain.querySelector("h1").textContent = "Last Viewed";
  contain.querySelector("a").href = "../category/index.html?q=viewed";
  let arr = await dummyjson.GetProductsById(viewed);
  arr = ArrayPrep(arr, BriefProductDisplay, 8);
  Render(arr, lastViewed, "beforeend");
}

// last searched display
const searched = storage.Get("searched");
if (searched.length === 0 || searched === undefined) {
  contain1.querySelector("h1").textContent = "Deals From Around The World";
  contain1.querySelector("a").href = `../category/index.html?q=world`;
  let arr = ArrayPrep(allProducts.products, BriefProductDisplay, 15);
  Render(arr, lastSearched, "Beforeend");
} else {
  contain1.querySelector("h1").textContent = "Last Searched";
  contain1.querySelector("a").href = "../category/index.html?q=searched";
  let arr = await dummyjson.GetProductsById(searched);
  arr = ArrayPrep(arr, BriefProductDisplay, 8);
  Render(arr, lastSearched, "beforeend");
}

// Top Sellers

let top = allProducts.products.filter((product) => {
  return product.rating >= 4;
});
top = ArrayPrep(top, BriefProductDisplay, 10);
Render(top, topSellers, "beforeend");

// limited stocks
let limited = allProducts.products.filter((product) => {
  return product.stock <= 10;
});
limited = ArrayPrep(limited, BriefProductDisplay, 12);
Render(limited, limitedStocks, "beforeend");

// brands store
brandJson.RenderData(brandsStore, "beforeend", BrandTemplate, 10);

}
Init()
