import { LoadPartials ,profileListener} from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import "../styles/base.css";
import "../styles/large.css";

async function Init() {
  let storage = new DataStorage();
  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  await LoadPartials("/partials/header.html", "header", false);

  document.querySelector("#hist").addEventListener("click", () => {
    window.location.href = "../order/index.html";
  });
  document.querySelector("#home").addEventListener("click", () => {
    window.location.href = "../index.html";
  });

   profileListener(storage)
}

Init();
