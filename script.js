
const TOKEN = "PASTE_BOT_TOKEN";
const CHAT_ID = "PASTE_CHAT_ID";

document.getElementById("telegramForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const route = document.getElementById("route").value;
const cargo = document.getElementById("cargo").value;

const text =
`🚛 Новая заявка%0A%0A👤 Имя: ${name}%0A📞 Телефон: ${phone}%0A📍 Маршрут: ${route}%0A📦 Груз: ${cargo}`;

const url =
`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}`;

try{
await fetch(url);
alert("Заявка отправлена");
document.getElementById("telegramForm").reset();
}catch(error){
alert("Ошибка отправки");
}

});
