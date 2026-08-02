
// imports
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
import { productDetails } from "./utility.mjs";


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
    let data;

    if (storage.Get(queryVal[0], true)){
        if(queryVal[0] === "searched"){
            data = productDetails(storage.Get(queryVal[0]),dummyjson.SearchByProductName,true)
        }

        else{
           data = await dummyjson.GetProductsById(storage.Get(queryVal[0]));
        }
      let returnval = ArrayPrep(data, ProductDetailsTemplate, 8);
      Render(returnval, container, "beforeend");

    } 

    else if (brands.includes(queryVal[0])) {
      let brandData = data.products.filter((item) => {
        return item.brand === queryVal[i];
      });
      brandData = ArrayPrep(brandData, BriefProductDisplay, 0);
      highlight.innerHTML = ` ${queryVal[0]} store`;
      Render(brandData, container, "beforeend", true);

    } 
    else if(queryVal[0] === "random" || queryVal[0] === "world") {
      let rands = ArrayPrep(data.products, BriefProductDisplay, 18);
      Render(rands, container, "beforeend", true);
    }
    else{
       let u = await dummyjson.SearchByProductName(queryVal[0])
       if(u.products.length === 0 || u.products === undefined){
            window.location.href = '../error/error.html'
       }
       u = ArrayPrep(u.products,BriefProductDisplay,0)
       Render(u,container,"beforeend",true)
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



// add viewed
container.addEventListener("click",(event)=>{
  let domEl = event.target.parentElement
  let El = domEl.querySelector(".holdsId")
  let Eldata = El.textContent
  let v = storage.Get("viewed")
  v.push(Eldata)
  storage.set("viewed",v)
})
}
Init()
