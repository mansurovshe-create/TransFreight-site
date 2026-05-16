document.getElementById("telegramForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const route = document.getElementById("route").value;
const cargo = document.getElementById("cargo").value;
const website = document.getElementById("website").value;
const button = document.querySelector("#telegramForm button[type='submit']");
button.disabled = true;
button.textContent = "Отправка...";
  
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
cargo,
website
})
});

const successMessage =
document.getElementById("successMessage");

successMessage.classList.add("show");
ym(109260432, 'reachGoal', 'lead');

setTimeout(() => {
successMessage.classList.remove("show");
}, 4000);

document.getElementById("telegramForm").reset();

}catch(error){

console.error(error);
alert("Ошибка отправки");

} finally {

const button = document.querySelector("#telegramForm button[type='submit']");
button.disabled = false;
button.textContent = "Отправить заявку";

}

});
