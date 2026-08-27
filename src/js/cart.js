// imports
import { LoadPartials,profileListener } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import Api from "./api.mjs";
import { CartTemplate } from "./templates/cartTemplate";
import "../styles/base.css";
import "../styles/large.css";
import { Render } from "./utility.mjs";
import { MapTemplate } from "./utility.mjs";
import { StageEvent } from "./utility.mjs";

LoadPartials("/partials/footer.html", "footer");
LoadPartials("/partials/head.html", "head", false);

//env's
const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;

// initialization
const storage = new DataStorage();
const dummyjson = new Api(dummyJsonUrl);

if (!storage.IsInit()) {
  storage.init();
}

storage.logInCountDown();

// dom selection
const container = document.querySelector("#container");
const subtotal = document.querySelector("#subtotal");
const checkouttotal = document.querySelector("#total");
const checkout = document.querySelector("#checkout")
let len =  document.querySelector("#len")

async function Init() {

  await LoadPartials("/partials/header.html", "header", false);

  let cart = storage.Get("cart");

  if (!cart || cart.length === 0) {
     EmptyCart();
  } 
  else {
    document.querySelector(".summary").classList.remove("hide");
    document.querySelector(".checks").classList.remove("hide");
    let r = await updateTotal(cart, mapCart, subtotal, checkouttotal);
    len.textContent = cart.length;
    Render(r, container, "beforeend", true);

    StageEvent("container","cartItem",async(event) => await cartFn(event),true)
    checkout.addEventListener("click",()=> window.location.href = '../checkout/index.html' )
    async function cartFn(event){
      let attr = event.target.getAttribute("class");
      let id = event.target.closest(".cartItem").querySelector(".id").textContent;
      let c = cart.find((i) => i.p_id === Number(id));
      switch (attr) {
        case "remove":
           cart.splice(cart.findIndex((i) => i.p_id === c.p_id),1); 
           break;
        case "increase":
           c.qty++;
           break
        case "decrease":
          if(c.qty === 1){
             let o = cart.findIndex((j) => j.p_id === c.p_id);
             cart.splice(o, 1);
          }
          c.qty -= 1;
          break
        }
        storage.set("cart", cart);
        let h = await updateTotal(cart, mapCart, subtotal, checkouttotal);
        Render(h, container, "beforeend", true);
      
    }
  }
  document.querySelector("#clearCart").addEventListener("click", () => {
    ClearCart(storage);
    EmptyCart()
  });

 

  function ClearCart(store) {
    cart = [];
    store.set("cart", cart);
  }
  async function mapCart(cartToMap) {
    let t = await Promise.all(
      cartToMap.map(async (it) => {
        let u = await dummyjson.SearchById(it.p_id);
        return { p_id: u, qty: it.qty, price: u.price * it.qty };
      }),
    );
    return t;
  }

  async function updateTotal(cartToMap, fn, el1, el2){
    let t = await fn(cartToMap);
    let m = MapTemplate(t, CartTemplate);
    let val = t.reduce((a, c) => a + c.price, 0);
    el1.innerHTML = `$${val.toFixed(2)}`;
    el2.innerHTML = `$${val.toFixed(2)}`;
    return m;
  }

  function EmptyCart() {
    document.querySelector(".summary").classList.add("hide");
    document.querySelector(".checks").classList.add("hide");

    document.querySelector("#clearCart").removeEventListener("click", () => {
      ClearCart(storage);
    });
    emptyCartUi() 
  }

  function emptyCartUi(){
     len.textContent = 0
      container.innerHTML = `
        <p> No items in cart yet </p>
         <button class="view"> View Products </button>
        `;
      document.querySelector(".view").addEventListener("click", () => {
         window.location.href = `../index.html`;
       });
  }

  profileListener(storage)
}
Init();
