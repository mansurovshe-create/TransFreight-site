(function(){
  "use strict";

  const WORKER_URL = "https://noisy-breeze-f037.mansurov-she.workers.dev";

  function qs(selector, root = document){
    return root.querySelector(selector);
  }

  function qsa(selector, root = document){
    return Array.from(root.querySelectorAll(selector));
  }

  function showMessage(element, text){
    if(!element) return;
    if(text) element.textContent = text;

    element.classList.add("show");

    window.setTimeout(function(){
      element.classList.remove("show");
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

  function resetTurnstile(){
    if(typeof turnstile !== "undefined"){
      try{
        turnstile.reset();
      }catch(e){
        console.warn("Turnstile reset skipped", e);
      }
    }
  }

  function setupCargoOwnerForm(){
    const form = qs("#telegramForm");
    if(!form) return;

    const errorMessage = qs("#errorMessage");
    const successMessage = qs("#successMessage");

    form.addEventListener("submit", async function(e){
      e.preventDefault();

      const name = qs("#name")?.value.trim() || "";
      const phone = qs("#phone")?.value.trim() || "";
      const route = qs("#route")?.value.trim() || "";
      const cargo = qs("#cargo")?.value.trim() || "";
      const website = qs("#website")?.value || "";
      const policy = qs("#ownerPolicyAgree");
      const cleanPhone = phone.replace(/\D/g, "");

      if(name.length < 2){
        showMessage(errorMessage, "Введите имя");
        return;
      }

      if(cleanPhone.length < 11){
        showMessage(errorMessage, "Введите корректный телефон");
        return;
      }

      if(route.length < 3){
        showMessage(errorMessage, "Введите маршрут");
        return;
      }

      if(cargo.length < 3){
        showMessage(errorMessage, "Введите описание груза");
        return;
      }

      if(policy && !policy.checked){
        showMessage(errorMessage, "Необходимо дать согласие на обработку персональных данных");
        return;
      }

      const tokenField = qs("[name='cf-turnstile-response']", form);

      if(!tokenField || !tokenField.value){
        showMessage(errorMessage, "Подтвердите проверку Cloudflare");
        return;
      }

      const button = qs("button[type='submit']", form);
      if(button){
        button.disabled = true;
        button.textContent = "Отправка...";
      }

      try{
        const response = await fetch(WORKER_URL, {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            name,
            phone,
            route,
            cargo,
            website,
            token:tokenField.value
          })
        });

        if(!response.ok){
          throw new Error("Ошибка отправки");
        }

        showMessage(successMessage, "✅ Заявка успешно отправлена");

        if(typeof ym === "function"){
          ym(109260432, "reachGoal", "lead");
        }

        form.reset();
        resetTurnstile();

      }catch(error){
        console.error(error);
        showMessage(errorMessage, "Ошибка отправки. Попробуйте позже");
      }finally{
        if(button){
          button.disabled = false;
          button.textContent = "Отправить заявку";
        }
      }
    });
  }

  function setupDriverForm(){
    const form = qs("#driverForm");
    if(!form) return;

    const successMessage = qs("#driverSuccess");
    const errorMessage = qs("#driverError");

    form.addEventListener("submit", async function(e){
      e.preventDefault();

      const name = qs("#driverName")?.value.trim() || "";
      const city = qs("#driverCity")?.value.trim() || "";
      const phone = qs("#driverPhone")?.value.trim() || "";
      const car = qs("#driverCar")?.value.trim() || "";
      const website = qs("#driverWebsite")?.value || "";
      const policy = qs("#carrierPolicyAgree");
      const cleanPhone = phone.replace(/\D/g, "");

      if(name.length < 2 || city.length < 2 || cleanPhone.length < 11 || car.length < 2){
        showMessage(errorMessage, "Заполните все поля корректно");
        return;
      }

      if(policy && !policy.checked){
        showMessage(errorMessage, "Необходимо дать согласие на обработку персональных данных");
        return;
      }

      const tokenField = qs("[name='cf-turnstile-response']", form);

      if(!tokenField || !tokenField.value){
        showMessage(errorMessage, "Подтвердите проверку Cloudflare");
        return;
      }

      const button = qs("button[type='submit']", form);
      if(button){
        button.disabled = true;
        button.textContent = "Отправка...";
      }

      try{
        const response = await fetch(WORKER_URL, {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            type:"driver",
            name:"🚚 ВОДИТЕЛЬ: " + name,
            phone,
            route:"Заявка от водителя",
            cargo:"Город водителя: " + city + "\nМашина: " + car,
            website,
            token:tokenField.value
          })
        });

        if(!response.ok){
          throw new Error("Ошибка отправки");
        }

        showMessage(successMessage, "✅ Заявка отправлена");

        form.reset();
        resetTurnstile();

      }catch(error){
        console.error(error);
        showMessage(errorMessage, "Ошибка отправки. Попробуйте позже");
      }finally{
        if(button){
          button.disabled = false;
          button.textContent = "Отправить заявку";
        }
      }
    });
  }

  function setupFormSwitcher(){
    const cargoOwnerBtn = qs("#cargoOwnerBtn");
    const carrierBtn = qs("#carrierBtn");
    const cargoOwnerForm = qs("#cargoOwnerForm");
    const carrierForm = qs("#carrierForm");

    if(!cargoOwnerBtn || !carrierBtn || !cargoOwnerForm || !carrierForm) return;

    cargoOwnerBtn.addEventListener("click", function(){
      cargoOwnerBtn.classList.add("active");
      carrierBtn.classList.remove("active");

      cargoOwnerForm.style.display = "block";
      carrierForm.style.display = "none";

      resetTurnstile();
    });

    carrierBtn.addEventListener("click", function(){
      carrierBtn.classList.add("active");
      cargoOwnerBtn.classList.remove("active");

      cargoOwnerForm.style.display = "none";
      carrierForm.style.display = "block";

      resetTurnstile();
    });
  }

  function setupCookieBanner(){
    const banner = qs("#cookieBanner");
    const button = qs("#cookieAcceptBtn");

    if(!banner || !button) return;

    if(localStorage.getItem("transfreight_cookie_accepted_v2") === "yes"){
      banner.classList.add("is-hidden");
      return;
    }

    banner.classList.remove("is-hidden");

    button.addEventListener("click", function(){
      localStorage.setItem("transfreight_cookie_accepted_v2", "yes");
      banner.classList.add("is-hidden");
    });
  }

  function setupCardReveal(){
    const cards = qsa(".why-card, .step");
    if(!cards.length) return;

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    let observer = null;

    cards.forEach(function(card){
      card.setAttribute("role", "button");
      card.setAttribute("aria-expanded", "false");
    });

    function closeAll(){
      cards.forEach(function(card){
        card.classList.remove("is-open");
        card.setAttribute("aria-expanded", "false");
      });
    }

    function openCard(card){
      cards.forEach(function(item){
        const sameGroup = item.closest(".cards, .steps-container") === card.closest(".cards, .steps-container");

        if(sameGroup && item !== card){
          item.classList.remove("is-open");
          item.setAttribute("aria-expanded", "false");
        }
      });

      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    }

    function setupMobile(){
      closeAll();

      if(observer){
        observer.disconnect();
      }

      observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting && mobileQuery.matches){
            openCard(entry.target);
          }
        });
      }, {
        threshold:0.68,
        rootMargin:"-18% 0px -18% 0px"
      });

      cards.forEach(function(card){
        observer.observe(card);
      });
    }

    function setupDesktop(){
      closeAll();

      if(observer){
        observer.disconnect();
        observer = null;
      }
    }

    function applyMode(){
      if(mobileQuery.matches){
        setupMobile();
      }else{
        setupDesktop();
      }
    }

    cards.forEach(function(card){
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

  function setupScrollReveal(){
    const items = qsa(".why-card, .step, .contact form, .footer-inner > div");

    if(!items.length) return;

    items.forEach(function(item){
      item.classList.add("reveal");
    });

    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold:0.12,
      rootMargin:"0px 0px -8% 0px"
    });

    items.forEach(function(item){
      observer.observe(item);
    });
  }

  function setupMobileVideoControl(){
    const video = qs(".bg-video");
    if(!video) return;

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    function apply(){
      if(mobileQuery.matches){
        video.pause();
        video.removeAttribute("autoplay");
      }else{
        video.setAttribute("autoplay", "");
        video.play().catch(function(){});
      }
    }

    apply();

    if(mobileQuery.addEventListener){
      mobileQuery.addEventListener("change", apply);
    }else{
      mobileQuery.addListener(apply);
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    setupPhoneMask(qs("#phone"));
    setupPhoneMask(qs("#driverPhone"));

    setupCargoOwnerForm();
    setupDriverForm();
    setupFormSwitcher();
    setupCookieBanner();
    setupCardReveal();
    setupScrollReveal();
    setupMobileVideoControl();
  });
})();
