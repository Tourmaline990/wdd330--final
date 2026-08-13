// imports
import { LoadPartials } from "./utility.mjs";
import { GetUrlParams } from "./utility.mjs";
import Api from "./api.mjs";
import { ProductDetailsTemplate } from "../js/templates/productTemplate";
import { Render } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import "../styles/base.css";
import "../styles/large.css";

async function Init() {
  // partials display
  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  await LoadPartials("/partials/header.html", "header", false);

  //env's
  const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;

  // initialization
  const dummyjson = new Api(dummyJsonUrl);
  const storage = new DataStorage();

  if (!storage.IsInit()) {
    storage.init();
  }
  storage.logInCountDown();

  // dom
  const container = document.querySelector("#container");
  const highlight = document.querySelector(".highlight");
  const add = document.querySelector("#addition");
  const modal = document.querySelector("#modal");
  const closemodal = document.querySelector("#closeBtn");

  //url params

  let query = GetUrlParams("q");
  if (!Number.isNaN(Number(query))) {
    query = Number(query);
    let product = await dummyjson.SearchById(query);
    highlight.innerHTML = product.title;
    product = ProductDetailsTemplate(product);
    Render(product, container, "beforeend", true, false);
  } else {
    window.location.href = "../error/error.html";
  }

  // after content loads
  let id = Number(document.querySelector(".holdsId").textContent);
  let cart = storage.Get("cart");

  add.addEventListener("click", async () => {
    if (cart.length === 0 || !cart) {
      cart.push({ p_id: Number(id), qty: 1 });
      storage.set("cart", cart);
      modal.insertAdjacentHTML(
        "afterbegin",
        `<p> Product added successfully </p>`,
      );
      modal.showModal();
    } else {
      let exists = cart.find((i) => i.p_id === id);

      if (exists || exists !== undefined) {
        let a = await dummyjson.SearchById(id);

        modal.insertAdjacentHTML(
          "afterbegin",
          `<p> <span class="highlight">${a.title}</span> already in cart,add or increase quantity</p>`,
        );
        modal.showModal();
      } else {
        cart.push({ p_id: Number(id), qty: 1 });
        storage.set("cart", cart);
        modal.insertAdjacentHTML(
          "afterbegin",
          `<p> Product added successfully </p>`,
        );
        modal.showModal();
      }
      add.classList.add("added");
    }
  });

  closemodal.addEventListener("click", () => {
    modal.close();
  });

  document.querySelector(`#profile`).addEventListener("click", () => {
    let login = storage.Get("login");
    if (!login.isLoggedIn || login.isLoggedIn === undefined) {
      storage.set("locationRedirect", "../profile/index.html");
      window.location.href = "../user/login.html?q=log";
    } else {
      window.location.href = "../profile/index.html";
    }
  });

  const imagecontainer = document.querySelector(".imageContainer");
  const thumb = document.querySelector(".thumb");
  imagecontainer.addEventListener("scroll", () => {
    const maxscroll = imagecontainer.scrollWidth - imagecontainer.clientWidth;
    const maxmove = imagecontainer.clientWidth - thumb.offsetWidth;

    const position = imagecontainer.scrollLeft / maxscroll;

    thumb.style.transform = `translateX(${position * maxmove}px)`;
  });

  function updateThumb() {
    const ratio = imagecontainer.clientWidth / imagecontainer.scrollWidth;
    thumb.style.width = `${ratio * 100}%`;
  }
  window.addEventListener("resize", updateThumb);
  updateThumb();

  thumb.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startscroll = imagecontainer.scrollLeft;
    function move(e) {
      const maxscroll =
        imagecontainer.scrollWidth - imagecontainer.clientHeight;
      const maxmove = imagecontainer.clientWidth - thumb.offsetWidth;
      const distance = e.clientX - startX;

      imagecontainer.scrollLeft =
        startscroll + (distance / maxmove) * maxscroll;
    }
    function stop() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
  });
}
Init();
