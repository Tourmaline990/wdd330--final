

export default class Api{
   constructor(url){
    this.url = url
   }
   async GetProductByCategory(category){
    try {
       const data = await fetch(`${this.url}products/category/${category}`)
        if(!data.ok){
             console.log(data.status)
             throw new Error(`Error! ${await data.text()}`)
        }
        return await data.json(); 
    } catch (error) {
        console.log(error.message)
    }   
   }
   async GetAllProducts(){
       try {
       const data = await fetch(`${this.url}products?limit=0`)
        if(!data.ok){
             console.log(data.status)
             throw new Error(`Error! ${await data.text()}`)
        }
        return await data.json(); 
    } catch (error) {
        console.log(error.message)
    }   
   }
   async SearchByProductName(productName){
       try {
          const data = await fetch(`${this.url}products/search?q=${productName}&limit=0`)
           if(!data.ok){
             console.log(data.status)
             throw new Error(`Error! ${await data.text()}`)
        }
        return await data.json(); 
    } catch (error) {
        console.log(error.message)
    } 
   }
   async SearchById(p_Id){
        try {
          const data = await fetch(`${this.url}products/${p_Id}`)
           if(!data.ok){
             console.log(data.status)
             throw new Error(`Error! ${await data.text()}`)
        }
          return await data.json(); 
        } catch (error) {
        console.log(error.message)
    } 
   }
   async GetAllCategories(){
      try {
          const data = await fetch(`${this.url}products/categories`)
           if(!data.ok){
             console.log(data.status)
             throw new Error(`Error! ${await data.text()}`)
            }
          return await data.json(); 
        } catch (error) {
        console.log(error.message)
    } 
   }
   async GetBrands(){
      const data = await fetch(`${this.url}products?limit=0&select=brand`)
      if(!data.ok){
        throw new Error(`Error! ${await data.text()}`)
      }
      const response = await data.json();
      return fil(response.products)
   } 
   async GetProductsById(idArr){
      let data = await this.GetAllProducts()
        data = data.products.filter((item)=>{
            idArr.includes(item.id)
        })
        console.log(data)
        return data
   }  
   
}

function fil(arr){
    const Arr = []
   arr.forEach(item => {
     if(!Arr.includes(item.brand) && item.brand !== undefined){
        Arr.push(item.brand)
     }
   });
   return Arr
}