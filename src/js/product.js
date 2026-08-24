// imports
import { LoadPartials } from "./utility.mjs";
import { GetUrlParams } from "./utility.mjs";
import Api from "./api.mjs";
import { ProductDetailsTemplate } from "../js/templates/productTemplate";
import { Render,profileListener } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import { added,cartDuplicate } from "./templates/modalTemplate";
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
  const modalContent = document.querySelector(".modalContent");


  // url params
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
      modalContent.innerHTML = ``
      modal.showModal();
    } else {
      let exists = cart.find((i) => i.p_id === id);

      if (exists || exists !== undefined) {
        let a = await dummyjson.SearchById(id);
        modalContent.insertAdjacentHTML("afterbegin",cartDuplicate(a));
        modal.showModal();
      } else {
        cart.push({ p_id: Number(id), qty: 1 });
        storage.set("cart", cart);
        modalContent.insertAdjacentHTML("afterbegin",added); 
        modal.showModal();
      }
      add.classList.add("added");
    }
  });

  closemodal.addEventListener("click", () => {
    modalContent.innerHTML = ``
    modal.close();
  });
   profileListener(storage)
  

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
