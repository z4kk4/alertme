require("dotenv").config();
const puppeteer = require("puppeteer");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



async function goThroughProducts(products) {
  console.log("Going through products...");
  for (const product of products) {
    let isProdAvailable = false;
    //check for the add to cart selector #buyBoxAccordion #availability
    isProdAvailable = await checkProductAvailability(product[0]);
    if (isProdAvailable === true) {
      sendEmail(product[1], product[0]);
    } else {
      console.log("Product still unavailable, checking next one...");
      continue;
    }
  }
}



async function checkProductAvailability(link) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  const selector =
    "::-p-xpath(//*[contains(text(),'Add to bag') or contains(text(),'In den Warenkorb')])";

  try {
    const element = await page.waitForSelector(selector, { timeout: 5000 });
    if (element) {
      browser.close();
      return true;
    }
  } catch (error) {
    browser.close();
    return false;
  }
}



async function sendEmail(mail, link) {
  const msg = {
    to: mail, 
    from: "alertme@zakariamarref.com", // Change to your email address
    subject: "Your Product is Available Now on Zalando 🚨🚨🚨!",
    html: `<table style="width: 100%; font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px;"><tr><td><div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto;">  <div style="font-size: 18px; font-weight: bold; color: #0073e6; margin-bottom: 20px; display: flex; justify-content: center; align-items: center;"><span style="color: #0073e6;">Alert Me</span></div><h1 style="color: #333333; font-size: 24px; margin: 0;">Happy shopping 🫰🏼</h1><p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 10px 0;">The product you wanted us to notify you about is now available at Zalando.</p><strong style="display: block; margin-top: 20px;">Follow the link <a href="${link}" style="color: #0073e6; text-decoration: none; font-weight: bold;">here</a> to check it.</strong></div></td></tr></table>`,
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    return console.error(error);
  }
}



function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}



function isValidLink(url) {
  const zalandoLinkRegex = /^https:\/\/(?:\w{2}\.)?zalando\.de\//i;
  return zalandoLinkRegex.test(url);
}

exports.goThroughProducts = goThroughProducts;
exports.isValidEmail = isValidEmail;
exports.isValidLink = isValidLink;
