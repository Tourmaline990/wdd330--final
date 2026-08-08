import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import { OrderHistoryTemplate } from "./templates/historyTemplate";
import { MapTemplate } from "./utility.mjs";
import { Render } from "./utility.mjs";

const storage = new DataStorage();
if (!storage.IsInit()) {
  storage.init();
}
storage.logInCountDown();

// dom
const container = document.querySelector("#container");

async function Init() {
  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  LoadPartials("/partials/header.html", "header", false);

  const history = storage.Get("orderhistory");
  if (history.length === 0) {
    container.innerHTML = `
        <p> No Order Records Yet <p>
         <a href="../index.html"> View Products </a>
      `;
    return;
  }
  let m = MapTemplate(history, OrderHistoryTemplate);
  Render(m, container, "beforeend", true);
}

Init();
