/* --- جێگای کۆدی پێشوو: بەجێی getImageFile() و بخشەکەی openSection() ئەمە بکاربهێنە --- */

const extensions = ["jpg","JPG","jpeg","JPEG","png","PNG","heic","HEIC"];
const placeholderURL = (prefix, i) => `https://via.placeholder.com/600x400?text=${prefix}${i}`;

/**
 * دروستکردنی <img> بە فۆڵبەکی فۆرماتی وێنە:
 * هەوڵ دەدات هەموو extensions لە لیستەکەی بالا تاقی بکات (با onerror)
 * ئەگەر هیچ یەک نەبێت، placeholder نیشان دەدرێت.
 *
 * returns HTMLImageElement (برای قرار دادن در DOM)
 */
function createImgWithFallback(prefix, index) {
  // create element
  const img = document.createElement('img');
  img.alt = `${prefix}${index}`;
  img.width = 600; // یا نیشاندانی CSS پێشتر
  img.height = 400;

  // keep track of which ext to try
  let tryIdx = 0;

  function tryNext() {
    if (tryIdx >= extensions.length) {
      // هیچ کۆدی پشتیوانی نییە -> placeholder
      img.src = placeholderURL(prefix, index);
      return;
    }
    const ext = extensions[tryIdx++];
    // note: case-sensitive on server; we try many casings above
    img.src = `images/${prefix}${index}.${ext}`;
    // if it fails, onerror will call tryNext again
  }

  // if image fails to load, try next extension
  img.onerror = function () {
    // avoid infinite loop in case placeholder also 404
    // if current src is our placeholder, stop
    if (img.src && img.src.indexOf('via.placeholder.com') !== -1) {
      img.onerror = null;
      return;
    }
    tryNext();
  };

  // start first try
  tryNext();
  return img;
}

/* Update openSection to use createImgWithFallback instead of getImageFile() */
function openSection(sec) {
  sectionTitle.textContent = sec.title;
  sectionSubtitle.textContent = sec.subtitle;
  itemsGrid.innerHTML = '';

  for (let i = 1; i <= sec.count; i++) {
    const el = document.createElement('div');
    el.className = 'item-card';

    // create image element with fallback loader
    const imgEl = createImgWithFallback(sec.prefix, i);
    imgEl.className = ''; // if you want a class, set it (e.g., 'item-img') 
    // wrap left part
    const imgWrapper = document.createElement('div');
    imgWrapper.style.flex = '0 0 220px';
    imgWrapper.appendChild(imgEl);

    const meta = document.createElement('div');
    meta.style.flex = '1';
    meta.innerHTML = `<h4>${sec.prefix}${i}</h4>`;

    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const btn = document.createElement('button');
    btn.className = 'small-btn primary';
    btn.textContent = 'گەورەکردن';
    // when clicked, open modal with current img.src
    btn.addEventListener('click', ()=>{
      openModal(imgEl.src, `${sec.prefix}${i}`);
    });
    actions.appendChild(btn);

    // assemble
    el.appendChild(imgWrapper);
    el.appendChild(meta);
    el.appendChild(actions);

    itemsGrid.appendChild(el);
  }

  homeView.style.display = 'none';
  sectionView.style.display = 'block';
  window.scrollTo(0,0);
}
