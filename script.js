const MAX_TOKEN = "f9LHodD0cOLkSXTTDrDpKBdiksN0uV_fuY36iakrJrmDAEZwDxiW5BqRrWXqhsgaFzoQlDxu5dSxHqrwRuuQ";
const MAX_CHAT_ID = "-74821219658404";

document.getElementById("telegramForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const route = document.getElementById("route").value;
const cargo = document.getElementById("cargo").value;

try{
await fetch(`https://platform-api.max.ru/messages?chat_id=${MAX_CHAT_ID}`, {
method: "POST",
headers: {
"Authorization": MAX_TOKEN,
"Content-Type": "application/json"
},
body: JSON.stringify({
text: `🚛 Новая заявка

👤 Имя: ${name}
📞 Телефон: ${phone}
📍 Маршрут: ${route}
📦 Груз: ${cargo}`
})
});

alert("Заявка отправлена");
document.getElementById("telegramForm").reset();

}catch(error){
alert("Ошибка отправки");
}

});
