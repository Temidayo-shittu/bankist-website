'use strict';
const btnScrollTo= document.querySelector('.btn--scroll-to')
const section1= document.querySelector('#section--1')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav= document.querySelector('.nav')
const tabs= document.querySelectorAll('.operations__tab')
const tabsContainer= document.querySelector('.operations__tab-container')
const tabsContent= document.querySelectorAll('.operations__content')

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn=> btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//IMPLEMENTING SMOOTH SCROLLING
///////////////////////////////////////////////
//button scrolling
btnScrollTo.addEventListener('click',function(e){
const s1coords= section1.getBoundingClientRect();
console.log(s1coords);
console.log(e.target.getBoundingClientRect());
//to get d prop of d dom rect:y-dist from top of viewport to btnScroll,x-dist from border to btnScroll

//getting current scroll positions
console.log('Current scroll(X/Y)',window.pageXOffset, window.pageYOffset)//x-0 pos,y-338 pos
//y=cur position of viewport & top of d page.ie.from top edge of viewport to topmost height of page
//to get width&height of current viewport
console.log('height/width viewport',document.documentElement.clientHeight,document.documentElement.clientWidth)

//OLD WAY OF SCROLLING
//scroll to: to tell js where to scroll to
//window.scrollTo(left pos,top pos)
//window.scrollTo(s1coords.left+window.pageXOffset,s1coords.top+window.pageYOffset)
//absolute pos of elem relative to d document

//window.scrollTo({
  //left: s1coords.left+window.pageXOffset,
  //top: s1coords.top+window.pageYOffset,
 // behavior: 'smooth',
//})

//MODERN WAY OF SCROLLING
section1.scrollIntoView({behavior:'smooth'})

})

//PAGE NAVIGATION
//#is an anchor,whose duty is to move d cur html elem to d position of its id in the section
//NOT SO EFFICIENT FOR MANY ELEMS(10,000)

document.querySelectorAll('.nav__link').forEach((cur)=>
cur.addEventListener('click',function(e){
e.preventDefault();
const id= this.getAttribute('href')//to get its relative href attribute
console.log(id)
document.querySelector(id).scrollIntoView({behavior:'smooth'})//this selects d id and scrolls directly into its section
}))

//EVENT DELEGATION(using d principle of event bubbling by selecting d parent elements)
//1.Attach eventlisteners to common parent elem
/*
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
//2.Determine what element originated the event
//console.log(e.target)
//3.matching strategy
if(e.target.classList.contains('.nav__link')){
const id= e.target.getAttribute('href')//to get its relative href attribute
document.querySelector(id).scrollIntoView({behavior:'smooth'})
}
})
*/


//BUILDING TABBED COMPONENTS
tabsContainer.addEventListener('click',function(e){
  //we wish to return d btns operations irrespective of clicking on the span(num) or d tab(btn)itself
  const clicked= e.target.closest('.operations__tab');//returns closest parent elem we need which is the btn oper
  console.log(clicked)
  //ignore clicks where result is null(using guard clause)
  if(!clicked) return
  //Remove active classes
  tabs.forEach(cur=>cur.classList.remove('operations__tab--active'))//to remove d active class from each btns
  //Remove active tabs content
  tabsContent.forEach(cur=>cur.classList.remove('operations__content--active'))
  //Activate tabs 
  clicked.classList.add('operations__tab--active')
  //Activate tabs content
  console.log(clicked.dataset.tab)
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')

})
//Menu fade animation
//mouseover is used to undo what we do on d mouse-hover.its opp of mouseenter which doesnt bubble through an event
//its opp is mouseout

const handleHover= function(e){//only takes 1 arg.so to add extra args,we use bind
    if(e.target.classList.contains('nav__link')){
      const link= e.target;//selects d target elem from parent elem
      const siblings= e.target.closest('.nav').querySelectorAll('.nav__link')//start from d closest parent elem of target
      //then using query,find children
      const logo= e.target.closest('.nav').querySelector('img')
      siblings.forEach(cur=>{
        if(cur!==link) cur.style.opacity= this;
      })
      logo.style.opacity= this;
    }
  }
