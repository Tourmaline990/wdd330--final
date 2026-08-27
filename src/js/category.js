// imports
import { LoadPartials, profileListener } from "./utility.mjs";
import { BriefProductDisplay } from "../js/templates/productTemplate";
import { GetUrlParams} from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import Api from "./api.mjs";
import { ArrayPrep } from "./utility.mjs";
import { Render } from "./utility.mjs";
import { randomfunc } from "./utility.mjs";
import FetchJson from "../js/fetch-json.mjs";
import { CategoryTemplate } from "./templates/promotion";
import "../styles/base.css";
import "../styles/large.css";


async function Init() {
  // partials display
  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  await LoadPartials("/partials/header.html", "header", false);

  // Dom Selection
  const container = document.querySelector("#container");
  const title = document.querySelector("#title");

  // env's
  const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;
  const promotionPath = import.meta.env.VITE_JSON_PROMOTION_PATH;

  // initialization
  const storage = new DataStorage();
  const dummyjson = new Api(dummyJsonUrl);
  const promotionjson = new FetchJson(promotionPath);

  if (!storage.IsInit()) {
    storage.init();
  }
  storage.logInCountDown();

  const query = GetUrlParams("q", true).join();

  let allProducts = await dummyjson.GetAllProducts();
  if(!allProducts){
    storage.set("locationRedirect",`../category/index.html?q=${query}`)
    window.location.href = "../error/error.html";
    return
  }
  
  let brands = await dummyjson.GetBrands();
  if(!brands){
      storage.set("locationRedirect",`../category/index.html?q=${query}`)
      window.location.href = "../error/error.html";
      return
  }

  const headings = [
    "Curated Just For You",
    "Global Picks, Local Prices",
    "Editor's Choice",
    "Hot Deals",
    "Trending Products Worldwide",
    "Fresh Finds",
    "Sponsored Picks, Just For You",
    "Discover Global Favorites",
    "Trending Now",
    "Shop What's Popular",
  ];
  const occurence = [
    "random",
    "world",
    "topSellers",
    "brands",
    "categories",
    "limitedStocks",
  ];

  //
  let queryVal = query.split(",");
  queryVal = queryVal.filter((q) => q !== "");

  try {
    if (queryVal.length === 1) {
      let data;

      if (storage.Get(queryVal[0], true)) {
        if (queryVal[0] === "searched") {
          title.innerHTML = `Searched products`;
          data = await dummyjson.GetProductsById(
            storage.Get(queryVal[0]),
            true,
          );
        } else {
          title.innerHTML = `Viewed Products`;
          data = await dummyjson.GetProductsById(storage.Get(queryVal[0]));
        }
        let returnval = ArrayPrep(data, BriefProductDisplay);
        Render(returnval, container, "beforeend", true);
      } else if (brands.includes(queryVal[0])) {
        let brandData = allProducts.products.filter(
          (item) => item.brand === queryVal[0],
        );
        brandData = ArrayPrep(brandData, BriefProductDisplay);
        title.innerHTML = ` ${queryVal[0]} store`;
        Render(brandData, container, "beforeend", true);
      } else if (occurence.includes(queryVal[0])) {
        if (queryVal[0] === "categories") {
          await promotionjson.RenderData(
            container,
            "beforeend",
            CategoryTemplate,
          );
          return;
        } else if (queryVal[0] === "limitedStocks") {
          title.innerHTML = `Limited Stocks`;
          data = allProducts.products.filter((product) => product.stock <= 10);
        } else if (queryVal[0] === "topSellers") {
          title.innerHTML = `Top Sellers`;
          data = allProducts.products.filter((product) => product.rating >= 4);
        } else {
          title.innerHTML = `${headings[randomfunc(headings)]}`;
          data = allProducts.products;
        }

        let rands = ArrayPrep(data, BriefProductDisplay, 200);
        Render(rands, container, "beforeend", true);
      } else {
        let u = await dummyjson.SearchByProductName(queryVal[0]);
        let m = ArrayPrep(u.products, BriefProductDisplay);
        if (u.products.length === 0 || u.products === undefined) {
          m = allProducts.products.filter((p) =>
            p.title.includes(queryVal[0].slice(0, 2)),
          );
          m = ArrayPrep(m, BriefProductDisplay);
        }
        title.innerHTML = `Search results for <span class="highlight">${queryVal[0]} </span>`;
        Render(m, container, "beforeend", true);
      }
    } else if (queryVal.length > 1) {
      let data = await Promise.all(
        queryVal.map(async (item) => {
          let m = await dummyjson.GetProductByCategory(item);
          return m.products;
        }),
      );
      data = data.reduce((acc, item) => acc.concat(item), []);
      title.innerHTML = `${headings[randomfunc(headings)]}`;
      let forDisplay = ArrayPrep(data, BriefProductDisplay);
      Render(forDisplay, container, "beforeend", true);
    }
  } catch (error) {
    console.log(error);
    await LoadPartials("/partials/loading.html", "container", true);
  }

  // add viewed
  container.addEventListener("click", (event) => {
    let domEl = event.target.parentElement;
    let El = domEl.querySelector(".holdsId");
    let Eldata = El.textContent;
    let v = storage.Get("viewed");
    let f = v.find( i => i === Eldata)
    if(!f){
      v.push(Eldata);
       storage.set("viewed", v);
    }
       
  });
    
  profileListener(storage)
}
Init();
