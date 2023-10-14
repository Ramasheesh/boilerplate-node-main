const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)

async function getTemplateHtml() {
console.log("Loading template file in memory")
try {
const invoicePath = path.resolve("formsTemplate/form 7.html");
return await readFile(invoicePath, 'utf8');
} catch (err) {
return Promise.reject("Could not load html template");
}
}
async function generatePdf() {
let data = 
    {

        customer: "super",
        firstName: "super",
        lastName: "admin",
        emailId: "ash@gmail.com",
        phone: "form no 7",
        country: "form",
        address: "india punjab mohhali sec-45D",
        scheduleDate:"12/24/2023",
        objectAddress:"punjab",
    
        constructionType:"constructionType"
          ,
        isAgeAppropriate:"isAgeAppropriate",
        isKfwFunding:"field one 2",
        // totalKfwFunding:"field 3",
        // yearOfConstruction:"field 3",
        // objectType:"field 3",
        // floor:"field 3",
        // propertyManager:"field 3",

        tiledComment:"electrician Company Name",
        trayComment:"111111111111111111111111111111111111",
        showerOtherComment:"00000000000000000000000000000000000000000",
        walledComment:"plumber Company Name",
        claddingComment:"2 plumber Company Name",
        bathtubOtherComment:"3 plumber Company Name",
        benchTiledComment:"1 carpenterCompanyName",
        foldingComment:"2 carpenter Phone",
        benchOtherComment:"3 carpenterContactPerson"
        ,
    
        walledComment:"electrician Company Name",
        glassComment:"111111111111111111111111111111111111",
        separationOtherComment:"00000000000000000000000000000000000000000",
        electricComment:"plumber Company Name",
        waterComment:"2 plumber Company Name",
        towelComment:"3 plumber Company Name",
        classicComment:"1 carpenterCompanyName",
        
    
        admitted:"electrician Company Name",
        putOn:"111111111111111111111111111111111111",
        specialNote:"00000000000000000000000000000000000000000",
        doubleVanity:"plumber Company Name",
        anyCase:"2 plumber Company Name",
        budgetFit:"budgetFit",
    
        anyCase:"electrician Company Name",
        budgetFit:"111111111111111111111111111111111111",
        mirrorCabinet:"00000000000000000000000000000000000000000",
        mirror:"plumber Company Name",
        
    
        cellingSuspended:"electrician Company Name",
        wallPlaster:"111111111111111111111111111111111111",
        wallWallPaper:"00000000000000000000000000000000000000000",
        anyCase:"electrician Company Name",
        cellingWallPaper:"plumber Company Name",
        
        recessedSpotlight:"recessedSpotlight",
        ceilingLight:"ceilingLight",
        wallLight:"wallLight",
        electricOnSite:"electricOnSite",

    
        windowNew:"windowNew",
        aboutWindow:"aboutWindow",
        paintingWindow:"paintingWindow",
        onSiteWindow:"onSiteWindow",
        doorNew:"doorNew",
        aboutDoor:"aboutDoor",
        paintDoor:"doorNew",
        onSiteDoor:"onSiteDoor",
    
    
    // variables: [
    //     {
    //       isChecked: true, // Example value for isChecked
    //       heading: "Furniture",
    //       label: "tall cabinet",
    //       value: "Your value for tallCabinet"
    //     },
    //     {
    //       isChecked: false, // Example value for isChecked
    //       heading: "", // Example value for heading
    //       label: "in any case",
    //       value: "Your value for anyCase"
    //     },
    //     // Add more objects for other variables
    //   ]
    
    
    
    
};
getTemplateHtml().then(async (res) => {
// Now we have the html code of our template in res object
// you can check by logging it on console
// console.log(res)

console.log("Compiing the template with handlebars")
let template = hb.compile(res, { strict: false });
// we have compile our code with handlebars
const result = template(data);

const html = result;
// we are using headless mode
const browser = await puppeteer.launch();
const page = await browser.newPage()
// We set the page content as the generated html by handlebars
await page.setContent(html)

// We use pdf function to generate the pdf in the same folder as this file.
await page.pdf({ path: 'formPdf.pdf', format: 'A4' })
await browser.close();
console.log("PDF Generated")
}).catch(err => {
console.error(err)
});
}
generatePdf();