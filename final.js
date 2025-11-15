class InteractiveStory {
  constructor() {
    this.screens = document.querySelectorAll('.screen');
    this.currentScreen = 0;
    this.isAnimating = false;
    this.scrollThreshold = 50;
    this.lastScrollTime = 0;
    this.downloadTriggered = false; // Флаг для отслеживания скачивания
    
    this.init();
  }

  init() {
    this.fadeInPage();
    this.setupEventListeners();
    this.showScreen(0);
  }

  fadeInPage() {
    const overlay = document.querySelector('.fade-overlay.start');
    
    setTimeout(() => {
      overlay.classList.add('hidden');
      
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 1500);
    }, 500);
  }

  setupEventListeners() {
    // Обработчик колеса мыши на всем документе
    document.addEventListener('wheel', (e) => {
      if (this.isAnimating) return;
      
      // Защита от слишком быстрой прокрутки
      if (Date.now() - this.lastScrollTime < 1000) return;
      
      if (e.deltaY > this.scrollThreshold) {
        this.nextScreen();
      } else if (e.deltaY < -this.scrollThreshold) {
        this.prevScreen();
      }
      
      this.lastScrollTime = Date.now();
    }, { passive: false });

    // Клавиши вверх/вниз
    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextScreen();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevScreen();
      }
    });

    // Обработчик для тач-устройств
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (this.isAnimating) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextScreen();
        } else {
          this.prevScreen();
        }
      }
    }, { passive: true });

    // Обработчик для кнопки ручного скачивания
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'download-trigger') {
        this.triggerDownload();
      }
    });
  }

  nextScreen() {
    if (this.currentScreen < this.screens.length - 1 && !this.isAnimating) {
      this.transitionToScreen(this.currentScreen + 1);
    }
  }

  prevScreen() {
    if (this.currentScreen > 0 && !this.isAnimating) {
      this.transitionToScreen(this.currentScreen - 1);
    }
  }

  transitionToScreen(nextIndex) {
    this.isAnimating = true;
    
    const currentScreen = this.screens[this.currentScreen];
    const nextScreen = this.screens[nextIndex];
    const currentContent = currentScreen.querySelector('.content');
    
    // 1. Сначала скрываем контент текущего экрана
    currentContent.classList.remove('visible');
    
    // 2. Затем раздвигаем ветки и приближаем фон
    setTimeout(() => {
      currentScreen.classList.add('exiting');
      
      // Анимация фона
      const currentBg = currentScreen.querySelector('.background');
      if (currentBg) {
        // Для перехода на светлый экран используем другую анимацию
        if (nextIndex === 4) { // 5-й экран (индекс 4)
          currentBg.classList.add('light-transition');
        } else {
          currentBg.classList.add('zooming');
        }
      }
      
      // 3. Показываем следующий экран (но он пока не виден)
      nextScreen.classList.add('active');
      
      // 4. После завершения анимации скрываем текущий экран
      setTimeout(() => {
        // Скрываем текущий экран
        currentScreen.classList.remove('active', 'exiting');
        if (currentBg) {
          currentBg.classList.remove('zooming', 'light-transition');
        }
        
        // Показываем контент следующего экрана
        const nextContent = nextScreen.querySelector('.content');
        setTimeout(() => {
          nextContent.classList.add('visible');
          
          // Если перешли на 5-й экран - запускаем скачивание
          if (nextIndex === 4 && !this.downloadTriggered) {
            setTimeout(() => {
              this.triggerDownload();
            }, 1000); // Задержка перед скачиванием
          }
        }, 300);
        
        this.currentScreen = nextIndex;
        this.isAnimating = false;
        this.updateScrollIndicator();
      }, nextIndex === 4 ? 3000 : 1500); // Для светлого перехода дольше
    }, 800);
  }

  showScreen(index) {
    this.currentScreen = index;
    
    // Скрываем все экраны
    this.screens.forEach(screen => {
      screen.classList.remove('active');
      const content = screen.querySelector('.content');
      content.classList.remove('visible');
    });
    
    // Показываем нужный экран
    const nextScreen = this.screens[index];
    nextScreen.classList.add('active');
    
    // Показываем контент с небольшой задержкой
    setTimeout(() => {
      const nextContent = nextScreen.querySelector('.content');
      nextContent.classList.add('visible');
    }, 300);
    
    this.updateScrollIndicator();
  }

  updateScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (this.currentScreen === this.screens.length - 1) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  }

  // Метод для скачивания файла
  triggerDownload() {
    if (this.downloadTriggered) return;
    
    this.downloadTriggered = true;
    
    // Замените 'your-file.docx' на путь к вашему Word файлу
    const fileUrl = 'file_dr.docx';
    const fileName = 'Глава_5, продолжение.docx'; // Имя файла при скачивании
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // Запускаем скачивание
    link.click();
    document.body.removeChild(link);
    
    // Показываем сообщение об успешном скачивании
    this.showDownloadSuccess();
  }

  // Показ сообщения об успешном скачивании
  showDownloadSuccess() {
  const downloadSection = document.querySelector('.download-section p');
  if (downloadSection) {
    downloadSection.textContent = 'Файл успешно скачан!';
    downloadSection.style.color = '#4caf50'; // Спокойный зеленый
    downloadSection.style.fontWeight = '400';
  }
}
}

// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  new InteractiveStory();

});