//Passsing 'arguments' into handleOver
nav.addEventListener('mouseover',handleHover.bind(0.5))//calling d already created calback func as a 
//func into d addeventlistener func
nav.addEventListener('mouseout',handleHover.bind(1))
//bind method creates a copy of d func that its called on,and sets d this keyword into whatever val we pass into it
//we use bind to pass an arg into a func

//STICKY NAVIGATION(this event will be fired each time we scroll on our page)
/*
const initialCoords= section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll',function(){
  console.log(window.scrollY)
  if(window.scrollY>initialCoords.top){
    nav.classList.add('sticky')
  }
  else{
    nav.classList.remove('sticky')
  }
})
*/
//STICKY NAVIGATION: INTERSECTION OBSERVER API
//element that d obj is intersecting is d root element.our target elem is section1,which we want to intersect
//with d root elem
/*
const obsCallback= function(entries,observer){//calback will be called when target elem intersects wit d root elem at d threshold%
//entries are arrays of threshold entries
entries.forEach(entry=>{
  console.log(entry)
})
};
const obsOptions= {
root: null,//d elem that d target is intersecting.its null becos we're interested in d entire viewport
threshold:[0,0.2]
//0 means calback trigers when target elem moves out of d view and into d view
//%of intersection at which d obscalback will be called.it is d% of visibility of our root elem(vp)
}
const observer= new IntersectionObserver(obsCallback,obsOptions);
observer.observe(section1)
//we want our sticky nav to occur when our header completely moves out of view
*/
const navHeight=nav.getBoundingClientRect().height;
  //console.log(navHeight)
const stickyNav= function(entries){
const[entry]= entries;
//wen entry isnt intersecting root,apply sticky class
if(!entry.isIntersecting) nav.classList.add('sticky')
else {
  nav.classList.remove('sticky')
}//d nav comes before d 1st section starts
}
const header= document.querySelector('.header')
const headerObserver= new IntersectionObserver(stickyNav,{root: null,threshold:0,rootMargin:`-${navHeight}px`});
//rootmarg-a box of px applied outside our target elem.it helps to specify correctly when we want our margin to start
//to make nav load before d threshold is Actually reached,use rootMargin
headerObserver.observe(header);
//header thresh at 0% means we want d sticky nav to occur when 0% of header is in view.ie.when d header isnt visible
//we want d sticky nav to occur

//REVEAL SECTIONS
const allSections= document.querySelectorAll('.section')

const revealSections= function(entries,observer){
const [entry]= entries;
//console.log(entry)
if(!entry.isIntersecting) return
entry.target.classList.remove('section--hidden')
observer.unobserve(entry.target)
}
const sectionsObserver= new IntersectionObserver(revealSections,{root:null,threshold: 0.15})
allSections.forEach((section)=> {
  sectionsObserver.observe(section)
  //section.classList.add('section--hidden')
})

//LAZY LOADING IMAGES(it impacts how your site works&especially for users wit slow internet connection)
const imgTarget= document.querySelectorAll('img[data-src]')
const loadImg= function(entries,observer){
const [entry]= entries;
console.log(entry)
//Replace src with data-src
if(!entry.isIntersecting) return
  entry.target.src=entry.target.dataset.src//dataset is whre data special properties are stored(as data-src is a special class ppt).
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img')
    observer.unobserve(entry.target);
  })

}
const imageObserver= new IntersectionObserver(loadImg,{root:null,threshold:0,rootMargin:'200px'})
imgTarget.forEach((img)=> imageObserver.observe(img))
//the lazy loading and its replacement with src image occurs in d background

