export default class DataStorage{
    init(){
       this.set("user",{})
       this.set("login",{})
       this.set("orderhistory",[])
       this.set("viewed",[])
       this.set("searched",[])
       this.set("cart",[]);
       this.set("wishlist",[])
       this.set("locationRedirect","")
    }
    set(key,value){
      localStorage.setItem(key,JSON.stringify(value))
    }
    Get(key,status=false){
     let val = localStorage.getItem(key)
      val = JSON.parse(val)
      if(status){
         if(localStorage.getItem(key) !== null  && localStorage.getItem(key).length >= 0){
              return true
         }
         else{
          return false
         }
      }
      return val
    }
    clear(key,value = null, clear=false){
      if(clear){
       localStorage.removeItem(key)
      }
      if(value !== null){
          this.set(key,value)
      }
    }
    IsInit(){
      let keys = ["user","login","orderhistory","viewed","searched","cart","wishlist"]
      let cleared_keys = keys.filter(k => this.Get(k,true) === false)
      if(cleared_keys.length <= 2){
         cleared_keys.forEach( c => {
           let v;
          if(c === "user" || c === "login"){
                v = {}
          }
          else if(c === "locationRedirect"){
              v = ""
          }
          else{
            v = []
          }
         this.set(c,v)})
         return true
      }
      else{
        return false
      }
      // return keys.every(k => !! this.Get(k,true))
    }
    logInCountDown(){
      let login = this.Get("login")
      if(login.isLoggedIn === undefined || login.isLoggedIn === null){
            return;
      }
      else{
         if(Date.now() < login.expiresAt){
          login.isLoggedIn = true
          this.set("login",login)
          }
          else{
             login.isLoggedIn = false
             this.set("login",login)
           }
      }                        
    }
}