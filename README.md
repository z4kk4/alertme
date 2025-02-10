# AlertMe
A Node js app, that serves as a shopping personal email alert system. 
- The current version works only on Zalando's website. 
The app can be populated through a POST request to the end point ```/add-product```with a json payload 
containing an ```{email, link}```,
The email we want to send the alert to and the link of the product we want to be notified about, both email and link will be validated before saving.
- Once we have at least once product will then every 20 mins check if the product is available through checking for an add to cart selector (using pupeteer).
- Once the add to cart button is there, an HTML email is going to be sent to the provided address (using send grid mailing system.)

#
#### Note that Zalando has it's own alarming system, you can use the app if you maybe dont want to give your email and product preferences for free and keep them locally on your machine. 😉
#### Note that this a beginner project made solely for practice and improvement purposes, feel free to fork, make PRs and provide feedback. 
#
# AlertMe's future backlog:
- Containerize the app and upload image to Docker hub.
- Delete or flag a product after an email has already been sent about it.
- Support for more shopping platforms (manual).
- Intelligently figure out the platform and the availabality of the product.
- Security
- Migration from Array to Database
- Moving from a local (personal) to a global alert system over the internet.  (Weak).
# Run the app

- run ```npm install``` to install dependencies.
- get your own SENDGRID API key and paste as an environment variable in ```.env``` file.
- once the app is running, populate your products array with cURL commands or an API platfrom like Postman. <br>
cURL command: ```curl -L 'localhost:3000/add-product' -d '{"link":"https://en.zalando.de/vans-old-skool-unisex-sneaker-low...","email":"test@test.com"}'```
