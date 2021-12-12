// 카메라 세팅
let constraints = { video: { facingMode: "user"}, audio: false};



const cameraView = document.querySelector("#camera--view");
const btnRound= document.querySelector(".btn-round");
const canvas= document.getElementById("canvas");
const cameraArea= document.querySelector(".camera--area");
const imgCapture= document.getElementById("img--capture");
const btnClose= document.querySelector(".close");
const width= screen.availWidth;
const height= screen.availHeight;

// cameraStart(cameraView);

// 버튼이벤트
// btnRound.addEventListener("click", e => {
//     canvas.width= width;
//     canvas.height= height;
//     capture();

// });

// btnClose.addEventListener("click", e => {
//     const junk = document.getElementsByTagName("img");
//     junk[0].remove();
//     imgCapture.classList.toggle("dp-none");
//     cameraArea.classList.toggle("dp-none");
// });



class App{
    constructor(ctx, canvas){
        this.ctx = ctx;
        this.canvas = canvas;
        this.canvas.width = document.body.clientWidth*8;
        this.canvas.height = document.body.clientHeight*8;
    }
}

class ImgBack{
    constructor(ctx, width, height){
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.drawImg();
    }
    drawImg(){
        const imgRatio = imgData.height / imgData.width;
        const canvasRatio = this.height/ this.width;

        if (imgRatio > canvasRatio){
            const h = this.width* imgRatio;
            this.ctx.filter = "url(#noise)";
            this.ctx.drawImage(imgData, 0, (this.height-h)/2, this.width, h );
        }else if(imgRatio < canvasRatio){
            const w = this.width * canvasRatio / imgRatio;
            this.ctx.filter = "url(#noise)";
            this.ctx.drawImage(imgData, (this.width-w)/2, 0, w, this.height );
        }
    }
    applyBlur(){
        this.ctx.filter = "url(#noise)";
    }
}

let imgData = new Image();
imgData.src = imgTempData;

getImg();
function getImg(){
    const ctx = canvas.getContext("2d");
    new App(ctx, canvas);
    const imgCanvas = new ImgBack(ctx, canvas.width, canvas.height);
    imgCanvas.applyBlur();

    console.log(canvas.width);
}



// 캔버스로 카메라 캡쳐, img 태그로 주입
function insertImg(imageData){
    const imgPlace= document.querySelector(".img--place");
    const imgData = document.createElement("img");
    
    imgData.src= imageData;
    imgPlace.insertBefore(imgData, imgPlace.childNodes[0]);
    imgCapture.classList.toggle("dp-none");
    cameraArea.classList.toggle("dp-none");

}
function capture(){
    const content = canvas.getContext("2d");
    content.drawImage(cameraView, 0, 0, width, height);

    insertImg(canvas.toDataURL('image/png'));
}


// 카메라 화면 출력
function cameraStart(pos){
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream){
            track = stream.getTracks()[0];
            pos.srcObject = stream;
        })
        .catch(function(error){
            console.log(error.name+":"+error.message);
            alert("카메라를 사용할 수 없습니다.");
        })
}

