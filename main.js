
const sectionCanvas = document.querySelector("#can--vas"),
    clsBtn = sectionCanvas.querySelector(".close"),
    inputSlider = sectionCanvas.querySelector("#resolution"),
    inputFile = sectionCanvas.querySelector("#pic"),
    canvas = sectionCanvas.querySelector("#canvas"),
    btnSave = sectionCanvas.querySelector("#savePic"),
    btnEdit = sectionCanvas.querySelector("#editText"),
    btnClose = sectionCanvas.querySelector("#close"),
    btnChange = sectionCanvas.querySelector("#changeText"),
    ctx = canvas.getContext("2d");


/// 이미지 데이터 불러오기
let imgData = new Image();
imgData.src = imgTempData;

// 픽셀별 위치, 심볼, 색
class Cell{
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

class Ascii{
    constructor(ctx, width, height ,cellSize, text){
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.text = text;
        this.drawImg();
        this.pixels = this.ctx.getImageData(0,0, this.width, this.height);
        this.calcDataPoint();
        this.mergeLetter = false;
    }
    calcDataPoint(){
        this.symbolArr = Array.from(this.text);
        const quota = Math.round(235 / this.symbolArr.length);
        this.dataPoint =[];
        this.symbolArr.forEach((d, i) => this.dataPoint.push(quota*(i+1)+20));
    }
    drawImg(){
        const imgRatio = imgData.height / imgData.width;
        const canvasRatio = this.height/ this.width;

        if (imgRatio > canvasRatio){
            const h = this.width* imgRatio;
            this.ctx.drawImage(imgData, 0, (this.height-h)/2, this.width, h );
        }else if(imgRatio < canvasRatio){
            const w = this.width * canvasRatio / imgRatio;
            this.ctx.drawImage(imgData, (this.width-w)/2, 0, w, this.height );
        }
    }
    createSymbol(colorValue,dataPoint,symbolArr){
        let data;
        dataPoint.forEach((d, i) =>{
            if(dataPoint.length <= 3 && colorValue < d) return data = symbolArr[i];
            else if(colorValue > d) return data = symbolArr[i];
            else return "";
        });
        return data;
    }
    convertToSymbol(g){
        if (g > 0) return "NOCTURNAL";
        else return "";
    }
    convertMergeSymbol(colorValue,dataPoint,symbolArr, text){
        const randNum = Math.round(Math.random()* (text.length - 0) + 0);
        let data = text.substring(0,randNum);
        
        if (colorValue > 0) return data;
        else return "";
    }
    scanImg(f){
        this.imgCell = [];
        for (let y = 0; y < this.pixels.height; y+= this.cellSize) {
            for (let x = 0; x < this.pixels.width; x+= this.cellSize) {
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.pixels.width) + posX;

                if(this.pixels.data[pos + 3] > 128){
                    const red = this.pixels.data[pos];
                    const green = this.pixels.data[pos + 1];
                    const blue = this.pixels.data[pos + 2];
                    const total = red + green + blue;
                    const avrgColorValue = total / 3;

                    const color = "rgb("+red+","+green+","+blue+")";
                    const symbol = f(avrgColorValue, this.dataPoint, this.symbolArr, this.text);
                    if (total> 200) this.imgCell.push(new Cell(x, y, symbol, color));
                }
            }
        }
    }
    drawAscii(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.imgCell.forEach(d => {

            d.draw(this.ctx);
        });
    }
    draw(){

        console.log(this.dataPoint);
        console.log(this.symbolArr);
        if (this.mergeLetter === false) this.scanImg(this.createSymbol);
        else if(this.mergeLetter === true) this.scanImg(this.convertMergeSymbol);
        this.drawAscii();

    }
    updateImg(file){
        imgData.src = file;
        imgData.onload =() => {
            this.drawImg();
            this.pixels = this.ctx.getImageData(0,0, this.width, this.height);
            this.draw();
        }
    }
}


class App{
    constructor(ctx, canvas){
        this.ctx = ctx;
        this.canvas = canvas;
        this.canvas.width = document.body.clientWidth*6;
        this.canvas.height = document.body.clientHeight*6;
    }
}

let textSymbol = "#&Ξ∑∥ф≡》＋＝≪━‡○";
let effect;
// 캔버스 리사이즈 
window.onload = () => {
    new App(ctx, canvas);
    effect = new Ascii(ctx, canvas.width, canvas.height, 10 , textSymbol);
    effect.draw();
}

inputSlider.addEventListener("change", e => {
    ctx.font = parseInt(e.target.value)*1.2 +"px NanumSquareB";
    effect.cellSize = parseInt(e.target.value);
    effect.draw();
});

inputFile.addEventListener("change", e =>{
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    const loadIcon = sectionCanvas.querySelector("#loading");
    loadIcon.style.display = "block";
    
    reader.onload = () => {
        effect.updateImg(reader.result);
        loadIcon.style.display = "none";
    }
    reader.onerror = () => {
        alert("이미지 오류");
    }
});

btnSave.addEventListener("click", e => {
    savePng();
});

btnEdit.addEventListener("click", e =>{
    const modal = sectionCanvas.querySelector(".modal-small");
    if (modal.style.display == "none"){
        modal.style.display ="flex";
    }else{
        modal.style.display = "none";
    }
});

btnClose.addEventListener("click", e =>{
    const inputText= sectionCanvas.querySelector("input").value;
    if (inputText.length === 0){
        effect.text = textSymbol;
    }else {
        effect.text = inputText;
    }
    effect.calcDataPoint();
    effect.draw();
    const modal = sectionCanvas.querySelector(".modal-small");
        modal.style.display = "none";
});

btnChange.addEventListener("click", e =>{
    if(effect.mergeLetter === false) effect.mergeLetter = true;
    else if(effect.mergeLetter === true) effect.mergeLetter = false;
    effect.draw();
});

function savePng(){
    const link = document.createElement("a");
    link.download = "image.png";
    canvas.toBlob(function(blob){
        link.href = URL.createObjectURL(blob);
        link.click();
      },'image/png');
}