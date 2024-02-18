function draw() {
    // переопределение ширины и длины холста
    resize(canvas);
    // очистка холста
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.rect(0, 0, dw, dh);
    ctx.fill();
    // отрисовка добавочных элементов
    drawThings(ctx);
    // отрисовка surface
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.rect(0, r(dh - surface), dw, r(surface));
    ctx.fill();
    // отрисовка параметров экрана
    ctx.fillStyle = "black";
    ctx.font = "48px sans-serif"; // высота шрифта - 48px
    ctx.textBaseline = "top";
    ctx.fillText(text, dw - ctx.measureText(text).width - 16, 16); // отрисовка в углу с отступами 16
}

function resize(canvas) {
    // корректировка текста
    text = `(${dw}; ${dh})`;
    // получаем размер HTML-элемента canvas
    dw  = canvas.clientWidth;
    dh = canvas.clientHeight;
    surface = dh/8;
    // проверяем, отличается ли размер canvas
    if (canvas.width  != dw || canvas.height != dh) {   
      // подгоняем размер буфера отрисовки под размер HTML-элемента
      canvas.width  = dw;
      canvas.height = dh;
    }
    things = [new Thing('wall', 100, 40, 100), new Thing('sun', 200, 30)];
}

class Thing {
    constructor(type, x, width, height) {
        this.type = type; // для wall используются все аргументы, но для sun только type, x, y и width
        this.x = x;
        this.width = width;
        this.height = height;
        if (type == 'wall') this.y = dh - height - surface;
        else if (type == 'sun') this.y = dh / 8; // индивидуальная высота для разных элементов
    }
}

function drawThings(ctx) { // рисование элементов
    for (const i of things) {
        ctx.beginPath();
        if (i.type === 'wall') { // прорисовка стены
            ctx.fillStyle = "gray";
            ctx.rect(i.x, r(i.y), i.width, r(i.height)); // округляем только высоту, т.к. такое сглаживание заметнее, чем по ширине
            ctx.fill();
        } else if (i.type === 'sun') { // прорисовка солнца
            ctx.fillStyle = "yellow";
            ctx.arc(i.x, r(i.y), i.width, 0, R);
            ctx.fill();
            drawRays(ctx, i);
            ctx.beginPath();
            ctx.strokeStyle = "orange";
            ctx.arc(i.x, r(i.y), i.width, 0, R);
            ctx.stroke();
        }
    }
};

function drawRays(ctx, basis, method) { // рисование лучей на основе главного sun - basis
    ctx.strokeStyle = "red";
    const nr = 12; // nr - Number of Rays - количество лучей, имеет связь с углом в радианах
    const P = R / nr; // P - Part - часть R поделенная на nr
    const l = basis.width; // от слова Length, длина радиуса
    const x = basis.x;
    const y = basis.y;
    ctx.beginPath();
    for (let i = 0; i < nr; i++) {
        const COS = Math.cos(P * i); // временные готовые ответы для упрощения вычислений
        const SIN = Math.sin(P * i);
        ctx.moveTo(x + COS*l, y + SIN*l)
        ctx.lineTo(
            P*i == 0 ? dw : P*i == Math.PI ? 0 : x + y * COS,
            P*i == Math.PI*1.5 ? 0 : P*i == Math.PI*.5 ? dh - surface : y + y * SIN);
    }
    ctx.stroke();
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let dw  = canvas.clientWidth;
let dh = canvas.clientHeight;
let text = "(1920; 1080)"; // текст в углу по умолчанию
let surface = dh/8;
let things; // массив с элементами
let r = Math.round; // Math.round для исправления сглаживания прямоугольника
let R = Math.PI*2; // R - Radians - радианы в полной окружности для тригонометрических вычислений

setInterval(draw, 1000 / 30); // 30FPS