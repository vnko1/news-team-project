var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},t={},r=e.parcelRequired7c6;null==r&&((r=function(e){if(e in n)return n[e].exports;if(e in t){var r=t[e];delete t[e];var i={id:e,exports:{}};return n[e]=i,r.call(i.exports,i,i.exports),i.exports}var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,n){t[e]=n},e.parcelRequired7c6=r),r("kGsIp"),r("e297a"),r("hJMQf");var i=r("i37YJ"),a=r("3yaUv"),s=r("cgfmJ");const l=document.getElementById("ul-gallery"),d=document.querySelector(".spinner-container");!function(){a.spinner.spin(document.body);try{const e=localStorage.getItem("read more"),n=JSON.parse(e);if(null===n)return void a.spinner.stop();0===n.length?(a.spinner.stop(),i.Report.info("There are no news You have read")):(!function(e){let n="";const t=e.map((e=>e.date)),r=[...t].sort(((e,n)=>n-e)).map((e=>{const n=new Date(e);return`${String(n.getDate()).padStart(2,0)}/${String(n.getMonth()+1).padStart(2,0)}/${String(n.getFullYear())}`})).filter(((e,n,t)=>t.indexOf(e)===n)),i=e.reduce(((e,n)=>{const t={},r=new Date(n.date);return t.date=`${String(r.getDate()).padStart(2,0)}/${String(r.getMonth()+1).padStart(2,0)}/${String(r.getFullYear())}`,t.img=n.img,t.descr=n.descr,t.title=n.title,t.link=n.link,t.alt=n.alt,t.category=n.category,t.id=n.id,t.dateArticle=n.dateArticle,e.push(t),e}),[]);a.spinner.spin(d);for(let e of r){n+=`<li>\n            <div class="date-wrap">\n                <p class="cards-date">${e}\n                   <svg class="arrow-read" width="15" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">\n                     <path d="M1.762 9 0 7.287 7.5 0 15 7.287 13.238 9 7.5 3.437 1.763 9Z" fill="#111321"/>\n                   </svg>\n                   <svg class="arrow-read visually-hidden" width="15" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">\n                     <path d="M1.762 0 0 1.713 7.5 9 15 1.713 13.238 0 7.5 5.563 1.763 0Z" fill="#111321"/>\n                   </svg>\n                </p>\n                <div class="clicker"></div>\n            </div>\n            <div class="news-item">\n                <div class="news-wrap">`+i.filter((n=>n.date===e)).map((e=>`<div class="news-card" news-id="${e.id}">\n      <div class="news-card__img">\n        <p class="news-card__theme">${e.category}</p>\n        <img\n          class="news-card__item"\n          src="${e.img}"\n          alt="${e.alt?e.alt:"photo"}"\n          loading="lazy"\n          width="395"\n        />\n        <div class="news-card__favorite">\n        <button id ='${e.id}' class="mybtn label-favorite">Add to favorite</button>\n        </div>\n      </div>\n      <h2 class="news-card__info-title">${e.title.limit(50,{ending:""})}</h2>\n      <p class="news-card__info-text">${e.descr.limit(120)}</p>\n      <div class="news-card__additional">\n        <p class="news-card__date">${e.dateArticle}</p>\n        <a class="news-card__more" href="${e.link}" id="${e.id}" target="_blank" rel="noreferrer noopener">Read more</a>\n      </div>\n    </div>`)).join("")+"</div></div></li>"}l.innerHTML=n,a.spinner.stop(),document.querySelectorAll(".news-item").forEach((e=>e.style.maxHeight=e.scrollHeight+"px")),document.querySelectorAll(".cards-date").forEach((e=>e.addEventListener("click",(()=>{const n=e.children;for(let e of n)e.classList.toggle("visually-hidden");const t=e.parentNode.nextElementSibling;"0px"!==t.style.maxHeight?t.style.maxHeight="0px":t.style.maxHeight=t.scrollHeight+"px"}))))}(n),a.spinner.stop())}catch(e){console.error(e),a.spinner.stop()}}(),(0,s.addClassesForCoincidencesMarkupAndStoragePages)();
//# sourceMappingURL=read.89adaf6b.js.map
