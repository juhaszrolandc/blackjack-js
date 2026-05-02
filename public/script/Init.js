import { ViewController } from "./ViewController.js";
const view = new ViewController();
const startBtn = document.getElementById("startBtn");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");
startBtn.addEventListener('click', () => get('new-round', view.render.bind(view)));
hitBtn.addEventListener('click', () => get('hit', view.render.bind(view)));
standBtn.addEventListener('click', () => get('stand', view.render.bind(view)));
window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    get('new-game', view.render.bind(view));
});
function get(url, foo) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.responseText);
            foo(data);
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}