//BUILDING A SLIDER COMPONENT PT1
//slider
const slider= function(){
const slides= document.querySelectorAll('.slide')
const btnLeft= document.querySelector('.slider__btn--left')
const btnRight= document.querySelector('.slider__btn--right')
const dotsContainer= document.querySelector('.dots')

let curSlide=0;
const maxSlide= slides.length;
/*
const slider= document.querySelector('.slider')
slider.style.transform= 'scale(0.4) translateX(-800px)'
slider.style.overflow= 'visible'
*/
//than its initial positioning of being placed on top of each other
//0%,100%,200%,300%
//FUNCTIONS

const createDots= function(){
  slides.forEach((_,ind)=>dotsContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${ind}"></button>`))
}

const activateDots= function(slide){
  document.querySelectorAll('.dots__dot').forEach((dot)=>dot.classList.remove('dots__dot--active'))
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}

const goToSlide= function(slide){
  slides.forEach((s,ind)=> s.style.transform= `translateX(${100*(ind-slide)}%)`)
}

const nextSlide= function(){
  if(curSlide===maxSlide-1){
    curSlide=0;
  }
  else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
}

const prevSlide= function(){
  if(curSlide===0){
    curSlide===maxSlide-1
  } else{
    curSlide--;
  }
  goToSlide(curSlide)
  activateDots(curSlide)
}
const init= function(){
  goToSlide(0)//translates position of slides to be placed side by side rather 
  createDots();
  activateDots(0) 
}
init();


//BUILDING A SLIDER COMPONENT PT2
//EVENT HANDLERS
btnRight.addEventListener('click',nextSlide)
btnLeft.addEventListener('click',prevSlide)
//curSlide:1  //-100%(prev slide viewed),0%(cur slide in view),100%(next slide),200%
document.addEventListener('keydown',function(e){
console.log(e)
if(e.key==='ArrowLeft') prevSlide();
e.key==='ArrowRight' && nextSlide()
})
activateDots(curSlide)

dotsContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide}= e.target.dataset
    goToSlide(slide)
    activateDots(slide)
  }
})
}
slider();


/////////////////////////////////////////////////////
//LECTURES
//HOW DOM WORKS BEHIND THE SCENES
//DOM is the interphase btw the js code and the browser or specfically html documents rendered in our browser
//SELECTING,CREATING & DELETING ELEMENTS
/*
console.log(document.documentElement)
console.log(document.header)
console.log(document.body)
//selecting elements
const header= document.querySelector('.header')
const allSections= document.querySelectorAll('.section')//to select all elements belonging to this particular class
console.log(allSections)
document.getElementById('section--1')//this is selecting elements with a particular id
//returning html colection
const allButtons= document.getElementsByTagName('button')//gets elements with same tag names
console.log(allButtons);
console.log(document.getElementsByClassName('btn'))// gets elemnts that belongs to a particular classname
*/
//creating elements and inserting elements

