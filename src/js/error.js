import { LoadPartials } from "./utility.mjs";
import "../styles/base.css";
import "../styles/large.css";
import DataStorage from "./Datastorage.mjs";

async function Init() {

  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  LoadPartials("/partials/header.html", "header", false);

  const storage = new DataStorage()
  document.querySelector("#refresh").addEventListener("click", () => {
    window.location.href = storage.Get("locationRedirect") ;
  });
}

Init();
