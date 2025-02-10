const fs = require("fs");
const products = require("./names");

const { isValidEmail, isValidLink } = require("./utils");

console.log(products);
const requestHandler = (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json", Allow: "POST" });
    res.end(
      JSON.stringify({
        error: "Method not allowed",
        message: "This endpoint only supports POST requests.",
      })
    );
  } else if (req.url !== "/add-product") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Endpoint not found",
        message: `The requested path '${req.url}' does not exist.`,
      })
    );
  }
  let msg;
  if (req.url === "/add-product" && req.method === "POST") {
    // contact info and links to be collected later by link params so we can use curl with the api
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    return req.on("end", () => {
      const body = Buffer.concat(chunks).toString();
      const data = JSON.parse(body); // Parse JSON string into an object
      const link = data.link;
      const email = data.email;
      try {
        if (!isValidEmail(email)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              error: "Invalid email provided",
            })
          );
        }
        if (!isValidLink(link)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              error:
                "Invalid link provided, app currently only supports Zalando products",
            })
          );
        }
        products.push([link, email]);
        console.log(products);
        const updatedContent = `module.exports = ${JSON.stringify(
          products,
          null,
          2
        )};\n`;
        fs.writeFile("names.js", updatedContent, (err) => {
          if (err) {
            console.error("Error saving file:", err);
          } else {
            console.log("File updated successfully!");
          }
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify(
            {
              message: "Your data was received successfully \n",
              receivedData: data,
            },
            null,
            2
          )
        );
        res.end(
          JSON.stringify(
            {
              message:
                "You'll be notified via the given email once the product is available.",
            },
            null,
            2
          )
        );
      } catch (error) {
        console.log(error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify(
            {
              error: "Invalid JSON payload",
            },
            null,
            2
          )
        );
      }
    });
  }
};

exports.handler = requestHandler;
exports.sometext = "connected with file";

// curl command on windows: curl -X POST -H 'Content-Type:application/json' http://localhost:3000/add-product --data-binary "{\"link\":\"mario\", \"email\":\"secret\"}"
