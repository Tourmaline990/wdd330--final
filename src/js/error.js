import { LoadPartials } from "./utility.mjs";

async function Init() {
  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  LoadPartials("/partials/header.html", "header", false);

  document.querySelector("#refresh").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

Init();
