let puppeteer=require("puppeteer");
let fs=require("fs");
let credentialsFile = process.argv[2];
let noofquestions = process.argv[3];
let songname = process.argv[4];

let tab,url,pwd,email;
(async function(){
    let browser=await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximized","--disable-notifications"],
        slowMo:100
    })
    await fileread(credentialsFile)

    let noofpages=await browser.pages();
     tab=noofpages[0]



    await tab.goto("https://www.youtube.com/",{
        waitUntil:"networkidle2"
    });


    await totype("input[id='search']",songname);
    await navigator("#search-icon-legacy")
    await tab.waitForSelector("a[id='video-title'] yt-formatted-string")
    let song=await tab.$("a[id='video-title'] yt-formatted-string")
    await song.click()
    
    await delay(5000)
        
    tab=await browser.newPage();
    console.log("Enjoy the song!!!!")

    await tab.goto(url,{
        waitUntil:"networkidle0"
    });
    
    await totype("#id_login",email)
    console.log("username entered")
    await totype("#id_password",pwd)
    console.log("password entered")

  
    await navigator("#signin_btn");
    await tab.goto("https://leetcode.com/problemset/all/",{waitUntil:"networkidle0"});
    let homepageurl=await tab.url();
 
    for(let i=0;i<noofquestions;i++){
        let questionlist=await getquestions()
    
    await quessolver(tab,questionlist[i],i);
    await tab.goto(homepageurl,{waitUntil:"networkidle0"});
}
console.log(`Kudos, you just submitted ${noofquestions} on leetcode. Happy Coding!!!!`)

await browser.close();
   


})();
async function getquestions(){
    await tab.waitForSelector("table tbody[class='reactable-data'] tr div a");
    let questionlist=await tab.$$("table tbody[class='reactable-data'] tr div a")
    return questionlist
}
async function quessolver(tab,question,i){
    // await elementnav("table tbody[class='reactable-data'] tr div a")
    await Promise.all([tab.waitForNavigation({
        waitUntil:"networkidle0"
    }),question.click()])
    let queslink=await tab.url()

    await tab.goto(`${queslink}solution/`,{
        waitUntil:"networkidle2"
    });
    
 
await tab.waitForSelector("iframe");
const elementHandle = await tab.$("iframe");
const frame = await elementHandle.contentFrame();

    // await tab.waitForSelector("#app .editor textarea")
    await frame.waitForSelector(".btn.copy-code-btn.btn-default");
    await frame.click(".btn.copy-code-btn.btn-default");
    await elementclick(".react-codemirror2 textarea")
    await elementclick(".ant-select-arrow")
    await elementclick("li[data-cy='lang-select-Java']")
    await elementclick(".react-codemirror2 textarea")

    await cntrlkey('KeyA')
    // await tab.type("class Solution{}")
    if(i!=2&&i!=3){
    await tab.keyboard.type("class Solution{")}
    await cntrlkey('KeyV')
    if(i!=2&&i!=3){
    await tab.keyboard.type("}")}
    await elementclick("button[data-cy='submit-code-btn']")
    await delay(5000)
}

async function cntrlkey(key){
    await tab.keyboard.down('Control');
    await tab.keyboard.press(key);
    await tab.keyboard.up('Control');
}

async function fileread(filename){
    let data = await fs.promises.readFile(filename, "utf-8");
    let credentials = JSON.parse(data);
    url = credentials.url;
    email = credentials.email;
    pwd = credentials.pwd;
}

async function totype(selector,data){
    await tab.waitForSelector(selector);
    await tab.type(selector,data)
}
async function normalclick(selector){
    await tab.waitForSelector(selector);
    await tab.click(selector)
}
async function elementclick(selector){
    await tab.waitForSelector(selector);
    let ele=await tab.$(selector)
    await ele.click();
}
async function elementnav(selector){
    await tab.waitForSelector(selector);
    let ele=await tab.$$(selector)
    await Promise.all([tab.waitForNavigation({
        waitUntil:"networkidle0"
    }),ele.click()])
    
}
async function navigator(selector){
    await Promise.all([tab.waitForNavigation({
        waitUntil:"networkidle2"
    }),tab.click(selector)])
}

async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
