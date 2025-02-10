const http = require("http");

const products = require("./names");
const routes = require("./routes");

const { goThroughProducts } = require("./utils");

if (products.length > 0) { 
  setInterval(() => {
    goThroughProducts(products);
  }, 20 * 60 * 1000); //go through products list every 20 minutes if there are products
}

const server = http.createServer(routes.handler);

server.listen(3000);
