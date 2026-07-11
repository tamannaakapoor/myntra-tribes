const colors = [

"Black",
"White",
"Blue",
"Navy",
"Red",
"Green",
"Pink",
"Purple",
"Yellow",
"Orange",
"Grey",
"Gray",
"Brown",
"Beige",
"Cream",
"Olive",
"Maroon",
"Silver",
"Gold"

];

function detectColor(text){

    if(!text) return "Unknown";

    const lower=text.toLowerCase();

    for(const color of colors){

        if(lower.includes(color.toLowerCase()))
            return color;

    }

    return "Unknown";

}

module.exports=detectColor;