//a most common way of creating elem is using insertAdjacenthtml
/*
const message= document.createElement('div')//creates a dom element from scratch.though its not yet on our page,but 
//we need to manually insert it to our page
message.classList.add('cookie-message')//gives d already created elem a classname
//message.textContent= 'Cookies is used for improved functionality and analytics'
message.innerHTML='Cookies is used for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'
//for inserting an html,also for writing a text

//header.prepend(message)//prepend is used to add d elem as d first child of an elem,in this case in d header section
//whereas append adds d elem as d last child of an elem. message elem is either d 1st or last child of header elem
//Both methods not only inserts elem but also moves elements
header.append(message)
//so we just inserted an html into our dom that we created.nice!a dom elem is unique,meaning it can only exist in the 
//dom one at a time.if we intend to add it multiple times,we clone it.this means all d child elements wil be copied
//header.append(message.cloneNode(true))
//header.before(message)//inserts d message before d header elem
header.after(message)//inserts d message after d header elem
//d process of moving up&down in a DOM tree is called dom traversing

//Deleting elements-we wish to delete d cookie message upon clicking on cookie button
document.querySelector('.btn--close-cookie').addEventListener('click',()=>
message.remove())
//message.parentElement.removeChild(message) old way of deleting child elem from a parent elem
*/
//STYLES,ATTRIBUTES & CLASSES
//styles: we insert styles d same way we do using css
/*
message.style.backgroundColor= '#37383d';
message.style.width= '120%';
//styles set directly in the DOM are called inline styles.they are styles we set manualy ourselves
console.log(message.style.backgroundColor)//it displays cos its an inline style
console.log(message.style.height)//this wont be seen cos we didnt manually set it.to view already created styles
//done in our css, we use getcomputedstyle
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
message.style.color= Number.parseFloat(getComputedStyle(message).height,10) + 30 + 'px'//to increase height
//parsefloat converts a string to a floating num or num with decimals

//css custom properties/variables
//we can move btw our css and js using document.elem
document.documentElement.style.setProperty('--color-primary','orangered')//selects d root elem & chnages its color at every point

//Attributes: recall src,alt,class,id are all attributes of an img elem
const logo= document.querySelector('.nav__logo')
console.log(logo.alt)//we can get ppt of d img logo created in css since its been assigned a value in css
console.log(logo.className)

//we can also change ppt of an already defined ppt
logo.alt='Beautiful minimalist logo'

//Non-standard: to get attributes of classes that are not standard ppt of our class,we use getAttribute
console.log(logo.designer)//returns undefined
console.log(logo.getAttribute('designer'))
//to set attributes of classes that are not standard ppt of our class,we use setAttribute
console.log(logo.setAttribute('company','Bankist'))

console.log(logo.src)//this gives d absolute url
console.log(logo.getAttribute('src'))//this gives d relative url

const link= document.querySelector('.twitter-link')
console.log(link.href)
console.log(link.getAttribute('href'));//both values for d links are absolute
*/
const link= document.querySelector('.nav__link--btn')
console.log(link.href)
console.log(link.getAttribute('href'));//both values for d links are absolute

//Data attributes: are a special kind of attribute starting wit d word data
console.log(logo.dataset.versionNumber)//used when we wish to store data in a UI

//CLASSES
/*
logo.classList.add('c','j')//allows us add/remove classes based on their names without affecting already existing clas
logo.classList.remove('c','j')
logo.classList.toggle('c','j')
logo.classList.contains('c','j')//not includes as in arrays
//dont use
logo.className='Jonas'//overrides already existing class
*/


//EVENTS & EVENTS HANDLERS
//an event is a signal generated by a simple dumb node.a signal means something has happened
//mouseenter:it fires whenever a mouse enters an event.it creates an hover around d selected elem
//a pointing dev is moved onto d elem that has a listener attached to(see mdn events js)
//const h1= document.querySelector('h1')

//another way of doing this is using d on-event property with its value set as the calback function
/* old way
h1.onmouseenter= function(e){
  alert('onmouseenter: Great,You are reading the heading!!')//alert creates a pop-up window
}; 
*/
//addeventListeners is preferrable cos it allows us add multiple events to d eventlistener
//2ndly,we can remove it incase we dont need it anymore

//Listening to an event once(ie.listening & removing event)
/*
const alertH1= function(e){
  alert('addEventListener: Great,You are reading the heading!!')//alert creates a pop-up window
  //h1.removeEventListener('mouseenter',alertH1)
}
h1.addEventListener('mouseenter',alertH1)
setTimeout(()=>
h1.removeEventListener('mouseenter',alertH1),3000)
*/
//3rd way of handling events(EVENT ATTRIBUTE): writing it in our html(old school)

//BUBBLING AND CAPTURING
//eventlisteners wait for a certain event to happen on a certain elem,and as soon as d event occurs,it runs d 
//attached calback func. we say events bubbles up frm d target to the document route.as events travels down&up
//the tree,they pass through d parent elem and not sibling elem.by default,events can only be handled in the target&
//in the bubbling phase.this is called event propagation(bubbling&capturing)

