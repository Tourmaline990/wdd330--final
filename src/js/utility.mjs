export async function LoadPartials(path,element,id=true,clear=false,isSelected=false){
   let data = await fetch(path)
    if(!data.ok){
       console.log(data.text())
    }
    data = await data.text()
    if(isSelected){
        element.insertAdjacentHTML("beforeend",data) 
        return
    }
    if(!id){
       if(clear){
          document.querySelector(`${element}`).innerHTML = ``
       }
      document.querySelector(`${element}`).insertAdjacentHTML("beforeend",data) 
      return;
    }
      if(clear){
          document.querySelector(`#${element}`).innerHTML = ``
       }
    document.querySelector(`#${element}`).insertAdjacentHTML("beforeend",data)

}

export function MapTemplate(dataArr,template){
   let mapped = dataArr.map(item => template(item))
   mapped.join("")
   return mapped
}

export function Randomize(dataArr) {
   for (let i = dataArr.length - 1; i > 0; i--) {
        let v  = Math.floor(Math.random() * (i + 1));
        [dataArr[v],dataArr[i]] = [dataArr[i],dataArr[v]];
   }
   return dataArr
}
export function randomfunc (arr) {return Math.floor(Math.random() * arr.length);}
export function Render(stringdata,DomElement,position,clear=false,isArr=true){
   if(isArr){
      stringdata = stringdata.join("")
   }
       if(clear){
            DomElement.textContent = "";
       }
       DomElement.insertAdjacentHTML(position,stringdata)
   
}

export function GetUrlParams(key,isArr=false){
  const s  = window.location.search
  const params = new URLSearchParams(s)
  if(isArr){
    return params.getAll(key)
  }
  return params.get(key)
}

export function LimitArray(arr,limit=0){
   if(limit > arr.length){
       limit = arr.length
   }
   let newArr = []
     const rand = Randomize(arr)
     for (let i = 0; i < arr.length; i++) {
       if(newArr.length !== limit){
        newArr.push(rand[i])
       }
     }
     return newArr;
}

export function ArrayPrep(arr,template,limit=0){

    let array = Randomize(arr)

    if(limit > 0){
       array = LimitArray(array,limit)
        return MapTemplate(array,template)
    }
   return MapTemplate(array,template)
}
export function EmptyString(val){
    if(!val || val.trim() === ""){
            return false
         }
         return val
}
export function StageEvent(parent, expectedTargetId, callback, targetIsClass = false){
  if (targetIsClass) {
    document.querySelector(`#${parent}`).addEventListener("click", (event) => {
      let targetItem = event.target.closest(`.${expectedTargetId}`);
      if (targetItem) {
        callback(event);
        
      }
    });
  }
  document.querySelector(`#${parent}`).addEventListener("click", (event) => {
    let targetItem = event.target.closest(`#${expectedTargetId}`);
    if (targetItem) {
      callback(event);
    }
  });
}
export function profileListener(storage){
  document.querySelector(`#profile`).addEventListener("click", () => {
    let login = storage.Get("login");
    if (!login.isLoggedIn || login.isLoggedIn === undefined) {
      storage.set("locationRedirect", "../profile/index.html");
      window.location.href = "../user/login.html?q=log";
    } else {
      window.location.href = "../profile/index.html";
    }
  });
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