import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        // add my new pages here
        main: resolve(__dirname, "src/index.html"),
        category: resolve(__dirname, "src/category/index.html"),
        product_page: resolve(__dirname, "src/productPage/index.html"),
        error_page: resolve(__dirname, "src/error/error.html"),
        cart: resolve(__dirname, "src/cart/cart.html"),
        login: resolve(__dirname, "src/user/login.html"),
        signup: resolve(__dirname, "src/user/signup.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        // main: resolve(__dirname, "src/index.html"),
        // cart: resolve(__dirname, "src/cart/index.html"),
        // checkout: resolve(__dirname, "src/checkout/index.html"),
        // product: resolve(__dirname, "src/product_pages/index.html"),
        // product_listing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
});
