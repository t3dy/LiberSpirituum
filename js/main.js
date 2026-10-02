// Boot, the title screen.
window.L = window.L || {};
(function () {
  const G = L.G;
  const Main = L.Main = {};
  Main.title = function () {
    const saved = G.loadSaved();
    const el = document.getElementById('title');
    el.style.display = 'flex';
    el.innerHTML = `<div class="tbox">
      <div class="glyphs">☽ ☿ ♀ ☉ ♂ ♃ ♄ ✶</div>
      <h1>Liber de essentia spirituum</h1>
      <p class="sub">The Book of the Essence of Spirits: an occult role-playing game after Oxford, Corpus Christi College MS 125</p>
      <div class="glyphs small">🜃 🜄 🜁 🜂</div>
      <div class="tbtn">
        <button id="t-new"><kbd>N</kbd> Open the book</button>
        ${saved ? '<button id="t-cont"><kbd>C</kbd> Continue where the page is marked</button>' : ''}
      </div>
      <p class="credit">Text: the anonymous Liber, after Sophie Page’s edition and translation (2006, 2013) and Claire Fanger. Paraphrased; § numbers are Page’s.<br>Tiles: Kenney 1-Bit Pack (CC0). Glyphs: Unicode.</p>
    </div>`;
    const go = cont => {
      el.style.display = 'none';
      window.removeEventListener('keydown', key);
      document.getElementById('log').innerHTML = '';
      if (cont && saved) { G.load(saved); G.replayLog(); G.log('You find the marked page.', 'sky'); G.redraw(); }
      else { G.newState(); G.goto('mortlake', 6, 5); L.Story.intro(); }
      document.getElementById('view').focus();
    };
    const key = ev => { if (ev.key === 'n' || ev.key === 'N' || ev.key === 'Enter') go(false); if ((ev.key === 'c' || ev.key === 'C') && saved) go(true); };
    window.addEventListener('keydown', key);
    document.getElementById('t-new').onclick = () => go(false);
    if (saved) document.getElementById('t-cont').onclick = () => go(true);
  };
  window.addEventListener('load', () => {
    G.initRender();
    G.initInput();
    Main.title();
  });
})();
