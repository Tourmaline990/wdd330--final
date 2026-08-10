import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import { OrderHistoryTemplate } from "./templates/historyTemplate";
import { MapTemplate } from "./utility.mjs";
import { StageEvent } from "./utility.mjs";
import { Render } from "./utility.mjs";
import '../styles/base.css'
import '../styles/large.css'

const storage = new DataStorage();
if (!storage.IsInit()) {
  storage.init();
}
storage.logInCountDown();

// dom
const container = document.querySelector("#container");

async function Init() {
  LoadPartials("/partials/footer.html", "footer",true);
  LoadPartials("/partials/head.html", "head", false);
 await LoadPartials("/partials/header.html", "header", false);

  const history = storage.Get("orderhistory");
  if (history.length === 0) {
    container.innerHTML = `
        <p> No Order Records Yet <p>
         <a href="../index.html"> View Products </a>
      `;
    return;
  }
  let m = MapTemplate(history, OrderHistoryTemplate);
  Render(m, container, "beforeend");
  
  StageEvent("container","contained",(event) => {
    let targrtItemparent = event.target.closest(".contained")
    targrtItemparent.querySelector(".dpdown").classList.toggle("show")
    targrtItemparent.querySelector(".ctl").classList.toggle("show")
  },true)
  
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
