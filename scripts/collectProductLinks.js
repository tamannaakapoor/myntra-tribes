const { chromium } = require("playwright");
const fs = require("fs");
const categories = require("./categories");
const tribeMap = require("./tribeMap");

(async () => {

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage({
        viewport: {
            width: 1400,
            height: 900
        }
    });

    let allLinks = [];

    for(const cat of categories){

        console.log(`\nScraping ${cat.category}`);

        await page.goto(cat.url,{
            waitUntil:"networkidle"
        });

        let previous = 0;
        let same = 0;

        while(true){

            const current = await page.$$eval(
                "li.product-base",
                items=>items.length
            );

            console.log(current);

            if(current===previous)
                same++;
            else
                same=0;

            if(same>=3)
                break;

            previous=current;

            await page.evaluate(()=>{
                window.scrollTo(0,document.body.scrollHeight);
            });

            await page.waitForTimeout(2000);
        }

        const links = await page.$$eval(
            "li.product-base",
            (cards,meta)=>{

                return cards.map(card=>{

                    const a=card.querySelector("a");

                    return{

                        url:a?.href || "",

                        category:meta.category,

                        gender:meta.gender,

                        tribeId:meta.tribeId

                    };

                });

            },
            {
                category:cat.category,
                gender:cat.gender,
                tribeId:tribeMap[cat.tribe]
            }
        );

        allLinks.push(...links);

    }

    // remove duplicates

    const unique=[
        ...new Map(
            allLinks.map(item=>[
                item.url,
                item
            ])
        ).values()
    ];

    fs.writeFileSync(
        "./scripts/output/productLinks.json",
        JSON.stringify(unique,null,2)
    );

    console.log(`Saved ${unique.length} links`);

    await browser.close();

})();