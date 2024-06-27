import React, { useState, useEffect, useRef } from 'react';
import colorjs from 'colorjs.io';
import "./PalettePicker.css";

const PalettePicker = () => {
  const [currentColor, setCurrentColor] = useState("skyblue");
  const [currentType, setCurrentType] = useState("analogous");
  const [currentCount, setCurrentCount] = useState(6);
  const [imageColors, setImageColors] = useState([]);
  const paletteContainerRef = useRef(null);
  const relatedContainerRef = useRef(null);
  const imageColorsWrapperRef = useRef(null);
  const imageColorsContainerRef = useRef(null);

  useEffect(() => {
    generatePaletteHtml(currentType, paletteContainerRef.current);
    generatePaletteHtml("related", relatedContainerRef.current);
  }, [currentColor, currentType, currentCount]);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    if (isValidColor(value)) {
      setCurrentColor(value);
      generatePaletteHtml(currentType, paletteContainerRef.current);
      generatePaletteHtml("related", relatedContainerRef.current);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
          extractColorsFromImage(image);
        }
      }
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setCurrentType(value);
    generatePaletteHtml(value, paletteContainerRef.current);
  };

  const handleCountChange = (e) => {
    const value = e.target.value;
    setCurrentCount(parseInt(value));
    generatePaletteHtml(currentType, paletteContainerRef.current);
  };

  const handleRandomClick = () => {
    const randomColor = getRandomColor();
    setCurrentColor(randomColor);
    generatePaletteHtml(currentType, paletteContainerRef.current);
    generatePaletteHtml("related", relatedContainerRef.current);

    const paletteColors = paletteContainerRef.current.querySelectorAll(".color");
    paletteColors.forEach((colorEl, index) => {
      setTimeout(() => {
        colorEl.classList.add("flip-left-to-right");
      }, index * 100);
    });

    const relatedColors = relatedContainerRef.current.querySelectorAll(".color");
    relatedColors.forEach((colorEl, index) => {
      setTimeout(() => {
        colorEl.classList.add("flip-right-to-left");
      }, index * 100);
    });
  };

  function generateAnalogousPalette(hsl, count) {
    const palette = [];
    const [hue, saturation, lightness] = hsl;
    for (let i = 0; i < count; i++) {
      let newHue = hue + 30 * i;
      if (newHue > 360) {
        newHue -= 360;
      }
      palette.push([newHue, saturation, lightness]);
    }
    return palette;
  }

  function generateMonochromaticPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;

    for (let i = 0; i < count; i++) {
      let newLightness = lightness + 10 * i;
      if (newLightness > 100) {
        newLightness -= 100;
      }
      palette.push([hue, saturation, newLightness]);
    }
    return palette;
  }

  function generateTriadicPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    for (let i = 0; i < count; i++) {
      let newHue = hue + 120 * i;
      if (newHue > 360) {
        newHue -= 360;
      }
      palette.push([newHue, saturation, lightness]);
    }
    return palette;
  }

  function generateCompoundPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    for (let i = 0; i < count; i++) {
      let newHue = hue + 150 * i;
      if (newHue > 360) {
        newHue -= 360;
      }
      palette.push([newHue, saturation, lightness]);
    }
    return palette;
  }

  function generateShadesPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    for (let i = 0; i < count; i++) {
      let newSaturation = saturation + 10 * i;
      if (newSaturation > 100) {
        newSaturation -= 100;
      }
      palette.push([hue, newSaturation, lightness]);
    }
    return palette;
  }

  function generateTetradicPalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    for (let i = 0; i < count; i++) {
      let newHue = hue + 90 * i;
      if (newHue > 360) {
        newHue -= 360;
      }
      palette.push([newHue, saturation, lightness]);
    }
    return palette;
  }

  function generateSquarePalette(hsl, count) {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    for (let i = 0; i < count; i++) {
      let newHue = hue + 60 * i;
      if (newHue > 360) {
        newHue -= 360;
      }
      palette.push([newHue, saturation, lightness]);
    }
    return palette;
  }

  function generateRelatedColorPalette(hsl, count) {
    const palette = [];
    const [hue, saturation, lightness] = hsl;

    palette.push([hue, (saturation + 20) % 100, lightness]);
    palette.push([hue, (saturation - 20) % 100, lightness]);
    palette.push([hue, saturation, (lightness + 20) % 100]);
    palette.push([hue, saturation, (lightness - 20) % 100]);
    palette.push([(hue + 20) % 360, saturation, lightness]);
    palette.push([(hue - 20) % 360, saturation, lightness]);

    for (let i = palette.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [palette[i], palette[j]] = [palette[j], palette[i]];
    }

    return palette;
  }

  function generatePaletteHtml(type, container) {
    const hsl = getHslFromColor(currentColor);
    if (!hsl) {
      console.error('Invalid HSL value');
      return;
    }

    let palette;
    if (type === "image-colors") {
      palette = imageColors;
    } else {
      palette = generatePalette(hsl, type, currentCount);
    }

    container.innerHTML = "";
    palette.forEach((color) => {
      if (type !== "image-colors") {
        color = hslToHex(color);
      }
      const colorEl = document.createElement("div");
      colorEl.classList.add("color");
      colorEl.style.backgroundColor = color;
      colorEl.innerHTML = `
        <div class="overlay">
          <div class="icons">
            <div class="copy-color" title="Copy color code">
              <i class="bx bxs-copy"></i>
            </div>
            <div class="generate-palette" title="Generate Palette">
              <i class="bx bxs-palette"></i>
            </div>
          </div>
          <div class="code">${color}</div>
        </div>
      `;
      container.appendChild(colorEl);
    });
  }

  function getHslFromColor(color) {
    if (isValidColor(color)) {
      const temp = document.createElement("div");
      temp.style.color = color;
      document.body.appendChild(temp);
      const style = window.getComputedStyle(temp);
      const rgb = style.getPropertyValue("color");
      document.body.removeChild(temp);
      return rgbToHsl(rgb);
    }
    return null;
  }

  function isValidColor(color) {
    return CSS.supports("color", color);
  }

  function rgbToHsl(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    const r1 = r / 255;
    const g1 = g / 255;
    const b1 = b / 255;
    const max = Math.max(r1, g1, b1);
    const min = Math.min(r1, g1, b1);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
        case g1: h = (b1 - r1) / d + 2; break;
        case b1: h = (r1 - g1) / d + 4; break;
        default: break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function hslToHex([h, s, l]) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function generatePalette(hsl, type, count) {
    switch (type) {
      case "analogous":
        return generateAnalogousPalette(hsl, count);
      case "monochromatic":
        return generateMonochromaticPalette(hsl, count);
      case "triadic":
        return generateTriadicPalette(hsl, count);
      case "compound":
        return generateCompoundPalette(hsl, count);
      case "shades":
        return generateShadesPalette(hsl, count);
      case "tetradic":
        return generateTetradicPalette(hsl, count);
      case "square":
        return generateSquarePalette(hsl, count);
      case "related":
        return generateRelatedColorPalette(hsl, count);
      default:
        return [];
    }
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function extractColorsFromImage(image) {
    colorjs.prominent(image, { amount: 6, format: "hex" }).then((colors) => {
      setImageColors(colors);
      generatePaletteHtml("image-colors", imageColorsContainerRef.current);
      imageColorsWrapperRef.current.classList.remove("hidden");
    });
  }

  function downloadPalette(format, name) {
    const paletteColors = paletteContainerRef.current.querySelectorAll(".color");
    const colors = Array.from(paletteColors).map(colorEl => colorEl.style.backgroundColor);
    switch (format) {
      case "png":
        downloadPalettePng(colors, name);
        break;
      case "svg":
        downloadPaletteSvg(colors, name);
        break;
      case "css":
        downloadPaletteCss(colors, name);
        break;
      case "json":
        downloadPaletteJson(colors, name);
        break;
      default:
        break;
    }
  }

  function downloadPalettePng(colors, name) {
    const canvas = document.createElement("canvas");
    canvas.width = colors.length * 200;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(index * 200, 0, 200, 1000);
    });
    const link = document.createElement("a");
    link.download = name + ".png";
    link.href = canvas.toDataURL();
    link.click();
  }

  function downloadPaletteSvg(colors, name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewbox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    colors.forEach((color, index) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const width = 100 / colors.length;
      rect.setAttribute("x", index * width);
      rect.setAttribute("y", "0");
      rect.setAttribute("width", width);
      rect.setAttribute("height", 100);
      rect.setAttribute("fill", color);
      svg.appendChild(rect);
    });

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.download = name + ".svg";
    downloadLink.href = svgUrl;
    downloadLink.click();
  }

  function downloadPaletteCss(colors, name) {
    const css = `:root {
      ${colors.map((color, index) => `--color-${index + 1}:${color};`).join("\n")}
    }`;
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = name + ".css";
    link.href = url;
    link.click();
  }

  function downloadPaletteJson(colors, name) {
    const json = JSON.stringify(colors);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = name + ".json";
    link.href = url;
    link.click();
  }

  return (
    <div className="container">
      <h1 className="title">Palette Picker</h1>
      <p className="desc">Generate Some Awesome Palettes</p>
      <div className="search">
        <div className="code">
          <input type="text" id="search-input" onChange={handleSearchInput} placeholder="Color code or name" />
          <span className="search-color" style={{ backgroundColor: currentColor }}></span>
        </div>
        <label className="image" htmlFor="search-image">
          <i className="bx bxs-image"></i>
          <input type="file" id="search-image" hidden onChange={handleImageChange} />
        </label>
      </div>
      <div className="options">
        <select id="palette-type" onChange={handleTypeChange}>
          <option value="analogous">Analogous</option>
          <option value="monochromatic">Monochromatic</option>
          <option value="triadic">Triadic</option>
          <option value="compound">Compound</option>
          <option value="shades">Shades</option>
          <option value="tetradic">Tetradic</option>
          <option value="square">Square</option>
        </select>
        <select id="palette-count" onChange={handleCountChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
      </div>
      <div className="or" id="random-btn" onClick={handleRandomClick}>Or Generate Random Colors</div>
      <p className="label" id="type-text">{currentType} Palette</p>
      <div className="palette" id="palette" ref={paletteContainerRef}></div>
      <p className="label">Related Colors</p>
      <div className="palette" id="related" ref={relatedContainerRef}></div>
      <div className="image-colors-wrapper hidden" ref={imageColorsWrapperRef}>
        <p className="label">Image Colors</p>
        <div className="palette" id="image-colors" ref={imageColorsContainerRef}></div>
      </div>
      <div className="or">Download Palette</div>
      <div className="options">
        <input type="text" id="download-name" placeholder="filename" />
      </div>
      <div className="options">
        <select id="download-format">
          <option value="png">PNG</option>
          <option value="svg">SVG</option>
          <option value="css">CSS</option>
          <option value="json">Json</option>
        </select>
        <button className="btn" id="download-btn" onClick={() => downloadPalette(document.querySelector('#download-format').value, document.querySelector('#download-name').value)}>Download</button>
      </div>
      <div className="toast">Toast Message</div>
      <label htmlFor="toggle" className="switch">
        <input type="checkbox" id="toggle" />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default PalettePicker;