import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import "../styles/base.css";
import "../styles/large.css";

const storage = new DataStorage();

if (!storage.IsInit()) {
  storage.init();
}
storage.logInCountDown();

async function Init() {
  LoadPartials("/partials/footer.html", "footer");
  LoadPartials("/partials/head.html", "head", false);
  await LoadPartials("/partials/header.html", "header", false);

  const avatar = document.querySelector("#avatar");
  const username = document.querySelector("#username");
  

  const user = storage.Get("user");
  if (Object.keys(user).length !== 0) {
    let name = user.name;
    username.innerHTML = `${name}`;
    avatar.innerHTML = `${name.slice(0, 2).toUpperCase()}`;
  }


}

Init();
