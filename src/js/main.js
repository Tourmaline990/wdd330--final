// Imports
import { LoadPartials,  Render } from "./utility.mjs";
import FetchJson from "../js/fetch-json.mjs";
import Api from "./api.mjs";
import DataStorage from "./Datastorage.mjs";
import { BrandTemplate } from "../js/templates/brandTemplate";
import { BriefProductDisplay } from "../js/templates/productTemplate";
import { PromotionTemplate } from "../js/templates/promotion";
import { CategoryTemplate } from "../js/templates/promotion";
import { ArrayPrep } from "./utility.mjs";
import '../styles/base.css'
import '../styles/large.css'

async function Init() {
  // Partials Display
  await LoadPartials("/partials/footer.html", "footer");
  await LoadPartials("/partials/head.html", "head", false);
  await LoadPartials("/partials/header.html", "header", false);
  await LoadPartials("/partials/search.html", "searchBar", true);

  // env's
  const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;
  const promotionPath = import.meta.env.VITE_JSON_PROMOTION_PATH;
  const brandPath = import.meta.env.VITE_BRAND_PATH;

  // Dom Selection
  const category = document.querySelector("#category");
  const promotion = document.querySelector("#promotions");
  const searchIcon = document.querySelector("#searchIcon");
  const searchInput = document.querySelector(".searchinput");
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

  if (!storage.IsInit()) {
    storage.init();
  }
  storage.logInCountDown();

  // user profile 
  document.querySelector(`#profile`).addEventListener("click", () => {
    let login = storage.Get("login");
    if (!login.isLoggedIn || login.isLoggedIn === undefined) {
      storage.set("locationRedirect", "../profile/index.html");
      window.location.href = "../user/login.html?q=log";
    }
    else{
       window.location.href = "../profile/index.html";
    }
  });

  //
  const allProducts = await dummyjson.GetAllProducts();
  const brandJson = new FetchJson(brandPath);

  // search bar
  searchIcon.addEventListener("click", () => {
    SearchBar();
  });
  document
    .querySelector("#inputParent")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        SearchBar();
      }
    });

  document
    .querySelector("#clearInput")
    .addEventListener("click", () => (searchInput.value = ""));
  // Promotion
  await promotionjson.RenderData(promotion, "afterbegin", PromotionTemplate);

  // categories
  await promotionjson.RenderData(category, "beforeend", CategoryTemplate, 8);

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
  let searched = storage.Get("searched");

  if (searched.length === 0 || searched === undefined) {
    contain1.querySelector("h1").textContent = "Deals From Around The World";
    contain1.querySelector("a").href = `../category/index.html?q=world`;

    let arr = ArrayPrep(allProducts.products, BriefProductDisplay, 15);
    Render(arr, lastSearched, "Beforeend");
  } else {
    contain1.querySelector("h1").textContent = "Last Searched";
    contain1.querySelector("a").href = "../category/index.html?q=searched";

    let arr = await dummyjson.GetProductsById(searched, true);
    let m = ArrayPrep(arr, BriefProductDisplay, 8);
    Render(m, lastSearched, "beforeend");
  }

  // Top Sellers
  let top = allProducts.products.filter((product) => product.rating >= 4);
  top = ArrayPrep(top, BriefProductDisplay, 10);
  Render(top, topSellers, "beforeend");

  // limited stocks
  let limited = allProducts.products.filter((product) => product.stock <= 10);
  limited = ArrayPrep(limited, BriefProductDisplay, 12);
  Render(limited, limitedStocks, "beforeend");

  // brands store
  brandJson.RenderData(brandsStore, "beforeend", BrandTemplate, 10);

  // add viewed
  // lastSearched,lastviewed,topsellers,limitedstocks
  [lastSearched, lastViewed, topSellers, limitedStocks].forEach((el) => {
    el.addEventListener("click", (event) => {
      let data = event.target.parentElement;
      data = data.querySelector(".holdsId");
      data = data.textContent;
      let k = storage.Get("viewed");
      let exists = k.find((e) => e === data);
      if (exists === undefined || exists === null) {
        k.push(data);
      }
      storage.set("viewed", k);
    });
  });

  async function SearchBar() {
    if (searchInput.value.trim() === "" || !searchInput.value) {
      return;
    }
    let prod = await dummyjson.SearchByProductName(searchInput.value);
    if (
      prod.products !== undefined &&
      prod.products !== null &&
      prod.products.length !== 0
    ) {
      let f = storage.Get("searched");
      let check = f.find((a) => a === searchInput.value);
      if (!check || check === undefined || check === null) {
        f.push(searchInput.value);
        storage.set("searched", f);
      }
    }
    window.location.href = `../category/index.html?q=${searchInput.value}`;
  }

  
}

Init();
