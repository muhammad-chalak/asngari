const sections = [
  { id:'derga', title:'دەرگا', subtitle:'دەرگاکان', prefix:'IMG', count:124 },
  { id:'kapar', title:'کەپر', subtitle:'کەپرەکان', prefix:'KAPR', count:31 },
  { id:'kətîbə', title:'کەتیبە', subtitle:'کەتیبەکان', prefix:'KATIBA', count:11 },
  { id:'mehajera', title:'مەحاجەرە', subtitle:'مەحاجەرەکان', prefix:'MHAJARA', count:14 },
  { id:'refa', title:'رەفە', subtitle:'رەفەکان', prefix:'RAFA', count:4 },
  { id:'qaderma', title:'قادرمە', subtitle:'قادرمەکان', prefix:'QADRMA', count:30 }
];

const sectionsGrid = document.getElementById('sectionsGrid');
const homeView = document.getElementById('homeView');
const sectionView = document.getElementById('sectionView');
const sectionTitle = document.getElementById('sectionTitle');
const sectionSubtitle = document.getElementById('sectionSubtitle');
const itemsGrid = document.getElementById('itemsGrid');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');

sections.forEach(s=>{
  const card=document.createElement('div');
  card.className='card';
  card.innerHTML=`
    <div class="thumb"><span style="font-size:28px;color:var(--accent);">🧱</span></div>
    <div><h3>${s.title}</h3><p>${s.subtitle}</p></div>`;
  card.addEventListener('click',()=>openSection(s));
  sectionsGrid.appendChild(card);
});

function openSection(sec){
  sectionTitle.textContent=sec.title;
  sectionSubtitle.textContent=sec.subtitle;
  itemsGrid.innerHTML='';
  for(let i=1;i<=sec.count;i++){
    const fileName=getImageFile(sec.prefix,i);
    const el=document.createElement('div');
    el.className='item-card';
    el.innerHTML=`
      <img src="${fileName}" alt="${sec.prefix}${i}">
      <div><h4>${sec.prefix}${i}</h4></div>
      <div class="item-actions"><button class="small-btn primary" data-img="${fileName}" data-name="${sec.prefix}${i}">گەورەکردن</button></div>`;
    el.querySelector('.primary').addEventListener('click',e=>{
      openModal(e.target.dataset.img,e.target.dataset.name);
    });
    itemsGrid.appendChild(el);
  }
  homeView.style.display='none';
  sectionView.style.display='block';
  window.scrollTo(0,0);
}

function getImageFile(prefix,index){
  const exts=["jpg","JPG","jpeg","JPEG","png","PNG","heic","HEIC"];
  for(const ext of exts){
    const file=`images/${prefix}${index}.${ext}`;
    if(imageExists(file)) return file;
  }
  return `https://via.placeholder.com/300x200?text=${prefix}${index}`;
}

function imageExists(url){
  const xhr=new XMLHttpRequest();
  xhr.open('HEAD',url,false);
  try{xhr.send();return xhr.status!=404;}catch{return false;}
}

document.getElementById('backBtn').addEventListener('click',()=>{
  sectionView.style.display='none';
  homeView.style.display='block';
});

function openModal(src,caption){
  modalImg.src=src;
  modalCaption.textContent=caption;
  modal.classList.add('show');
}
document.getElementById('modalClose').addEventListener('click',()=>modal.classList.remove('show'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show');});
