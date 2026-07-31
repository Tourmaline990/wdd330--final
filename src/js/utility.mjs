export async function LoadPartials(path,element,id=true){
   let data = await fetch(path)
    if(!data.ok){
       console.log(data.text())
    }
    data = await data.text()
    if(!id){
      document.querySelector(`${element}`).insertAdjacentHTML("beforeend",data) 
      return;
    }
    document.querySelector(`#${element}`).insertAdjacentHTML("beforeend",data)

}

export function MapTemplate(dataArr,template){
   let mapped = dataArr.map(item => template(item))
   mapped.join("")
   return mapped
}

export function Randomize(dataArr) {
   const newArr = []
   let randIndexes = []
   const randomfunc =  arr => Math.floor(Math.random() * arr.length);
   for (let i = 0; i < dataArr.length; i++) {
      let randIndex = randomfunc(dataArr);
       randIndexes[i] = randIndex
   }
   for (let x = 0;  x < randIndexes.length; x++) {
      let occured =  randIndexes.filter(item => item === randIndexes[x])
      if(occured.length > 1){
           for (let j = 0; j < occured.length; j++) {
                randIndexes[x] = randomfunc(dataArr)
           }
      }
   }
   randIndexes.forEach(val => newArr.push(dataArr[val]))
   return newArr

}

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
    }
    array = MapTemplate(array,template)
    return array
}