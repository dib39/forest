const texts = [
  "Оказавшись внутри норы, девушка почувствовала странную лёгкость",
  "Она парила в невесомости, плавно спускаясь вниз, в темноту",
  "В мыслях пробегали, обгоняя друг друга, все слухе об этом месте",
  "Говорили, что при входе сюда нужно держать в голове то, чего тебе не хватает именно сейчас",
  "Девушка, задумавшись, поняла, что ей очень не хватает поддержки близких людей",
  "Она ощутила, что с ней было бы куда проще переносить все невзгоды",
  "Через несколько секунд девушка ощутила под ногами мягкую сырую почву",
  "Перед ней была заросшая дорога, уводящая куда-то во мрак",
  "А перед глазами, словно видения, возникали какие-то надписи..."
];

const container = document.getElementById("text-container");
let index = 0;

const animTime = 1200; // время анимации текста
const pauseTime = 2300; // пауза между появлением и исчезновением

// -------------------------------
// Плавное появление страницы из чёрного
// -------------------------------
function fadeInPage() {
  const overlay = document.querySelector('.fade-overlay.start');

  setTimeout(() => {
    overlay.classList.add('hidden');

    setTimeout(() => {
      showText();

      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 1500);
    }, 500);
  }, 100);
}

// -------------------------------
// Показываем текст снизу → центр с помощью Animation API
// -------------------------------
function showText() {
  container.textContent = texts[index];

  // Сбрасываем все классы
  container.classList.remove("show", "hide");

  // Принудительно устанавливаем начальное положение (снизу)
  container.style.opacity = "0";
  container.style.transform = "translateY(80px)";

  // Анимируем появление
  container.animate([
    { opacity: 0, transform: 'translateY(80px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration: animTime,
    easing: 'ease',
    fill: 'forwards'
  });

  // Через паузу скрываем текст
  setTimeout(() => hideText(), animTime + pauseTime);
}

// -------------------------------
// Скрываем текст центр → вверх с помощью Animation API
// -------------------------------
function hideText() {
  // Анимируем исчезновение
  container.animate([
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-80px)' }
  ], {
    duration: animTime,
    easing: 'ease',
    fill: 'forwards'
  });

  setTimeout(() => {
    index++;
    if (index < texts.length) {
      showText();
    } else {
      fadeToNextPage();
    }
  }, animTime);
}

// -------------------------------
// Переход на следующую страницу через затемнение
// -------------------------------
function fadeToNextPage() {
  const overlay = document.createElement("div");
  overlay.classList.add("fade-overlay", "end");
  document.body.appendChild(overlay);

  setTimeout(() => overlay.classList.add("active"), 100);

  setTimeout(() => {
    window.location.href = "final.html";
  }, 2500);
}

// -------------------------------
// Старт при загрузке страницы
// -------------------------------
window.addEventListener("DOMContentLoaded", () => {
  fadeInPage();

});