//EVENT PROPAGATION IN PRACTISE
//attaching event handlers to our nav links(features,operations,testimonials)
//rgb(255,255,255)
//const randomInt= (min,max)=>Math.floor(Math.random()*(max-min+1)+min);
//const randomColor= ()=>`rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`

//NB.the this keyword always points to d elem in which d eventlistener is attached.they are listening for click events that happens on d elem
//document.querySelector('.nav__link').addEventListener('click',function(e){//event bubbling occurs frm parent elem through to target elem
 //this.style.backgroundColor= randomColor()//the target elem in all 3 handlers will be d same.its d elem at which d event occurs
//console.log('LINK',e.target,e.currentTarget)//cur target is the elem on which d event handler is attached
//console.log(e.currentTarget===this)//this is true in any event handler
//stop propagation(stop event bubbling)
//e.stopPropagation();
//})

/*
document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor= randomColor()
  console.log('CONTAINER',e.target,e.currentTarget)
})

document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor= randomColor()
  console.log('NAV',e.target,e.currentTarget)
},true)
*/
//EVENT PROPAGATION PHASES
//1.capture phase-events are captured wen they come down frm document route all d way to d target but are not picked by event handlers during this phase
//to attach event listeners to this phase thereby making d document route the event target, we set a true/false as d 3rd arg
//2.click phase
//3.bubbling phase

//EVENT DELEGATION

//DOM TRANSVERSING(selecting elemnts relative to other elem)
/*
const h1= document.querySelector('h1');
//1.going down: selecting child elements
console.log(h1.querySelectorAll('.highlight'))
//getting direct children of an elem
console.log(h1.childNodes);//nodes can be anything resulting from text,comments,etc
console.log(h1.children);//in getting just elements, we use children
h1.firstElementChild.style.color= 'white';
h1.lastElementChild.style.color= 'orangered';

//2.going upwards: selecting parent elements
console.log(h1.parentNode);
console.log(h1.parentElement);//the direct parent our elem is nested in
//in getting d closest parent of an elem with multiple same classes
h1.closest('.header').style.background= 'var(--gradient-secondary)';
h1.closest('h1').style.background= 'var(--gradient-primay)';
//closest finds parents no matter how deep in the DOM they are
//queryselector finds children no matter how deep in the DOM they are

//3.Going side-ways: selecting siblings
//access direct siblings(prev ones/the next ones)
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach((cur)=> {if(cur!==h1) cur.style.transform= 'scale(0.5)'})
*/

//LIFECYCLE DOM EVENTS
//DOM CONTENT LOADED: this event is fired by d document as soon as d html is completely parsed.ie.html has been downloaded and parsed into domtree
//its equivalent in jquery is document.ready
document.addEventListener('DOMContentLoaded',function(e){
  console.log('HTML parsed and DOM tree is built!!',e)
})
//we dont need to pass our js code into this doc,as the js code has been parsed into our html code already using 'script'
//LOAD EVENT
//it is fired not only when d html code is parsed,but other images,resources like css files are also loaded.hence,it is fired wen d complete
//page has finished loading.
window.addEventListener('load',function(e){
console.log('Page fully loaded!!',e)
})
//BEFORE UNLOAD EVENT
//it is created immediately before a user is about leaving a page.it displays a prompt message asking if d user wants to finally leave d page
//this feature must not be abused
/*
window.addEventListener('beforeunload',function(e){
  e.preventDefault();
  console.log(e)
  e.returnValue= ''
  })
  */

  //EFFICIENT SCRIPT LOADING IN HTML
  //we have been using d regular method for loading js in html
  //REGULAR
  //<script src="script.js"> parsingHTML=>fetch script=>Execute..this is why d script is always put at the end of d body not at d head of our html code
  
  //ASYNC
  //<script async src="script.js">
  //scripts are fetched asynchronously and executed immediately
  //scripts are not guaranteed to be executed in order.
  //use for 3rd party scipts where order doesnt matter(google analytics)

  //DEFER-this is overall d best soln out of d 3 methods
  //<script defer src="script.js">
  //scripts are executed in order
  //