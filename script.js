(function(){
  function showMessage(element, text){
    if(!element) return;
    if(text) element.textContent = text;
    element.classList.add("show");

    setTimeout(() => {
      element.classList.remove("show");
    }, 4000);
  }

  function showOwnerError(text){
    showMessage(document.getElementById("errorMessage"), text);
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
      if(/\d/.test(value[i])) count++;
    }

    return count;
  }

  function getCursorByDigitPosition(value, digitPosition){
    let count = 0;

    for(let i = 0; i < value.length; i++){
      if(/\d/.test(value[i])) count++;

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

      if((e.key === "Backspace" || e.key === "Delete") && start <= 3 && end <= 3){
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

  function setupForms(){
    const telegramForm = document.getElementById("telegramForm");
    const driverForm = document.getElementById("driverForm");

    setupPhoneMask(document.getElementById("phone"));
    setupPhoneMask(document.getElementById("driverPhone"));

    if(telegramForm){
      telegramForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const route = document.getElementById("route").value.trim();
        const cargo = document.getElementById("cargo").value.trim();
        const website = document.getElementById("website").value;
        const cleanPhone = phone.replace(/\D/g,'');

        if(name.length < 2){
          showOwnerError("Введите имя");
          return;
        }

        if(cleanPhone.length < 11){
          showOwnerError("Введите корректный телефон");
          return;
        }

        if(route.length < 3){
          showOwnerError("Введите маршрут");
          return;
        }

        if(cargo.length < 3){
          showOwnerError("Введите описание груза");
          return;
        }

        if(!telegramForm.checkValidity()){
          telegramForm.reportValidity();
          return;
        }

        const tokenField = telegramForm.querySelector("[name='cf-turnstile-response']");

        if(!tokenField || !tokenField.value){
          showOwnerError("Подтвердите проверку Cloudflare");
          return;
        }

        const button = telegramForm.querySelector("button[type='submit']");
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

          showMessage(document.getElementById("successMessage"), "✅ Заявка успешно отправлена");

          if(typeof ym === "function"){
            ym(109260432, "reachGoal", "lead");
          }

          telegramForm.reset();

          if(typeof turnstile !== "undefined"){
            turnstile.reset();
          }

        }catch(error){
          console.error(error);
          showOwnerError("Ошибка отправки. Попробуйте позже");
        }finally{
          button.disabled = false;
          button.textContent = "Отправить заявку";
        }
      });
    }

    if(driverForm){
      driverForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const name = document.getElementById("driverName").value.trim();
        const city = document.getElementById("driverCity").value.trim();
        const phone = document.getElementById("driverPhone").value.trim();
        const car = document.getElementById("driverCar").value.trim();
        const website = document.getElementById("driverWebsite").value;

        const driverSuccess = document.getElementById("driverSuccess");
        const driverError = document.getElementById("driverError");

        driverSuccess.classList.remove("show");
        driverError.classList.remove("show");

        const cleanPhone = phone.replace(/\D/g,'');

        if(name.length < 2 || city.length < 2 || cleanPhone.length < 11 || car.length < 2){
          showMessage(driverError, "Заполните все поля корректно");
          return;
        }

        if(!driverForm.checkValidity()){
          driverForm.reportValidity();
          return;
        }

        const tokenField = driverForm.querySelector("[name='cf-turnstile-response']");

        if(!tokenField || !tokenField.value){
          showMessage(driverError, "Подтвердите проверку Cloudflare");
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
              website,
              token: tokenField.value
            })
          });

          if(!response.ok){
            throw new Error("Ошибка отправки");
          }

          showMessage(driverSuccess, "✅ Заявка отправлена");
          driverForm.reset();

          if(typeof turnstile !== "undefined"){
            turnstile.reset();
          }

        }catch(error){
          console.error(error);
          showMessage(driverError, "Ошибка отправки. Попробуйте позже");
        }finally{
          button.disabled = false;
          button.textContent = "Отправить заявку";
        }
      });
    }
  }

  function setupFormSwitcher(){
    const cargoOwnerBtn = document.getElementById("cargoOwnerBtn");
    const carrierBtn = document.getElementById("carrierBtn");
    const cargoOwnerForm = document.getElementById("cargoOwnerForm");
    const carrierForm = document.getElementById("carrierForm");

    if(!cargoOwnerBtn || !carrierBtn || !cargoOwnerForm || !carrierForm) return;

    cargoOwnerBtn.addEventListener("click", function(){
      cargoOwnerBtn.classList.add("active");
      carrierBtn.classList.remove("active");

      cargoOwnerForm.style.display = "block";
      carrierForm.style.display = "none";

      if(typeof turnstile !== "undefined"){
        turnstile.reset();
      }
    });

    carrierBtn.addEventListener("click", function(){
      carrierBtn.classList.add("active");
      cargoOwnerBtn.classList.remove("active");

      cargoOwnerForm.style.display = "none";
      carrierForm.style.display = "block";

      if(typeof turnstile !== "undefined"){
        turnstile.reset();
      }
    });
  }

  function setupCookieBanner(){
    const cookieBanner = document.getElementById("cookieBanner");
    const cookieAcceptBtn = document.getElementById("cookieAcceptBtn");

    if(!cookieBanner || !cookieAcceptBtn) return;

    if(localStorage.getItem("transfreight_cookie_accepted") === "yes"){
      cookieBanner.classList.add("is-hidden");
      return;
    }

    cookieAcceptBtn.addEventListener("click", function(){
      localStorage.setItem("transfreight_cookie_accepted", "yes");
      cookieBanner.classList.add("is-hidden");
    });
  }

  function setupCardReveal(){
    const cards = document.querySelectorAll(".why-card, .step");
    if(!cards.length) return;

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    let observer = null;

    cards.forEach((card) => {
      card.setAttribute("role", "button");
      card.setAttribute("aria-expanded", "false");
    });

    function closeCards(){
      cards.forEach((card) => {
        card.classList.remove("is-open");
        card.setAttribute("aria-expanded", "false");
      });
    }

    function openCard(card){
      cards.forEach((item) => {
        const sameGroup = item.closest(".cards, .steps-container") === card.closest(".cards, .steps-container");

        if(sameGroup && item !== card){
          item.classList.remove("is-open");
          item.setAttribute("aria-expanded", "false");
        }
      });

      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    }

    function setupMobileScrollReveal(){
      closeCards();

      if(observer){
        observer.disconnect();
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting && mobileQuery.matches){
            openCard(entry.target);
          }
        });
      }, {
        threshold: 0.72,
        rootMargin: "-18% 0px -18% 0px"
      });

      cards.forEach((card) => observer.observe(card));
    }

    function setupDesktopHoverReveal(){
      closeCards();

      if(observer){
        observer.disconnect();
        observer = null;
      }
    }

    function applyMode(){
      if(mobileQuery.matches){
        setupMobileScrollReveal();
      }else{
        setupDesktopHoverReveal();
      }
    }

    cards.forEach((card) => {
      card.addEventListener("keydown", function(e){
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();

          if(mobileQuery.matches){
            openCard(card);
          }
        }
      });
    });

    applyMode();

    if(mobileQuery.addEventListener){
      mobileQuery.addEventListener("change", applyMode);
    }else{
      mobileQuery.addListener(applyMode);
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    setupForms();
    setupFormSwitcher();
    setupCookieBanner();
    setupCardReveal();
  });
})();
