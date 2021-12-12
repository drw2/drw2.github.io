const enterSection = document.getElementById("enter--text"),
    input = enterSection.querySelector("input"),
    submit = enterSection.querySelector(".submit"),
    message = enterSection.querySelector(".message"),
    sectionCanvas = document.querySelector("#can--vas"),
    clsBtn = sectionCanvas.querySelector(".close"),
    canvas = sectionCanvas.querySelector("#canvas"),
    ctx = canvas.getContext("2d");


class Path{
    constructor(total, start){
        this.total = total;
        this.start = start;

        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.create();
    }
    create(){
        this.points = [];
        this.gap = Math.ceil(this.stageHeight / (this.total - 1));

        for (let i = 0; i < this.total; i++) {
            this.points[i] = {
                x: this.getX(),
                y: this.start.y - (this.gap * i),
            }
        }
        this.points.splice(0, 1, {x : this.start.x, y: this.start.y});
    }
    getX(){
        const min = 1;
        const max = this.stageWidth - min;
        return Math.round(min + Math.random() * max);
    } 
    draw(ctx){
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";

        let cur = this.points[0];
        let prev = cur;


        let dots = [];

        ctx.moveTo(cur.x, cur.y);
        let prevCx = cur.x;
        let prevCy = cur.y;


        for (let i = 1; i < this.points.length; i++) {
            cur = this.points[i];
            const cx = (prev.x + cur.x) / 2;
            const cy = (prev.y + cur.y) / 2;

            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
            dots.push({
                x1: prevCx,
                y1: prevCy,
                x2: prev.x,
                y2: prev.y,
                x3: cx,
                y3: cy,
            });
            prev = cur;
            prevCx = cx;
            prevCy = cy;
        }
        ctx.stroke();
        ctx.closePath();
    }
    getQuadValue(p0, p1, p2, t){
        return (1 - t) * (1 -t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2; 
    }
    getPointOnQuad(x1, y1, x2, y2, x3, y3, t){
        return{
            x : this.getQuadValue(x1, x2, x3, t),
            x : this.getQuadValue(y1, y2, y3, t),
        }
    }

}
class Particle {
    constructor(x, y, randNum){
        this.x = x;
        this.y = y;
        this.randNum = randNum;
        this.posX = this.getRandom(-1, 1);
        this.posY = this.getRandom(-1, 1);

        this.size= 1;
        // this.line = new Path(6, {x:this.x, y: this.y}).draw(ctx);
    }
    draw(ctx){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
    }
    move(){
        this.x += this.posX;
        this.y += this.posY;
    }
    getRandom(min, max){
        return Math.random() * (max - min) + min;
    }
}   
class Text{
    constructor(txt, ctx){
        this.txt = txt;
        this.ctx = ctx;
        

        
        // 캡쳐샷의 단위 면적 
        //전체면적을 gap을 기준으로 분할
        //ex> density = 3 : 가로세로 3px을 기준으로 픽셀을 묶음  
        this.density = 2;

        // 파티클이 가진 randNum과 timeNum을 비교해
        // 동일할 때 확산이 시작됨
        this.timeNum = 0;
        this.timer();

        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.updateText();
        this.imgData = this.ctx.getImageData(0, 0, this.stageWidth, this.stageHeight);

        // 텍스트 모양이 맞춰 파티클 생성
        this.arr = [];
        this.particle();
    }

    updateText(){
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.fontSize = Math.round(this.stageWidth / this.txt.length);
        this.ctx.font = ` ${this.fontSize}px Dohyeon`;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.textBaseline = "middle";

        const fontPos = this.ctx.measureText(this.txt);
        this.ctx.fillText(
            this.txt,
            (this.stageWidth - fontPos.width) / 2,
            fontPos.actualBoundingBoxAscent +
            fontPos.actualBoundingBoxDescent +
            ((this.stageHeight-this.fontSize) / 2)
        );

    }
    particle(){
        for(let y = 0; y < this.imgData.height; y += this.density){
            for(let x = 0; x < this.imgData.width; x += this.density){
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.imgData.width) + posX;

                if( this.imgData.data[pos + 3] > 128){
                    const num = x * Math.random().toFixed(1);
                    this.arr.push(new Particle(x, y,  num));
                }
            }
        }
        console.log(this.arr);
    }   
    animate(){
        this.raf = window.requestAnimationFrame(this.animate.bind(this));
        this.draw();
    }
    draw(){
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.arr.forEach((particle, i, o) => {
            
            particle.draw(this.ctx);

            if(particle.y < 0){ o.splice(i, 1);}
            if (this.timeNum >= particle.randNum){
                particle.move();
            }
        });
    }
    timer(){
        let timerId = setInterval(() => this.timeNum += Math.random(), Math.random());
    }
}

class App{
    constructor(ctx, canvas){
        this.ctx = ctx;
        this.canvas = canvas;
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }
}



// 캔버스 리사이즈 
window.onload = () => {
    new App(ctx, canvas);
}

// 버튼 이벤트
submit.addEventListener("click", e => {
    const text = input.value;
    if (!text.length == 0){
        let textSpread = new Text(text, ctx);
        textSpread.animate();

        changeSection(sectionCanvas, enterSection);
        input.value = "";
        message.style.opacity = "1";
    } else{
        message.classList.remove("dp-none");
    }

});

// 엔터키 이벤트
input.addEventListener("keyup", e => {
    if(!input.value.length == 0){
        message.style.opacity = "0";
    }else{
        message.style.opacity = "1";
    }
    // new Text(input.value, ctx).animate();

    if(e.key == "Enter"){
        new Text(input.value, ctx).animate();
        changeSection(sectionCanvas, enterSection);
        input.value = "";
    }
});

// 닫기
clsBtn.addEventListener("click", e => {
    window.location.reload()
});


function changeSection(target1, target2){
    target1.classList.toggle("dp-none");
    target2.classList.toggle("dp-none");
}
