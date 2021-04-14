const puppy = require("puppeteer");
const fs = require("fs");
const path = require('path');

let tab;
var category = "Software Development"

async function main(){
    let browser = await puppy.launch({
        headless:false,
        defaultViewport:false,
        // args:["--start-maximized"]
    });
    let tabs=await browser.pages();
    tab=tabs[0];  


    await tab.goto("https://internshala.com/fresher-jobs");
    await tab.click(".link_container");
    await tab.click(".chosen-container.chosen-container-multi");
    await tab.type(".chosen-container.chosen-container-multi.chosen-with-drop",category);
    await tab.keyboard.press("Enter");
    await tab.waitForTimeout(5000);
    
    //Job Position/Profile
    await tab.waitForSelector("div[class='heading_4_5 profile']");
    let jobProfile = await tab.$$("div[class='heading_4_5 profile']", {visible : true});

    //Company Name 
    await tab.waitForSelector("div[class='heading_6 company_name']");
    let comp = await tab.$$("div[class='heading_6 company_name']", {visible: true});
    // console.log(comp.length);

    //Location
    await tab.waitForSelector("p[id='location_names']");
    let Location = await tab.$$("p[id='location_names']", {visible: true});
    // console.log(Location.length);

    let TextURl = [];
    let companyURL = [];
    let locationURl = [];
    let url = [];

    for(let i = 0; i < jobProfile.length; i++){

        //Job profile text
        TextURl[i] = await tab.evaluate(function(ele){
            return ele.getElementsByTagName("a")[0].textContent;
            
        }, jobProfile[i]);

        //company text
        companyURL[i] = await tab.evaluate(function(ele){
            return ele.getElementsByTagName("a")[0].textContent;
            
        }, comp[i]);

        //location text
        locationURl[i] = await tab.evaluate(function(ele){
            return ele.getElementsByTagName("a")[0].textContent;
            
        }, Location[i]);

        //apply link
        url[i] = await tab.evaluate(function(ele){
            return ele.getElementsByTagName("a")[0].getAttribute("href");
            
        }, jobProfile[i]);
    }
    
    let arr = [];
        for(let i = 0; i < TextURl.length; i++) {
            arr.push("{ " + TextURl[i] + " ," + companyURL[i] + ", " + locationURl[i] + " --> " + "https://internshala.com" + url[i] + "\n}");
        }
        let writeData = arr.join("\r\n\n");
        fs.writeFileSync("jobs.txt", writeData)

    browser.close();
}

main();


