// imports
import { LoadPartials } from "./utility.mjs";
import FetchJson from "./fetch-json.mjs";
import { MapTemplate,profileListener } from "./utility.mjs";
import { searchTemplate } from "./templates/cartTemplate";
import { Render } from "./utility.mjs";
import { SelectOptionTemplate } from "./templates/cartTemplate";
import { EmptyString } from "./utility.mjs";
import { Li } from "./templates/cartTemplate";
import DataStorage from "./Datastorage.mjs";
import Api from "./api.mjs";
import { CheckoutTp } from "./templates/cartTemplate";
import CheckoutProcessor from "./checkoutProcessor.mjs";
import { PrepareCart } from "./checkoutProcessor.mjs";
import { StageEvent } from "./utility.mjs";

import "../styles/base.css";
import "../styles/large.css";

let storage = new DataStorage();
if (!storage.IsInit()) {
  storage.init();
}
storage.logInCountDown();

const countryFlagPath = import.meta.env.VITE_REST_COUNTRY_SERVER_URL;
const bearerToken = import.meta.env.VITE_REST_COUNTRIES_API_KEY;
const countriesNowStatePath = import.meta.env.VITE_COUNTRIESNOW_STATE_ENDPOINT;
const countryNowCitiesPath = import.meta.env.VITE_COUNTRIES_NOW_CITIES_ENDPOINT;
const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;

const dummyjson = new Api(dummyJsonUrl);

// dom
let el = document.querySelector("#country");
let city = document.querySelector("#city");
let items = document.querySelector("#items");
const options = { headers: { Authorization: `Bearer ${bearerToken}` } };
let val;
let data;
try {
  data = new FetchJson(
    `${countryFlagPath}?response_fields=flag.url_png,names.common,codes&limit=100`,
    options,
  );
} catch (error) {
  console.log(error);
}

async function Init() {
  // init
  await LoadPartials("/partials/footer.html", "footer");
  await LoadPartials("/partials/head.html", "head", false);
  await LoadPartials("/partials/header.html", "header", false);
  await LoadPartials("/partials/search.html", "filter", true);
  await LoadPartials("/partials/search.html", "forcity", true);

  StageEvent("forcity", "clearInput", () => {
    ClearSearch("searchinput");
  });
  StageEvent("filter", "clearInput", () => {
    ClearSearch("searchinput");
  });
  let countryName = document.querySelector(".searchinput").value;
  let typingtimeout;

  StageEvent(
    "filter",
    "searchinput",
    async (event) => {
      el.classList.add("show");
      await ClickFn(
        Populate,
        el,
        data,
        (d) =>
          d.data.objects.filter(
            (o) =>
              o.codes.alpha_2 !== "" &&
              o.flag.url_png !== "" &&
              o.names.common !== "",
          ),
        searchTemplate,
      );

      event.target.addEventListener("input", () => {
        clearTimeout(typingtimeout);
        typingtimeout = setTimeout(async () => {
          if (event.target.value !== "") {
            val = event.target.value;
          }
          await ClickFn(
            Populate,
            el,
            new FetchJson(
              `${countryFlagPath}/names.common?q=${val}&response_fields=flag.url_png,codes,names.common&limit=100`,
              options,
            ),
            (d) =>
              d.data.objects.filter(
                (o) =>
                  o.codes.alpha_2 !== "" &&
                  o.flag.url_png !== "" &&
                  o.names.common !== "",
              ),
            searchTemplate,
          );
        }, 1000);
      });
    },
    true,
  );

  StageEvent(
    "country",
    "acountry",
    (event) => {
      city.classList.add("show");
      let target = event.target.closest(".acountry").querySelector("span");
      let element = event.target
        .closest("fieldset")
        .querySelector(".searchinput");
      element.value = target.innerHTML;
      el.innerHTML = "";
      el.classList.remove("show");
    },
    true,
  );

  let typed;

  StageEvent(
    "forcity",
    "searchinput",
    async (event) => {
      let state = document.querySelector("#state");
      if (!state.value) {
        city.innerHTML = `<li> Select a state to continue <li>`;
        return;
      }
      await ClickFn(
        Populate,
        city,
        new FetchJson(countryNowCitiesPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName.trim() }),
        }),
        (d) => d.data,
        Li,
      );

      event.target.addEventListener("input", () => {
        clearTimeout(typed);
        typed = setTimeout(async () => {
          if (event.target.value !== "") {
            val = event.target.value;
          }
          await ClickFn(
            Populate,
            city,
            new FetchJson(countryNowCitiesPath, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ country: countryName.trim() }),
            }),
            (d) => {
              let m = d.data;
              return ManualQuery(val, m);
            },
            Li,
          );
        }, 1000);
      });
    },
    true,
  );

  document.querySelector("#state").addEventListener("click", async () => {
    if (!EmptyString(document.querySelector(".searchinput").value)) {
      document.querySelector("#note").textContent =
        `Select a country to proceed`;
      return;
    }
    countryName = document.querySelector(".searchinput").value;
    let ret = await new FetchJson(countriesNowStatePath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: countryName }),
    }).LoadData();
    ret = ret.data.states;
    ret = MapTemplate(ret, SelectOptionTemplate);
    Render(ret, document.querySelector("#state"), "beforeend");
  });

  StageEvent(
    "city",
    "cityname",
    (event) => {
      let text = event.target.textContent;
      let b = event.target.closest("fieldset");
      let r = b.querySelector("#forcity");
      let t = r.querySelector(".searchinput");
      t.value = text;
      city.innerHTML = "";
      city.classList.remove("show");
    },
    true,
  );

  // checkout
  const cart = storage.Get("cart");
  let p_ids = cart.map((c) => c.p_id);
  p_ids = await dummyjson.GetProductsById(p_ids);
  p_ids = p_ids.map((c, index) => ({ p: c, qty: cart[index].qty }));
  p_ids = p_ids.map(PrepareCart);
  let subtotal = p_ids.reduce((acc, item) => acc + Number(item.price), 0);
  p_ids = MapTemplate(p_ids, CheckoutTp);
  Render(p_ids, items, "beforeend");

  let shipping = 10 + (cart.length - 1) * 2;
  let total = subtotal + shipping + 12;
  document.querySelector("#subTotal").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector("#shippingFee").textContent =
    `$${shipping.toFixed(2)}`;
  document.querySelector("#total").textContent = `$${total.toFixed(2)}`;

  const processor = new CheckoutProcessor(shipping, total);

  document.querySelector("#submit").addEventListener("click", async (event) => {
    event.preventDefault();
    const form = document.querySelector("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    console.log("here");
    await processor.init();
    document.querySelector("#shippingFee").textContent = ``;
    document.querySelector("#estimatedTax").classList.add("hide");
    window.location.href = "../success/index.html";
  });

  profileListener(storage)
}
Init();

function ClearSearch(searchInputName) {
  event.target.parentElement.querySelector(`.${searchInputName}`).value = "";
}

async function ClickFn(callback, ul, returneddata, transformFn, tp) {
  await callback(ul, returneddata, transformFn, tp);
}
async function Populate(ul, dataval, callback, tp) {
  try {
    let d = await dataval.LoadData();
    d = callback(d);
    d = MapTemplate(d, tp);
    Render(d, ul, "afterBegin", true);
  } catch (error) {
    console.log(error);
    await LoadPartials("/partials/loading.html", ul, false, false, true);
  }
}
function ManualQuery(input, alldata) {
  return alldata.filter((i) => i.toLowerCase().includes(input.toLowerCase()));
}
