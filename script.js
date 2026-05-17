function showError(text){
const errorMessage = document.getElementById("errorMessage");
errorMessage.textContent = text;
errorMessage.classList.add("show");

setTimeout(() => {
errorMessage.classList.remove("show");
}, 4000);
}

function formatPhone(digits){
let result = "+7";

if(digits.length > 1){
result += " (" + digits.substring(1, 4);
}

if(digits.length >= 4){
result += ") " + digits.substring(4, 7);
}

if(digits.length >= 7){
result += "-" + digits.substring(7, 9);
}

if(digits.length >= 9){
result += "-" + digits.substring(9, 11);
}

return result;
}

function getDigitPosition(value, cursor){
let count = 0;

for(let i = 0; i < cursor; i++){
if(/\d/.test(value[i])){
count++;
}
}

return count;
}

function getCursorByDigitPosition(value, digitPosition){
let count = 0;

for(let i = 0; i < value.length; i++){
if(/\d/.test(value[i])){
count++;
}

if(count >= digitPosition){
return i + 1;
}
}

return value.length;
}

function setupPhoneMask(input){
if(!input) return;

input.addEventListener("focus", function(){
if(input.value === ""){
input.value = "+7";
input.setSelectionRange(3, 3);
}
});

input.addEventListener("input", function(){
const oldValue = input.value;
const oldCursor = input.selectionStart;

let digitPosition = getDigitPosition(oldValue, oldCursor);
let digits = oldValue.replace(/\D/g, "");

if(digits.startsWith("8")){
digits = "7" + digits.slice(1);
}

if(digits.length > 0 && !digits.startsWith("7")){
digits = "7" + digits;
}

digits = digits.substring(0, 11);

const formatted = formatPhone(digits);
input.value = formatted;

let newCursor = getCursorByDigitPosition(formatted, digitPosition);

if(newCursor < 3){
newCursor = 3;
}

input.setSelectionRange(newCursor, newCursor);
});

input.addEventListener("keydown", function(e){
const start = input.selectionStart;
const end = input.selectionEnd;

if(
(e.key === "Backspace" || e.key === "Delete")
&& start <= 3
&& end <= 3
){
e.preventDefault();
input.setSelectionRange(3, 3);
}
});

input.addEventListener("click", function(){
if(input.selectionStart < 3){
input.setSelectionRange(3, 3);
}
});
}

setupPhoneMask(document.getElementById("phone"));
setupPhoneMask(document.getElementById("driverPhone"));

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

if(route.length < 3){
showError("Введите маршрут");
return;
}

if(cargo.length < 3){
showError("Введите описание груза");
return;
}

const tokenField = document.querySelector("#telegramForm [name='cf-turnstile-response']");

if(!tokenField || !tokenField.value){
showError("Подтвердите проверку Cloudflare");
return;
}

const button = document.querySelector("#telegramForm button[type='submit']");
button.disabled = true;
button.textContent = "Отправка...";

try{
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
token: tokenField.value
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

if(typeof turnstile !== "undefined"){
turnstile.reset();
}

}catch(error){
console.error(error);
showError("Ошибка отправки. Попробуйте позже");
} finally {
button.disabled = false;
button.textContent = "Отправить заявку";
}
});



const driverForm = document.getElementById("driverForm");

if(driverForm){
driverForm.addEventListener("submit", async function(e){
e.preventDefault();

const name = document.getElementById("driverName").value.trim();
const city = document.getElementById("driverCity").value.trim();
const phone = document.getElementById("driverPhone").value.trim();
const car = document.getElementById("driverCar").value.trim();

const driverSuccess = document.getElementById("driverSuccess");
const driverError = document.getElementById("driverError");

driverSuccess.classList.remove("show");
driverError.classList.remove("show");

const cleanPhone = phone.replace(/\D/g,'');

if(name.length < 2 || city.length < 2 || cleanPhone.length < 11 || car.length < 2){
driverError.textContent = "Заполните все поля корректно";
driverError.classList.add("show");
return;
}

const tokenField = driverForm.querySelector("[name='cf-turnstile-response']");

if(!tokenField || !tokenField.value){
driverError.textContent = "Подтвердите проверку Cloudflare";
driverError.classList.add("show");
return;
}

const button = driverForm.querySelector("button[type='submit']");
button.disabled = true;
button.textContent = "Отправка...";

try{
const response = await fetch("https://noisy-breeze-f037.mansurov-she.workers.dev", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
type: "driver",
name: "🚚 ВОДИТЕЛЬ: " + name,
phone: phone,
route: "Заявка от водителя",
cargo: "Город водителя: " + city + "\nМашина: " + car,
website: "",
token: tokenField.value
})
});

if(!response.ok){
throw new Error("Ошибка отправки");
}

driverSuccess.classList.add("show");
driverForm.reset();

if(typeof turnstile !== "undefined"){
turnstile.reset();
}

}catch(error){
console.error(error);
driverError.textContent = "Ошибка отправки. Попробуйте позже";
driverError.classList.add("show");
} finally {
button.disabled = false;
button.textContent = "Отправить заявку";
}
});
}
const cargoOwnerBtn = document.getElementById("cargoOwnerBtn");
const carrierBtn = document.getElementById("carrierBtn");

const cargoOwnerForm = document.getElementById("cargoOwnerForm");
const carrierForm = document.getElementById("carrierForm");

if(cargoOwnerBtn && carrierBtn){

cargoOwnerBtn.addEventListener("click", function(){

cargoOwnerBtn.classList.add("active");
carrierBtn.classList.remove("active");

cargoOwnerForm.style.display = "block";
carrierForm.style.display = "none";

});

carrierBtn.addEventListener("click", function(){

carrierBtn.classList.add("active");
cargoOwnerBtn.classList.remove("active");

cargoOwnerForm.style.display = "none";
carrierForm.style.display = "block";

});

}
// ===== Reveal animation on scroll =====
document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(
    ".why-card, .step, .contact form, .footer-inner > div"
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item) => observer.observe(item));
});

// ===== Mouse glow inside cards =====
document.addEventListener("DOMContentLoaded", () => {
  const glowCards = document.querySelectorAll(".why-card, .step");

  glowCards.forEach((card) => {
    const glow = document.createElement("span");
    glow.classList.add("mouse-glow");
    card.appendChild(glow);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  });
});
