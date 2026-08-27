import { Randomize } from "./utility.mjs";
import { Render } from "./utility.mjs";
import { MapTemplate } from "./utility.mjs";
import { LimitArray } from "./utility.mjs";


export default class FetchJson{
   constructor(path,obj={}){
      this.path = path;
      this.option = obj
   }
   async LoadData(){
      let data;
      if(Object.keys(this.option).length === 0){
        data = await fetch(this.path);
      }else{
         data = await fetch(this.path,this.option)
      }
      
     if(!data.ok){
      console.log(data.text())
       throw new Error("An error occurred.")
     }
     const response = await data.json()
     return response
   }
   async randomizeData(template,limit){
      let data = await this.LoadData();
      if(limit !== 0){
         data = LimitArray(data,limit)
      }
      const mapped = MapTemplate(data,template)
      return Randomize(mapped);
   }
   async RenderData(element,position,template,limit=0){
   try {
      const val = await this.randomizeData(template,limit);
      Render(val,element,position)
   } catch (error) {
     console.log(error) 
     element.innerHTML = `<div class="err-wrapper"> <p> An error occured </p> </div>`; 
   }
   }
}