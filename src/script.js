const searchInput = document.querySelector("#search-input"),
searchColor = document.querySelector(".search-color"),
searchImage = document.querySelector("#search-image"),
typeSelect = document.querySelector("#palette-type"),
countSelect = document.querySelector("#palette-count"),
randomBtn = document.querySelector("#random-btn"),
paletteCountainer = document.querySelector("#palette"),
relatedContainer = document.querySelector("#related");

let currentColor = "skyblue",
currentType = "analogous",
currentCount = 6,
imageColors = [];

// All function to generate different palettes

function generateAnalogousPalette(hsl,count) {
    // hsl is color, count mean quantity of colors
    const palette =[];
    // get hue, saturation, lighteness from hsl, this is the reason to use hsl
    const [hue, saturation, lightness] = hsl;

    // generate colors equals count
    for (let i = 0; i < count; i++) {
        // add 30 and multiple to index for every color
        let newHue = hue +30 * i;
        // new hue can be greater then 360 so check if greater than hue -360
        if(newHue > 360) {
            newHue -= 360;
        }
        // add new color in palette array
        palette.push([newHue, saturation, lightness]);
    }
        // after getting all colors return palette
        return palette;
    }

    // lets test it

    let hsl = [155, 60, 60];
    let palette = generateAnalogousPalette(hsl, 6);
    console.log(palette);
