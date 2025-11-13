/* script.js - lazy batch=10 */
const sections = [
  { id:'derga', title:'دەرگا', subtitle:'دەرگاکان', prefix:'IMG', count:124 },
  { id:'kapar', title:'کەپر', subtitle:'کەپرەکان', prefix:'KAPR', count:31 },
  { id:'kətîbə', title:'کەتیبە', subtitle:'کەتیبەکان', prefix:'KATIBA', count:11 },
  { id:'mehajera', title:'مەحاجەرە', subtitle:'مەحاجەرەکان', prefix:'MHAJARA', count:14 },
  { id:'refa', title:'رەفە', subtitle:'رەفەکان', prefix:'RAFA', count:4 },
  { id:'qaderma', title:'قادرمە', subtitle:'قادرمەکان', prefix:'QADRMA', count:30 }
];

const extensions = ['jpg','JPG','jpeg','JPEG','png','PNG','heic','HEIC'];
const placeholder = (p,i)=>`https://via.placeholder.com/600x400?text=${p}${i}`;

const sectionsGrid = document.getElementById('sectionsGrid');
const homeView = document.getElementById('homeView');
const sectionView = document.getElementById('sectionView');
const sectionTitle = document.getElementById('sectionTitle');
const sectionSubtitle = document.getElementById('sectionSubtitle');
const itemsGrid = document.getElementById('itemsGrid');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');

let currentSection = null;
let loadedCount = 0;
const BATCH = 10;

sections.forEach(s=>{
  const card=document.createElement('div');card.className='card';
  card.innerHTML=`<div class="thumb">🧱</div><div><h3>${s.title}</h3><p>${s.subtitle}</p></div>`;
  card.addEventListener('click',()=>openSection(s));
  sectionsGrid.appendChild(card);
});

function createImgWithFallback(prefix,index){
  const img=document.createElement('img');
  img.alt=`${prefix}${index}`;
  let i=0;
  img.onerror=function(){
    i++;
    if(i<extensions.length){
      img.src=`images/${prefix}${index}.${extensions[i]}`;
    } else {
      img.onerror=null;
      img.src=placeholder(prefix,index);
    }
  };
  img.src=`images/${prefix}${index}.${extensions[0]}`;
  return img;
}

function loadBatch(sec){
  loader.style.display='block';
  const start = loadedCount + 1;
  const end = Math.min(sec.count, loadedCount + BATCH);
  for(let i=start;i<=end;i++){
    const el=document.createElement('div');el.className='item-card';
    const img = createImgWithFallback(sec.prefix,i);
    img.style.width='220px';img.style.height='140px';img.style.objectFit='cover';
    const meta=document.createElement('div');meta.innerHTML=`<h4>${sec.prefix}${i}</h4>`;
    const actions=document.createElement('div');actions.className='item-actions';
    const btn=document.createElement('button');btn.className='btn';btn.textContent='گەورەکردن';
    btn.addEventListener('click',()=>openModal(img.src,`${sec.prefix}${i}`));
    actions.appendChild(btn);
    el.appendChild(img);el.appendChild(meta);el.appendChild(actions);
    itemsGrid.appendChild(el);
  }
  loadedCount = end;
  loader.style.display = loadedCount < sec.count ? 'block' : 'none';
}

function openSection(sec){
  currentSection = sec;
  loadedCount = 0;
  sectionTitle.textContent=sec.title;
  sectionSubtitle.textContent=sec.subtitle;
  itemsGrid.innerHTML='';
  loadBatch(sec);
  homeView.style.display='none';
  sectionView.style.display='block';
  window.scrollTo(0,0);
  setupScroll();
}

function setupScroll(){
  window.onscroll = function(){
    if(!currentSection) return;
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 120){
      if(loadedCount < currentSection.count){
        loadBatch(currentSection);
      }
    }
  }
}

document.getElementById('backBtn').addEventListener('click',()=>{
  sectionView.style.display='none';homeView.style.display='block';currentSection=null;window.onscroll=null;
});

function openModal(src,caption){
  modal.classList.add('show');document.getElementById('modalImg').src=src;document.getElementById('modalCaption').textContent=caption;
}
document.getElementById('modalClose').addEventListener('click',()=>modal.classList.remove('show'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}
