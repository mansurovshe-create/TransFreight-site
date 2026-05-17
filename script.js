function showError(text){
const errorMessage = document.getElementById("errorMessage");
errorMessage.textContent = text;
errorMessage.classList.add("show");

setTimeout(() => {
errorMessage.classList.remove("show");
}, 4000);
}

const phoneInput = document.getElementById("phone");

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

phoneInput.addEventListener("focus", function(){

if(phoneInput.value === ""){
phoneInput.value = "+7";
phoneInput.setSelectionRange(3, 3);
}

});

phoneInput.addEventListener("input", function(){

const oldValue = phoneInput.value;
const oldCursor = phoneInput.selectionStart;

let digitPosition =
getDigitPosition(oldValue, oldCursor);

let digits = oldValue.replace(/\D/g, "");

if(digits.startsWith("8")){
digits = "7" + digits.slice(1);
}

if(digits.length > 0 && !digits.startsWith("7")){
digits = "7" + digits;
}

digits = digits.substring(0, 11);

const formatted = formatPhone(digits);

phoneInput.value = formatted;

let newCursor =
getCursorByDigitPosition(formatted, digitPosition);

if(newCursor < 3){
newCursor = 3;
}

phoneInput.setSelectionRange(newCursor, newCursor);

});

phoneInput.addEventListener("keydown", function(e){

const start = phoneInput.selectionStart;
const end = phoneInput.selectionEnd;

if(
(e.key === "Backspace" || e.key === "Delete")
&& start <= 3
&& end <= 3
){
e.preventDefault();
phoneInput.setSelectionRange(3, 3);
}

});

phoneInput.addEventListener("click", function(){

if(phoneInput.selectionStart < 3){
phoneInput.setSelectionRange(3, 3);
}

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

if(route.length < 3){
showError("Введите маршрут");
return;
}

if(cargo.length < 3){
showError("Введите описание груза");
return;
}

const tokenField = document.querySelector('[name="cf-turnstile-response"]');

if(!tokenField || !tokenField.value){
showError("Подтвердите проверку Cloudflare");
return;
}

const token = tokenField.value;

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
function toggleDriverForm(){

document
.getElementById("driverFormWrapper")
.classList.toggle("active");

}

const driverPhoneInput = document.getElementById("driverPhone");

if(driverPhoneInput){

driverPhoneInput.addEventListener("focus", function(){

if(driverPhoneInput.value === ""){
driverPhoneInput.value = "+7";
driverPhoneInput.setSelectionRange(3,3);
}

});

driverPhoneInput.addEventListener("input", function(){

const oldValue = driverPhoneInput.value;
const oldCursor = driverPhoneInput.selectionStart;

let digitPosition =
getDigitPosition(oldValue, oldCursor);

let digits = oldValue.replace(/\D/g, "");

if(digits.startsWith("8")){
digits = "7" + digits.slice(1);
}

if(digits.length > 0 && !digits.startsWith("7")){
digits = "7" + digits;
}

digits = digits.substring(0,11);

const formatted = formatPhone(digits);

driverPhoneInput.value = formatted;

let newCursor =
getCursorByDigitPosition(formatted, digitPosition);

if(newCursor < 3){
newCursor = 3;
}

driverPhoneInput.setSelectionRange(newCursor,newCursor);

});

driverPhoneInput.addEventListener("keydown", function(e){

const start = driverPhoneInput.selectionStart;
const end = driverPhoneInput.selectionEnd;

if(
(e.key === "Backspace" || e.key === "Delete")
&& start <= 3
&& end <= 3
){
e.preventDefault();
driverPhoneInput.setSelectionRange(3,3);
}

});

driverPhoneInput.addEventListener("click", function(){

if(driverPhoneInput.selectionStart < 3){
driverPhoneInput.setSelectionRange(3,3);
}

});

}

const driverForm = document.getElementById("driverForm");

if(driverForm){

driverForm.addEventListener("submit", async function(e){

e.preventDefault();

const name =
document.getElementById("driverName").value.trim();

const city =
document.getElementById("driverCity").value.trim();

const phone =
document.getElementById("driverPhone").value.trim();

const website =
document.getElementById("driverWebsite").value;

const cleanPhone = phone.replace(/\D/g,'');

if(name.length < 2){
showError("Введите имя");
return;
}

if(city.length < 2){
showError("Введите город");
return;
}

if(cleanPhone.length < 11){
showError("Введите корректный телефон");
return;
}

const tokenField =
driverForm.querySelector('[name="cf-turnstile-response"]');

if(!tokenField || !tokenField.value){
showError("Подтвердите проверку Cloudflare");
return;
}

const token = tokenField.value;

const button =
driverForm.querySelector("button[type='submit']");

button.disabled = true;
button.textContent = "Отправка...";

try{

const response = await fetch(
"https://noisy-breeze-f037.mansurov-she.workers.dev",
{
method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({

name,
phone,
website,
token,

route: "Водитель",
cargo: `Город: ${city}`

})

});

if(!response.ok){
throw new Error("Ошибка отправки");
}

const success =
document.getElementById("driverSuccess");

success.classList.add("show");

setTimeout(() => {
success.classList.remove("show");
},4000);

driverForm.reset();

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

}
