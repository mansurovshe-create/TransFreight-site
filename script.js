function showError(text){
const errorMessage = document.getElementById("errorMessage");
errorMessage.textContent = text;
errorMessage.classList.add("show");

setTimeout(() => {
errorMessage.classList.remove("show");
}, 4000);
}

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function() {
let value = phoneInput.value.replace(/\D/g, "");

if (value.startsWith("8")) {
value = "7" + value.slice(1);
}

if (!value.startsWith("7")) {
value = "7" + value;
}

value = value.substring(0, 11);

let formatted = "+7";

if (value.length > 1) {
formatted += " (" + value.substring(1, 4);
}

if (value.length >= 4) {
formatted += ") " + value.substring(4, 7);
}

if (value.length >= 7) {
formatted += "-" + value.substring(7, 9);
}

if (value.length >= 9) {
formatted += "-" + value.substring(9, 11);
}

phoneInput.value = formatted;
});

document.getElementById("telegramForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();
const route = document.getElementById("route").value.trim();
const cargo = document.getElementById("cargo").value.trim();
const website = document.getElementById("website").value;

const cleanPhone = phone.replace(/\D/g,'');

if(name.length < 2){
showError("Введите имя");
return;
}

if(cleanPhone.length < 11){
showError("Введите корректный телефон");
return;
}

const button = document.querySelector("#telegramForm button[type='submit']");
button.disabled = true;
button.textContent = "Отправка...";

try{

const token =
document.querySelector('[name="cf-turnstile-response"]').value;

const response = await fetch("https://noisy-breeze-f037.mansurov-she.workers.dev", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name,
phone,
route,
cargo,
website,
token
})
});

if(!response.ok){
throw new Error("Ошибка отправки");
}

const successMessage = document.getElementById("successMessage");

successMessage.classList.add("show");

if(typeof ym === "function"){
ym(109260432, "reachGoal", "lead");
}

setTimeout(() => {
successMessage.classList.remove("show");
}, 4000);

document.getElementById("telegramForm").reset();

}catch(error){

console.error(error);
showError("Ошибка отправки. Попробуйте позже");

} finally {

button.disabled = false;
button.textContent = "Отправить заявку";

}

});
