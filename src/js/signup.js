import { LoadPartials } from "./utility.mjs";
import DataStorage from "./Datastorage.mjs";
import { GetUrlParams } from "./utility.mjs";
import { EmptyString,profileListener } from "./utility.mjs";
import { LogUserIn } from "./utility.mjs";
import "../styles/base.css";
import "../styles/large.css";

LoadPartials("/partials/footer.html", "footer", true, true);
LoadPartials("/partials/head.html", "head", false);

// initialization
const storage = new DataStorage();

if (!storage.IsInit()) {
  storage.init();
}
storage.logInCountDown();

async function init() { 
  await LoadPartials("/partials/header.html", "header", false, true);
  let q = GetUrlParams("q");
  if(q !== "fp" && q !== "log"){
     window.location.href = "../index.html"
  }
  await LoadPartials("/partials/signup1.html", "container", true, true);

    let name = document.querySelector("#name");
    let email = document.querySelector("#email");
    let btn = document.querySelector("#signup1");

    let user = storage.Get("user");

  if (q === "log") {
    if(user.IsRegistered){
       document.querySelector("#notify").innerHTML = `Account exists, login or create a new account`
       document.querySelector("#notify").classList.add("show");
       setTimeout(() => window.location.href = "login.html?q=log",5000)
    }
    name.value = user.name;
    if (user.email) {
      email.value = user.email;
    }
  }

  btn.addEventListener("click", async () => {
      if (!EmptyString(email.value)) {
        email.classList.add("negative");
        return;
      }
      user.email = email.value;
      storage.set("user", user);
      
      if (!EmptyString(name.value)) {
       return;
      }
       user.name = name.value;
      storage.set("user", user);
    });
    
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
          notify.classList.add("show");
          notify.innerHTML = `Please enter same password in both fields`;
        } else {
          user.password = p.value;
          user.IsRegistered = true;
          storage.set("user", user);
          notify.classList.add("show");
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
    
  
  
  profileListener(storage)
}
init();
