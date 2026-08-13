import DataStorage from "./Datastorage.mjs";
import Api from "./api.mjs";

const dummyJsonUrl = import.meta.env.VITE_SERVER_URL;
const dummyjson = new Api(dummyJsonUrl);


const storage = new DataStorage()
export default  class CheckoutProcessor {
    constructor(shippingCost,total){
        this.cart = storage.Get("cart");
        this.orderHistory  = storage.Get("orderhistory");
        this.shippingCost = shippingCost
        this.total = total
    }
    async init(){
       await this.orderItems();
        storage.clear("cart",[])
    }
    async orderItems(){
        let  items = this.cart.map((v) => v.p_id )
        items = await dummyjson.GetProductsById(items)
        items = items.map( (v,index) => { return{"p":v,"qty":this.cart[index].qty}})
        items = items.map(PrepareCart)
        console.log(items)
        this.orderHistory.push({"orderDate":Date.now(),"items":items,"tax":12,"shipping":this.shippingCost,"total":this.total.toFixed(2)})
        storage.set("orderhistory",this.orderHistory)
    }
}
export function PrepareCart(product){
    let returnData = {};
    let singleItemCost = product.p.price * product.qty
    let qty = product.qty
    let name = product.p.title
    returnData.name = name
    returnData.price = singleItemCost.toFixed(2)
    returnData.qty = qty
    return returnData;
}