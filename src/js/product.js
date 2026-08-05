// imports
import { LoadPartials } from "./utility.mjs";
import { GetUrlParams } from "./utility.mjs";
import Api from "./api.mjs";
import { MapTemplate } from "./utility.mjs";
import { ProductDetailsTemplate } from "../js/templates/productTemplate";
import { Render } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";

async function Init(){

  // partials display
LoadPartials("/partials/footer.html", "footer");
LoadPartials("/partials/head.html", "head", false);
LoadPartials("/partials/header.html", "header", false);

//env's
const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;

// initialization
const dummyjson = new Api(dummyJsonUrl);
const allProducts = await dummyjson.GetAllProducts();
const storage = new DataStorage()

// dom
const container = document.querySelector("#container");
const highlight = document.querySelector(".highlight");
const increase = document.querySelector("#increase")
const decrease = document.querySelector("#decrease")
const add = document.querySelector("#addition")
const modal = document.querySelector("#modal")
const closemodal = document.querySelector("#closeBtn")



//url params

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
    


// after content loads
let id =   Number(document.querySelector(".holdsId").textContent)
let cart = storage.Get("cart")

    add.addEventListener("click",async() => {

        if(cart.length === 0 || !cart ){
          cart.push({p_id:Number(id),qty:1})
          storage.set("cart",cart)
        }
        else{
          let exists = cart.find(i => i.p_id === id)

          if(exists || exists !== undefined){
                let a = await dummyjson.SearchById(id)
                modal.insertAdjacentHTML("afterbegin",`<p> <span class="highlight">${a.title}</span> already in cart,add or increase quantity</p>`)
                modal.showModal()
          }
          else{
            cart.push({p_id:Number(id),qty:1})
            storage.set("cart",cart)
          }
        }
    })

    increase.addEventListener("click",()=> {
        let item = cart.find( i => i.p_id === id)
        item.qty += 1
        storage.set("cart",cart)
    })

    decrease.addEventListener("click",() => {
      let item = cart.find( i => i.p_id === id)
        if(item.qty === 1){
          return;
        }
        item.qty -= 1
        storage.set("cart",cart)
    })
    closemodal.addEventListener("click",()=> {
      modal.close()
    })

}
Init()
