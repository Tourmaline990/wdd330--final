import { LoadPartials } from "./utility.mjs";
import {
  BriefProductDisplay,
  ProductDetailsTemplate,
} from "../js/templates/productTemplate";
import { GetUrlParams } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import Api from "./api.mjs";
import { ArrayPrep } from "./utility.mjs";
import { Render } from "./utility.mjs";



async function Init(){
   // partials display
LoadPartials("/partials/footer.html", "footer");
LoadPartials("/partials/head.html", "head", false);
LoadPartials("/partials/header.html", "header", false);

// Dom Selection
const container = document.querySelector("#container");
const highlight = document.querySelector(".highlight");

// env's
const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;

// initialization
const storage = new DataStorage();
const dummyjson = new Api(dummyJsonUrl);
const data = await dummyjson.GetAllProducts();
const brands = await dummyjson.GetBrands();

const query = GetUrlParams("q", true).join();

let queryVal = query.split(",");

if (queryVal.length === 1) {
  for (let i = 0; i < queryVal.length; i++) {
    if (storage.Get(queryVal[i], true)) {
      const dataIds = await dummyjson.GetProductsById(storage.Get(queryVal[i]));
      let returnval = ArrayPrep(dataIds, ProductDetailsTemplate, 8);
      Render(returnval, container, "beforeend");
    } else if (brands.includes(queryVal[i])) {
      let brandData = data.products.filter((item) => {
        return item.brand === queryVal[i];
      });
      brandData = ArrayPrep(brandData, BriefProductDisplay, 0);
      highlight.innerHTML = ` ${queryVal[i]} store`;
      Render(brandData, container, "beforeend", true);
    } else {
      let rands = ArrayPrep(data.products, BriefProductDisplay, 18);
      Render(rands, container, "beforeend", true);
    }
  }
} else if (queryVal.length > 1) {
  queryVal = queryVal.filter((item) => item.trim() !== "");
  let newArr = [];
  for (let x = 0; x < queryVal.length; x++) {
    let categoryData = await dummyjson.GetProductByCategory(queryVal[x]);
    newArr.push(...categoryData.products);
  }
  highlight.innerHTML = `Shopping Companion`;
  let forDisplay = ArrayPrep(newArr, BriefProductDisplay, 50);
  Render(forDisplay, container, "beforeend", true);
}

// querystrings
// q=searched
// q=world
//q=viewed
// q=randoms
// q=${searchValue} productname
//q=brand e.g gucci
// ['vehicle,motorcycle,']

}
Init()
