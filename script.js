document.getElementById("telegramForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const route = document.getElementById("route").value;
const cargo = document.getElementById("cargo").value;

try{

await fetch("https://noisy-breeze-f037.mansurov-she.workers.dev", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name,
phone,
route,
cargo
})
});

alert("Заявка отправлена");

document.getElementById("telegramForm").reset();

}catch(error){

console.error(error);
alert("Ошибка отправки");

}

});
