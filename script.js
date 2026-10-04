const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }));
}

const message = 'Здравствуйте! Хочу познакомиться с командой «ДонДракон» и прийти на пробную тренировку. Подскажите, когда можно?';
const maxPhone = '+7 928 903‑28‑14';
const toast = document.querySelector('#toast');
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}
async function copyText(text, toastText = 'Готово — скопировано') {
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const area = document.createElement('textarea');
    area.value = text; area.style.position = 'fixed'; area.style.opacity = '0';
    document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
  }
  showToast(toastText);
}

document.querySelector('#copy-contact')?.addEventListener('click', () => copyText(maxPhone, 'Готово — номер MAX скопирован'));
document.querySelector('#copy-message')?.addEventListener('click', () => copyText(message, 'Готово — сообщение скопировано'));

const steps = [...document.querySelectorAll('.question-step')];
const progressBar = document.querySelector('#progress-bar');
const questionNumber = document.querySelector('#question-number');
const quizResult = document.querySelector('#quiz-result');
const quizAnswers = [];
let currentStep = 0;
const resultTitle = document.querySelector('#result-title');
const resultCopy = document.querySelector('#result-copy');
function updateStep(step) {
  steps.forEach((el, i) => el.classList.toggle('is-active', i === step));
  questionNumber.textContent = step + 1;
  progressBar.style.width = `${((step + 1) / 3) * 100}%`;
}
function finishQuiz() {
  steps.forEach(el => el.classList.remove('is-active'));
  document.querySelector('.quiz-progress').style.display = 'none';
  quizResult.classList.add('is-visible');
  const hasZero = quizAnswers.includes('zero');
  const wantsWatch = quizAnswers.includes('watch') || quizAnswers.includes('maybe');
  if (hasZero && wantsWatch) {
    resultTitle.textContent = 'Начни с мягкого знакомства';
    resultCopy.textContent = 'Тебе не нужно спешить. Напиши команде, задай вопросы и приходи посмотреть на тренировку перед первым выходом на воду.';
  } else if (hasZero) {
    resultTitle.textContent = 'Тебе подходит старт с нуля';
    resultCopy.textContent = 'Опыт не нужен: команда покажет лодку, весло и базовый ритм. Первый шаг — написать и выбрать удобную дату.';
  } else if (wantsWatch) {
    resultTitle.textContent = 'Сначала познакомься с командой';
    resultCopy.textContent = 'Посмотри на тренировку, почувствуй атмосферу и задай вопросы. После этого будет легко решить, когда садиться в лодку.';
  } else {
    resultTitle.textContent = 'Тебе подходит командный формат';
    resultCopy.textContent = 'Похоже, ты готов(а) поймать общий ритм. Напиши команде — подскажем ближайшую тренировку и встретим на гребном канале.';
  }
}
document.querySelectorAll('.option').forEach(option => option.addEventListener('click', () => {
  quizAnswers[currentStep] = option.dataset.value;
  if (currentStep < steps.length - 1) { currentStep += 1; updateStep(currentStep); }
  else finishQuiz();
}));
document.querySelector('#restart-quiz')?.addEventListener('click', () => {
  currentStep = 0; quizAnswers.length = 0;
  quizResult.classList.remove('is-visible');
  document.querySelector('.quiz-progress').style.display = 'flex';
  updateStep(0);
  document.querySelector('#check')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
