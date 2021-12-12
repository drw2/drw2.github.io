let constraints = { video: { facingMode: { exact: "environment" }}, audio: false};

const cameraView = document.querySelector("#camera--view");
const btnRound= document.querySelector(".btn-round");
const canvas= document.getElementById("canvas");
const cameraArea= document.querySelector(".camera--area");
const imgCapture= document.getElementById("img--capture");
const btnClose= document.querySelector(".close");
const width= screen.availWidth;
const height= screen.availHeight;

cameraStart(cameraView);

// 버튼이벤트
btnRound.addEventListener("click", e => {
    canvas.width= width;
    canvas.height= height;
    capture();

});

btnClose.addEventListener("click", e => {
    const junk = document.getElementsByTagName("img");
    junk[0].remove();
    imgCapture.classList.toggle("dp-none");
    cameraArea.classList.toggle("dp-none");
});





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

