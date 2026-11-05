(() => {
  'use strict';

  const am = {
    'The bride and groom walking hand in hand through the garden': 'ሙሽሮቹ እጅ ለእጅ ተያይዘው በአትክልት ስፍራው ሲጓዙ',
    'The garden lawn': 'የአትክልት ስፍራው ሣር',
    'Trees along the garden path': 'በመንገዱ ዳር ያሉ ዛፎች',
    'The train of the wedding gown': 'የሠርግ ቀሚሱ ረጅም ጫፍ',
    'The bride in her wedding gown': 'ሙሽሪት በሠርግ ልብሷ',
    'The groom on the garden path': 'ሙሽራው በአትክልት ስፍራው መንገድ ላይ',
    'The couple in the garden': 'ጥንዶቹ በአትክልት ስፍራ',
    'Date': 'ቀን',
    'Vow ceremony': 'የቃል ኪዳን ሥነ ሥርዓት',
    'Church': 'ቤተ ክርስቲያን',
    'Reception': 'የሰርግ ግብዣ',
    '2:00 PM': 'ከቀኑ 8፡00 ሰዓት',
    'Naflet Hotel Addis': 'ናፍሌት ሆቴል አዲስ',
    'Church directions': 'የቤተ ክርስቲያኑን አድራሻ ይመልከቱ',
    'Reception directions': 'የግብዣውን አድራሻ ይመልከቱ',
    'Binyam & Bethel | Wedding': 'ቢንያም እና ቤተል | ሰርግ',
    'Celebrate the wedding of Binyam and Bethel.': 'የቢንያምን እና የቤተልን ሰርግ አብረን እናክብር።',
    'Binyam and Bethel': 'ቢንያም እና ቤተል',
    'Binyam and Bethel holding hands and smiling at each other under a rose-covered arch': 'ቢንያም እና ቤተል በጽጌረዳ በተሸለመው ቅስት ሥር እጅ ለእጅ ተያይዘው ሲስቁ',
    'Binyam': 'ቢንያም',
    'Bethel': 'ቤተል',
    '&': 'እና',
    'Together with their families,': 'ከቤተሰቦቻቸው ጋር፣',
    'Dr. Binyam Markos': 'ዶ/ር ቢንያም ማርቆስ',
    'Bethel Elias': 'ቤተል ኤልያስ',
    'Dr. Binyam Markos & Bethel Elias': 'ዶ/ር ቢንያም ማርቆስ እና ቤተል ኤልያስ',
    'joyfully invite you to celebrate their wedding.': 'የሰርግ ስነ ስርዓት እንዲገኙልን በአክብሮት ተጠርተዋል።',
    'The details': 'መቼ እና የት',
    'When': 'መቼ',
    '21 November 2026': 'ቅዳሜ ኅዳር 12 ቀን፣ 2019 ዓ.ም',
    'Ceremony at': '',
    '6:00 PM': 'ከምሽቱ 12፡00 ሰዓት',
    'Where': 'የት',
    'Living Way Church': 'ሕያው መንገድ ቤተክርስቲያን',
    'Addis Ababa, Ethiopia': 'አራት ኪሎ ከአብረሆት ወደ ፒያሳ የሚወስደው መንገድ ላይ',
    'Add to calendar': 'ወደ ቀን መቁጠሪያ ጨምር',
    'Open in Google Maps': 'በጉግል ካርታ ክፈት',
    'Share your memories': 'ትዝታዎትን ያጋሩ',
    'Open the shared album': 'የጋራ አልበሙን ክፈት',
    'Choose photos': 'ፎቶዎችን ይምረጡ',
    'Photos are temporarily unavailable. Please try again.': 'ፎቶዎች ለጊዜው አይገኙም። እንደገና ይሞክሩ።',
    'Photo gallery': 'የፎቶ ማዕከል',
    'The couple under the rose arch': 'ጥንዶቹ በጽጌረዳ በተሸለመው ቅስት ሥር',
    'Bethel smiling': 'ቤተል ሲስቅ',
    'Binyam smiling': 'ቢንያም ስትስቅ',
    'Holding hands': 'እጅ ለእጅ ተያይዘው',
    'Will you marry me': 'ታገቢኛለሽ?',
    'Roses and tree': 'ጽጌረዳዎች እና ዛፍ',
    'Pink dress and blanket': 'ሮዝ ቀሚስ እና ብርድ ልብስ',
    'Previous photo': 'የቀድሞው ፎቶ',
    'Next photo': 'ቀጣዩ ፎቶ',
    'View full gallery': 'ሙሉ ጋለሪውን ይመልከቱ',
    'With love,': 'በፍቅር፣',
    'With love, Binyam and Bethel': 'በፍቅር፣ ቢንያም እና ቤተል',
    'Play background music': 'የጀርባ ሙዚቃውን አጫውት',
    'Pause background music': 'የጀርባ ሙዚቃውን አቁም',
    'Our shared memories': 'የጋራ ትዝታዎቻችን',
    'Close gallery': 'ጋለሪውን ዝጋ',
    'Download original': 'ዋናውን ፎቶ አውርድ',
    'Close photo': 'ፎቶውን ዝጋ',
    'Guest photo': 'የእንግዳ ፎቶ',
    'Previous': 'ቀዳሚ',
    'Next': 'ቀጣይ',
    'Try again': 'እንደገና ሞክር',
    'Delete this photo?': 'ይህን ፎቶ ይሰርዙ?',
    'Could not delete the photo. Please try again.': 'ፎቶውን መሰረዝ አልተቻለም። እንደገና ይሞክሩ።',
    'Download': 'አውርድ',
    'Select a photo to view or download the original.': 'ለማየት ወይም ዋናውን ለማውረድ ፎቶ ይምረጡ።',
    'No guest photos yet. Be the first to share one!': 'እስካሁን የእንግዶች ፎቶ የለም። መጀመሪያ እርስዎ ያጋሩ!',
    'Photos are temporarily unavailable. Close and try again.': 'ፎቶዎች ለጊዜው አይገኙም። ዝጉና እንደገና ይሞክሩ።',
    'Loading full-size photo…': 'ትልቁ ፎቶ እየተጫነ ነው…',
    'Could not load the photo.': 'ፎቶውን መጫን አልተቻለም።',
    'Could not load the full-size photo.': 'ትልቁን ፎቶ መጫን አልተቻለም።',
    'Choose JPEG, PNG, or WebP photos under 8 MB. Other files were not shared.': 'ከ8 MB በታች የሆኑ JPEG፣ PNG ወይም WebP ፎቶዎችን ይምረጡ። ሌሎች ፋይሎች አልተጋሩም።',
    'Photos shared': 'ፎቶዎች ተጋርተዋል',
    'No photos were uploaded. Please try again.': 'ምንም ፎቶ አልተጫነም። እንደገና ይሞክሩ።',
    'Upload failed. Please try again.': 'ፎቶዎችን መጫን አልተሳካም። እንደገና ይሞክሩ።',
    'Upload failed': 'ፎቶዎችን መጫን አልተሳካም',
    'Network error': 'የአውታረ መረብ ስህተት',
  };

  let language = 'en';
  try { if (localStorage.getItem('wedding-language') === 'am') language = 'am'; } catch (_) {}
  const linkedLanguage = new URLSearchParams(location.search).get('lang');
  if (linkedLanguage === 'en' || linkedLanguage === 'am') language = linkedLanguage;
  const textOriginals = new WeakMap();
  const attributeOriginals = new WeakMap();

  function translateAm(value) {
    if (!value) return value;
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(value);
    const core = match[2];
    let result = am[core];
    if (result === undefined) {
      let parts = /^Uploading (\d+)\/(\d+) · (\d+)%$/.exec(core);
      if (parts) result = `ፎቶዎች በመጫን ላይ ${parts[1]}/${parts[2]} · ${parts[3]}%`;
      parts = /^(Delete your photo|View guest photo|View photo|Download photo|Guest photo|Photo) (\d+)$/.exec(core);
      if (parts) {
        const labels = {
          'Delete your photo': 'የእርስዎን ፎቶ',
          'View guest photo': 'የእንግዳ ፎቶ',
          'View photo': 'ፎቶ',
          'Download photo': 'ፎቶ',
          'Guest photo': 'የእንግዳ ፎቶ',
          'Photo': 'ፎቶ',
        };
        const verbs = { 'Delete your photo': 'ሰርዝ', 'View guest photo': 'ይመልከቱ', 'View photo': 'ይመልከቱ', 'Download photo': 'ያውርዱ' };
        result = `${labels[parts[1]]} ${parts[2]}${verbs[parts[1]] ? ' ' + verbs[parts[1]] : ''}`;
      }
    }
    return result === undefined ? value : match[1] + result + match[3];
  }

  function translate(value) { return language === 'am' ? translateAm(value) : value; }

  function localizeText(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,noscript,svg,#langToggle')) return;
    const current = node.nodeValue;
    let source = textOriginals.get(node);
    if (source === undefined || (current !== source && current !== translateAm(source))) {
      source = current;
      textOriginals.set(node, source);
    }
    const target = language === 'am' ? translate(source) : source;
    if (current !== target) node.nodeValue = target;
  }

  function localizeAttribute(element, name) {
    const current = element.getAttribute(name);
    if (current === null || element.id === 'langToggle') return;
    let sources = attributeOriginals.get(element);
    if (!sources) { sources = {}; attributeOriginals.set(element, sources); }
    let source = sources[name];
    if (source === undefined || (current !== source && current !== translateAm(source))) source = sources[name] = current;
    const target = language === 'am' ? translate(source) : source;
    if (current !== target) element.setAttribute(name, target);
  }

  function updateNameImages() {
    const files = {
      'name-binyam': 'https://bereket6244.github.io/binyam-bethel-invite/images/biniyam-01.svg',
      'name-ampersand': 'https://bereket6244.github.io/binyam-bethel-invite/images/and-01.svg',
      'name-bethel': 'https://bereket6244.github.io/binyam-bethel-invite/images/bethel-01.svg',
    };
    for (const [className, amSource] of Object.entries(files)) {
      document.querySelectorAll(`.${className} img`).forEach(image => {
        if (!image.dataset.enSource) image.dataset.enSource = image.getAttribute('src');
        const target = language === 'am' ? amSource : image.dataset.enSource;
        if (image.getAttribute('src') !== target) {
          image.parentElement.classList.remove('is-ready');
          image.setAttribute('src', target);
        }
      });
    }
  }

  function apply() {
    document.documentElement.lang = language;
    document.documentElement.classList.toggle('lang-am', language === 'am');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) localizeText(walker.currentNode);
    document.querySelectorAll('[aria-label],[title],[alt],[placeholder]').forEach(element => {
      for (const name of ['aria-label', 'title', 'alt', 'placeholder']) localizeAttribute(element, name);
    });
    updateNameImages();
    document.title = language === 'am' ? am['Binyam & Bethel | Wedding'] : 'Binyam & Bethel | Wedding';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = language === 'am' ? am['Celebrate the wedding of Binyam and Bethel.'] : 'Celebrate the wedding of Binyam and Bethel.';
    const calendar = document.getElementById('calBtn');
    if (calendar?.href.includes('calendar.google.com')) {
      const url = new URL(calendar.href);
      url.searchParams.set('text', language === 'am' ? 'የቢንያም እና የቤተል ሰርግ' : 'Binyam & Bethel Wedding');
      url.searchParams.set('location', language === 'am' ? am['Living Way Church'] + '፣ አዲስ አበባ' : 'Living Way Church, Addis Ababa, Ethiopia');
      url.searchParams.set('details', language === 'am' ? 'ሥነ ሥርዓቱ በሕያው መንገድ ቤተክርስቲያን ከቀኑ 8 ሰዓት፣ የእራት ግብዣው በናፍሌት ሆቴል አዲስ ከምሽቱ 12 ሰዓት ይካሄዳል።' : 'Church at 2:00 PM at Living Way Church. Reception at 6:00 PM at Naflet Hotel Addis.');
      if (calendar.href !== url.href) calendar.href = url.href;
    }
    const button = document.getElementById('langToggle');
    if (button) {
      const label = language === 'am' ? 'EN' : 'አማ';
      const ariaLabel = language === 'am' ? 'ወደ እንግሊዝኛ ቀይር' : 'Switch to Amharic';
      if (button.textContent !== label) button.textContent = label;
      if (button.getAttribute('aria-label') !== ariaLabel) button.setAttribute('aria-label', ariaLabel);
      if (button.getAttribute('aria-pressed') !== String(language === 'am')) button.setAttribute('aria-pressed', String(language === 'am'));
      const hint = language === 'am'
        ? 'ቋንቋ ለመቀየር ይንኩ፤ የእንግሊዝኛ አገናኝ ለመቅዳት ተጭነው ይቆዩ'
        : 'Tap to switch; hold to copy an Amharic link';
      if (button.title !== hint) button.title = hint;
    }
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; apply(); });
  }

  window.weddingI18n = { translate, get language() { return language; }, apply: scheduleApply };
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('langToggle');
    let holdTimer;
    let longPressed = false;
    let suppressClick = false;
    let pointerStart;
    let statusTimer;
    const status = document.getElementById('languageLinkStatus');

    function showLinkStatus(message) {
      if (!status) return;
      status.textContent = message;
      status.classList.add('is-visible');
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => status.classList.remove('is-visible'), 2500);
    }

    async function copyLanguageLink() {
      // The circle names the language it switches to, so share that language.
      const target = language === 'am' ? 'en' : 'am';
      const url = new URL(location.pathname, location.origin);
      url.searchParams.set('lang', target);
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url.href);
      } catch (_) {
        const field = document.createElement('textarea');
        field.value = url.href;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
        document.body.appendChild(field);
        field.focus();
        field.select();
        field.setSelectionRange(0, field.value.length);
        let copied = false;
        try { copied = document.execCommand('copy'); } catch (_) {}
        field.remove();
        if (!copied) {
          showLinkStatus(language === 'am' ? 'አገናኙን መቅዳት አልተቻለም።' : 'Could not copy link');
          return;
        }
      }
      showLinkStatus(language === 'am' ? 'የእንግሊዝኛ አገናኝ ተቀድቷል።' : 'Amharic link copied');
    }

    function toggleLanguage() {
      language = language === 'en' ? 'am' : 'en';
      try { localStorage.setItem('wedding-language', language); } catch (_) {}
      const currentUrl = new URL(location.href);
      if (currentUrl.searchParams.has('lang')) {
        currentUrl.searchParams.set('lang', language);
        history.replaceState(history.state, '', currentUrl);
      }
      apply();
      document.dispatchEvent(new CustomEvent('wedding:languagechange', { detail: { language } }));
    }

    let touchStart;
    let touchHeld = false;
    let touchTimer;
    button?.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) return;
      // Suppress iOS's text-selection callout, which cancels pointer events.
      event.preventDefault();
      const touch = event.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY, time: performance.now() };
      touchHeld = false;
      suppressClick = false;
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => { touchHeld = true; }, 550);
    }, {passive: false});
    button?.addEventListener('touchmove', event => {
      if (!touchStart) return;
      const touch = event.touches[0];
      if (touch && Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y) < 12) return;
      clearTimeout(touchTimer);
      touchStart = null;
    }, {passive: false});
    button?.addEventListener('touchend', event => {
      if (!touchStart) return;
      event.preventDefault();
      clearTimeout(touchTimer);
      const held = touchHeld || performance.now() - touchStart.time >= 550;
      touchStart = null;
      suppressClick = true;
      if (held) copyLanguageLink();
      else toggleLanguage();
    }, {passive: false});
    button?.addEventListener('touchcancel', () => {
      clearTimeout(touchTimer);
      touchStart = null;
    });

    button?.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') return;
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      clearTimeout(holdTimer);
      longPressed = false;
      suppressClick = false;
      pointerStart = { x: event.clientX, y: event.clientY };
      holdTimer = setTimeout(() => { longPressed = true; }, 550);
    });
    button?.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) < 12) return;
      clearTimeout(holdTimer);
      pointerStart = null;
    });
    button?.addEventListener('pointerup', event => {
      if (event.pointerType === 'touch') return;
      clearTimeout(holdTimer);
      pointerStart = null;
      if (!longPressed) return;
      longPressed = false;
      suppressClick = true;
      copyLanguageLink();
    });
    button?.addEventListener('pointercancel', event => {
      if (event.pointerType === 'touch') return;
      clearTimeout(holdTimer);
      pointerStart = null;
      longPressed = false;
    });
    button?.addEventListener('contextmenu', event => {
      event.preventDefault();
      copyLanguageLink();
    });
    button?.addEventListener('click', event => {
      if (suppressClick) {
        suppressClick = false;
        event.preventDefault();
        return;
      }
      toggleLanguage();
    });
    new MutationObserver(scheduleApply).observe(document.body, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ['aria-label', 'title', 'alt', 'placeholder'],
    });
    apply();
  });
})();
