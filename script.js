'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll('.section');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//BUTTON SCROLLING
btnLearnMore.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  //Scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});
//PAGE NAVIGATION
//EVENT DELEGATION
//1. Add event listener to common parent element
//2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const currentEl = e.target;
  if (currentEl.classList.contains('nav__link')) {
    document
      .querySelector(currentEl.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
  console.log(currentEl);
});

//TABBED COMPONENT
tabsContainer.addEventListener('click', function (e) {
  //BUTTONS
  const clickedEl = e.target.closest('.operations__tab');
  //Guard Clause
  if (!clickedEl) return;
  //Remove active class to all tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  //Ad active class to clicked tab
  clickedEl.classList.add('operations__tab--active');

  //CONTENT
  //Get tab data
  const tabData = clickedEl.dataset.tab;
  //Remove active class to all content tabs
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  //Display active content tab
  document
    .querySelector(`.operations__content--${tabData}`)
    .classList.add('operations__content--active');
});

//MENU FADE ANIMATION
navLinks.addEventListener('mouseover', e => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = 0.5;
    });
  }
});

navLinks.addEventListener('mouseout', e => {
  document.querySelectorAll('.nav__link').forEach(el => (el.style.opacity = 1));
});

//REVEAL SECTIONS
function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //Unobserve section
  observer.unobserve(entry.target);
}
const options = {
  root: null,
  threshold: 0.15,
};
const sectionOberserver = new IntersectionObserver(revealSection, options);
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionOberserver.observe(section);
});

//LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

function loadImg(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  //Waiting for the img to fully load
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//SLIDER COMPONENT
//Variables
function slider() {
  let curSlide = 0;
  const maxSlide = slides.length;

  //Move slides
  function goToSlide(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  //Next slide
  function nextSlide() {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activeDot(curSlide);
  }

  //Previus slide
  function previousSlide() {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activeDot(curSlide);
  }

  function init() {
    goToSlide(0);
    createDots();
    activeDot(0);
  }

  init();
  //Btn's event handlers
  //Next slide
  btnRight.addEventListener('click', nextSlide);

  //Previous slide
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  //Creating the dots
  function createDots() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class ="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  //Activate dot
  function activeDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide ="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  //Sliding to the pressed dot
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activeDot(slide);
    }
  });
}
slider();
////////////////////////////////////////////////////////////////////////
//ASYNC AND DEFER ATRIBUTTE (ths script tag NEEDS to be on the <head>)
//ASYNC (stars fetching the script while the HTML is parsing, the parsing only stops for the script execution)
//DEFER (fetchs the script while the HTML is parsing and executes the script when the parsing is finished)
/*
//DOM CONTENT LOADED
//(Fires as soon as the HTML has been downloaded and converted to the DOM tree, also the scripts are downloaded as well)
document.addEventListener('DOMContentLoaded', e => {
  console.log('HTML parsed and DOM tree built', e);
});

//INTERSECTION OBSERVER API
//This callback executes when the observed element intersects with the root element in the designated threshold
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);

//DOM TRAVERSING
const h1 = document.querySelector('h1');
//Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.children);
h1.firstElementChild.style.color = 'White';
h1.lastElementChild.style.color = 'red';

//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)';

//Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.nextSibling);
console.log(h1.previousSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(e => {
  if (e !== h1) e.style.transform = 'scale(0.5)';
});

//EVENT PROPAGATION
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  //Stop Prpagation
  //e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

//EVENTS/EVENT HANDLERS
const h1 = document.querySelector('h1');
//--OLD WAY--
//h1.onmouseenter = () => {
//alert('onmouseenter: Great! You are reading the heading');
//};

function alertH1() {
  alert('addEventListener: Great! You are reading the heading');
  //Remove event
  h1.removeEventListener('mouseenter', alertH1);
}
h1.addEventListener('mouseenter', alertH1);

//CREATING AND INSERTING ELEMENTS
//.insertingAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent = 'We use cookies for improved functionality and analytics'
message.innerHTML =
  'We use cookies for improved functionality and analytics, <button class="btn btn--close-cookie">Got it!</button>';

//Prepend adds the elements as the first child of the parent element
//document.querySelector('.header').prepend(message);

//Append adds the elemtns as the last child of the parent element
document.querySelector('.header').append(message);

//cloneNode method
//document.querySelector('.header').append(message.cloneNode(true));

//.before .after
//inserts the element before or after the selected element
//document.querySelector('.header').before(message);
//document.querySelector('.header').after(message);

//STYLES
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//Get styles
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//Working with CSS custom properties
document.documentElement.style.setProperty('--color-primary', 'orangered');

//ATTRIBUTES
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);
console.log(logo.getAttribute('designer'));
console.log(logo.getAttribute('src'));

//Seting an attribute
logo.alt = 'Beautiful minimalist logo';
console.log(logo.alt);
logo.setAttribute('company', 'Bankist');

//Data Attributes
//They get store in the dataset object
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add('c','j')
logo.classList.remove('c')
logo.classList.contains('c')
logo.classList.toggle('c')


//DELETE ITEMS
//remove() deletes whole element
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());


//SELECTING ELEMENTS
console.log(document.documentElement);
const allSections = document.querySelectorAll('.section');
console.log(allSections);
document.getElementById('section--1');
//THIS RETURN AN HTMLCollection
//Tag selection
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
//Class selection
console.log(document.getElementsByClassName('btn'));
*/
