import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import { GetUrlParams } from "./utility.mjs";
import { EmptyString } from "./utility.mjs";
import { LogUserIn } from "./login";

LoadPartials("/partials/footer.html", "footer");
LoadPartials("/partials/head.html", "head", false);
LoadPartials("/partials/header.html", "header", false);

// initialization
const storage = new DataStorage();

if (!storage.IsInit()) {
  storage.init();
}
storage.logInCountDown();

async function init() {
  let q = GetUrlParams("q");
  if (q === "log") {
    await LoadPartials("/partials/signup1.html", "container", true, true);
    let name = document.querySelector("#name");
    let email = document.querySelector("#email");

    let btn = document.querySelector("#signup1");

    let user = storage.Get("user");
    name.value = user.name;
    if (user.email) {
      email.value = user.email;
    }

    name.addEventListener("click", () => {
      if (!EmptyString(name.value)) {
        return;
      }
      user.name = name.value;
      storage.set("user", user);
    });

    btn.addEventListener("click", async () => {
      if (!EmptyString(email.value)) {
        email.classList.add("negative");
        return;
      }
      user.email = email.value;
      storage.set("user", user);

      await LoadPartials("/partials/signup2.html", "container", true, true);
      let btn2 = document.querySelector("#signup2");
      btn2.addEventListener("click", () => {
        let p = document.querySelector("#setPassword");
        let authenP = document.querySelector("#c-password");
        let notify = document.querySelector("#notify");

        if (!EmptyString(p.value)) {
          p.classList.add("negative");
          return;
        }
        if (!EmptyString(authenP.value)) {
          authenP.classList.add("negative");
          return;
        }
        if (p.value !== authenP.value) {
          authenP.value = "";
          p.value = "";
          notify.innerHTML = `Please enter same password in both fields`;
        } else {
          user.password = p.value;
          user.IsRegistered = true;
          storage.set("user", user);
          notify.innerHTML = `You're all set! your account has been created successfully`;
          LogUserIn(storage);
          setTimeout(() => {
            if (EmptyString(storage.Get("locationRedirect"))) {
              window.location.href = storage.Get("locationRedirect");
            } else {
              window.location.href = "../index.html";
            }
          }, 5000);
        }
      });
    });
  }
  document.querySelector(`#profile`).addEventListener("click", () => {
    let login = storage.Get("login");
    if (!login.isLoggedIn || login.isLoggedIn === undefined) {
      storage.set("locationRedirect", "../profile/index.html");
      window.location.href = "../user/login.html?log";
    }
  });
}
init();
