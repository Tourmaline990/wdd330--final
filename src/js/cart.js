// imports
import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import Api from "./api.mjs";
import { CartTemplate } from "./templates/cartTemplate";
import "../styles/base.css";
import "../styles/large.css";

import { Render } from "./utility.mjs";
import { MapTemplate } from "./utility.mjs";

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

async function Init() {
  await LoadPartials("/partials/header.html", "header", false);
  let cart = storage.Get("cart");

  if (!cart || cart.length === 0) {
    EmptyCart();
  } else {
    document.querySelector(".summary").classList.remove("hide");
    document.querySelector(".checks").classList.remove("hide");
    let r = await updateTotal(cart, mapCart, subtotal, checkouttotal);
    document.querySelector("#len").textContent = cart.length;
    Render(r, container, "beforeend", true);

    document
      .querySelector("#container")
      .addEventListener("click", async (event) => {
        let attr = event.target.getAttribute("class");
        let id = event.target
          .closest(".cartItem")
          .querySelector(".id").textContent;
        if (!id) {
          return;
        }

        let c = cart.find((i) => i.p_id === Number(id));
        if (attr === "remove") {
          cart.splice(
            cart.findIndex((i) => i.p_id === c.p_id),
            1,
          );
          storage.set("cart", cart);
        } else if (attr === "increase") {
          c.qty++;
          storage.set("cart", cart);
          let h = await updateTotal(cart, mapCart, subtotal, checkouttotal);

          Render(h, container, "beforeend", true);
        } else if (attr === "decrease") {
          if (c.qty === 1) {
            let o = cart.findIndex((j) => j.p_id === c.p_id);
            cart.splice(o, 1);
            storage.set("cart", cart);
            EmptyCart();
            return;
          }
          c.qty -= 1;
          storage.set("cart", cart);
          let h = await updateTotal(cart, mapCart, subtotal, checkouttotal);
          Render(h, container, "beforeend", true);
        }
      });
  }
  document.querySelector("#clearCart").addEventListener("click", () => {
    ClearCart(storage);
  });

  document.querySelector("#checkout").addEventListener("click", () => {
    let loggedIn = storage.Get("login");
    if (!loggedIn.isLoggedIn || loggedIn.isLoggedIn === undefined) {
      window.location.href = `../user/login.html?q=log`;
      storage.set("locationRedirect", "../checkout/index.html");
    } else {
      window.location.href = `../checkout/index.html`;
    }
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

  async function updateTotal(cartToMap, fn, el1, el2) {
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

    //
    document.querySelector("#clearCart").removeEventListener("click", () => {
      ClearCart(storage);
    });
    container.innerHTML = `
        <p> No items in cart yet </p>
         <button class="view"> View Products </button>
        `;
    document.querySelector(".view").addEventListener("click", () => {
      window.location.href = `../index.html`;
    });
  }
  document.querySelector(`#profile`).addEventListener("click", () => {
    let login = storage.Get("login");
    if (!login.isLoggedIn || login.isLoggedIn === undefined) {
      storage.set("locationRedirect", "../profile/index.html");
      window.location.href = "../user/login.html?q=log";
    } else {
      window.location.href = "../profile/index.html";
    }
  });
}
Init();
