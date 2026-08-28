document.addEventListener("DOMContentLoaded",function(){
document.body.style.background="linear-gradient(180deg,#04140d 0%,#071f14 100%)";
const applyBackgrounds=function(){
const hero=document.querySelector(".hero");
if(hero)hero.style.backgroundColor="#0b3020";
const news=document.querySelector(".news");
if(news)news.style.background="linear-gradient(135deg,#0a2418 0%,#0d3925 35%,#105438 70%,#176b46 100%)";
const grid=document.querySelector(".grid");
if(grid)grid.style.background="linear-gradient(135deg,#04140d,#103b28,#22c55e)";
const cta=document.querySelector(".cta");
if(cta)cta.style.backgroundColor="#0b3020";
const register=document.querySelector(".register");
if(register)register.style.background="radial-gradient(circle at 50% 0%,#1b6b42 0%,#0b3020 60%,#04140d 100%)";
const footer=document.querySelector("footer");
if(footer)footer.style.backgroundColor="#04140d";
};
const initializePassword=function(){
const password=document.getElementById("password");
const passwordToggle=document.getElementById("passwordToggle");
if(!password||!passwordToggle||passwordToggle.dataset.ready==="true")return;
passwordToggle.dataset.ready="true";
passwordToggle.addEventListener("click",function(){
if(password.type==="password"){password.type="text";passwordToggle.textContent="🙈";}else{password.type="password";passwordToggle.textContent="👁";}
});
};
const initializeNews=function(){
const newsGrid=document.querySelector(".news-grid");
const newsItems=document.querySelectorAll(".news-grid-item");
const categoryButtons=document.querySelectorAll(".news-category-item");
const categorySelect=document.querySelector(".news-category .register-select");
if(!newsGrid||!newsItems.length)return;
const categories=["Bugungi xabarlar","So'nggi yangiliklar","Eng ko'p ko'rilgan","Transferlar"];
newsItems.forEach(function(item,index){
item.dataset.category=categories[index]||"Barchasi";
item.style.opacity="0";
item.style.transform="translateY(50px)";
item.style.transition="opacity .6s ease,transform .6s ease";
item.dataset.revealed="false";
});
const revealNews=function(){
newsItems.forEach(function(item,index){
const rect=item.getBoundingClientRect();
if(rect.top<window.innerHeight-50&&rect.bottom>0&&item.dataset.revealed!=="true"&&item.style.display!=="none"){
setTimeout(function(){item.style.opacity="1";item.style.transform="translateY(0)";item.dataset.revealed="true";},index*100);
}
});
};
const filterNews=function(category){
newsItems.forEach(function(item){
if(category==="Barchasi"||category===""||item.dataset.category===category){
item.style.display="flex";
item.style.opacity="0";
item.style.transform="translateY(50px)";
item.dataset.revealed="false";
}else{item.style.display="none";}
});
setTimeout(revealNews,50);
};
categoryButtons.forEach(function(button){
if(button.dataset.ready==="true")return;
button.dataset.ready="true";
button.addEventListener("click",function(){filterNews(button.textContent.trim());});
});
if(categorySelect&&categorySelect.dataset.ready!=="true"){
categorySelect.dataset.ready="true";
categorySelect.addEventListener("change",function(){filterNews(categorySelect.options[categorySelect.selectedIndex].textContent.trim());});
}
window.addEventListener("scroll",revealNews,{passive:true});
window.addEventListener("resize",revealNews);
setTimeout(revealNews,100);
};
const initializeNavigation=function(){
document.querySelectorAll('a[href$=".html"],a[href="./"],a[href="/"]').forEach(function(link){
if(link.dataset.navigationReady==="true")return;
link.dataset.navigationReady="true";
link.addEventListener("click",function(event){
const href=link.getAttribute("href");
const target=link.getAttribute("target");
if(!href||href.startsWith("#")||target==="_blank"||href.startsWith("http://")||href.startsWith("https://"))return;
event.preventDefault();
loadPage(href,true);
});
});
};
const loadPage=function(url,pushState){
if(!url||url.includes("#"))return;
const currentUrl=new URL(window.location.href);
const newUrl=new URL(url,window.location.href);
if(newUrl.origin!==currentUrl.origin)return;
document.body.classList.add("page-leaving");
setTimeout(function(){
fetch(newUrl.href).then(function(response){
if(!response.ok)throw new Error("Page yuklanmadi");
return response.text();
}).then(function(html){
const parser=new DOMParser();
const newDocument=parser.parseFromString(html,"text/html");
const newMain=newDocument.querySelector("main");
const currentMain=document.querySelector("main");
if(!newMain||!currentMain){window.location.href=newUrl.href;return;}
currentMain.innerHTML=newMain.innerHTML;
const newTitle=newDocument.querySelector("title");
if(newTitle)document.title=newTitle.textContent;
const newHeader=newDocument.querySelector("header");
const currentHeader=document.querySelector("header");
if(newHeader&&currentHeader)currentHeader.innerHTML=newHeader.innerHTML;
const newFooter=newDocument.querySelector("footer");
const currentFooter=document.querySelector("footer");
if(newFooter&&currentFooter)currentFooter.innerHTML=newFooter.innerHTML;
if(pushState)history.pushState({},"",newUrl.href);
window.scrollTo({top:0,behavior:"smooth"});
document.body.classList.remove("page-leaving");
initializePage();
}).catch(function(){window.location.href=newUrl.href;});
},250);
};
const initializePage=function(){
applyBackgrounds();
initializePassword();
initializeNews();
initializeNavigation();
};
initializePage();
window.addEventListener("popstate",function(){loadPage(window.location.href,false);});
});