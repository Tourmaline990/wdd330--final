import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import '../styles/base.css'
import '../styles/large.css'


async function Init() {
 let storage = new DataStorage()
  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  await LoadPartials("/partials/header.html", "header", false);

  document.querySelector("#hist").addEventListener("click", () => {
    window.location.href = "../order/index.html";
  });
  document.querySelector("#home").addEventListener("click", () => {
    window.location.href = "../index.html";
  });

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
}

Init();
