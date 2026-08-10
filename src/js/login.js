// imports
import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import { GetUrlParams } from "./utility.mjs";
import { EmptyString } from "./utility.mjs";
import '../styles/base.css'
import '../styles/large.css'

LoadPartials("/partials/footer.html", "footer");
LoadPartials("/partials/head.html", "head", false);


// initialization
const storage = new DataStorage();

if (!storage.IsInit()) {
  storage.init();
}
storage.logInCountDown();

async function Init() {
 await LoadPartials("/partials/header.html", "header", false);
  

  let q = GetUrlParams("q");
  const user = storage.Get("user");
  if (q === "log") {
    await LoadPartials("/partials/login1.html", "container", true, true);

    const notify = document.querySelector("#notify");
    const userName = document.querySelector("#username");
    let nextBtn = document.querySelector("#log1");
    nextBtn.addEventListener("click", async () => {
      let name = userName.value;
      if (!EmptyString(name)) {
        return;
      }
      if (!user.IsRegistered || user.IsRegistered === undefined) {
        userName.classList.remove("negative");
        notify.classList.add("show")
        notify.innerHTML = `Looks like you're new here. Complete your signup to continue`;
        user.name = name;
        storage.set("user", user);
        setTimeout(() => {notify.classList.remove("show");window.location.href = "signup.html?q=log"}, 5000);
      } else if (name !== user.name) {
        userName.classList.add("negative");
        notify.classList.add("show")
        notify.innerHTML = `The Username you entered is incorrect`;
        userName.value = ``;
      } else {
        notify.classList.remove("show")
        await LoadPartials("/partials/login2.html", "container", true, true);

        document.querySelector("#log2").addEventListener("click", () => {
          let password = document.querySelector("#password");
          if (!EmptyString(password.value)) {
            password.classList.add("negative");
            return;
          }
          if (password.value !== user.password) {
            password.classList.add("negative");
            let n = document.querySelector("#notify");
            n.classList.add("show")
            n.innerHTML =
              `Incorrect Password. Please try again`;
            userName.value = ``;
          } else {
            LogUserIn(storage);
            let n = document.querySelector("#notify");
            n.classList.add("show")
            n.innerHTML = "Logging you in....";
            setTimeout(
              () =>
                (window.location.href = EmptyString(
                  storage.Get("locationRedirect"),
                )),
              4000,
            );
          }
        });
      }
    });
  }
}
export function LogUserIn(store) {
  const date = new Date();
  let loginTime = date.getTime();
  let expiresAt = new Date(date);
  expiresAt = expiresAt.setHours(date.getHours() + 24);
  store.set("login", {
    isLoggedIn: true,
    loginTime: loginTime,
    expiresAt: expiresAt,
  });
  
}
Init();
