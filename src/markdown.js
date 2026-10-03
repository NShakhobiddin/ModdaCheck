/* MODDACHECK — kichik, xavfsiz Markdown render (React elementlari).
 * Qo'llab-quvvatlaydi: paragraflar, **qalin**, *kursiv*, `kod`, - / * / • ro'yxat,
 * 1. raqamli ro'yxat, # sarlavha, qator tashlash. HTML o'tkazilmaydi (XSS yo'q).
 * window.TaqiqMarkdown.render(text, React) -> React elementlari massivi */
(function (root) {
  'use strict';
  function inline(text, R, keyBase) {
    const out = [];
    const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
    let last = 0, m, i = 0;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      const tok = m[0];
      if (tok.startsWith('**')) out.push(R.createElement('strong', { key: keyBase + '-b' + i }, tok.slice(2, -2)));
      else if (tok.startsWith('`')) out.push(R.createElement('code', { key: keyBase + '-c' + i, className: 'md-code' }, tok.slice(1, -1)));
      else out.push(R.createElement('em', { key: keyBase + '-i' + i }, tok.slice(1, -1)));
      last = m.index + tok.length; i++;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }
  function render(text, R) {
    const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    const blocks = [];
    let para = [], list = null, k = 0;
    const flushPara = () => {
      if (!para.length) return;
      const children = [];
      para.forEach((ln, idx) => { if (idx) children.push(R.createElement('br', { key: 'br' + idx })); children.push(...inline(ln, R, 'p' + k + '-' + idx)); });
      blocks.push(R.createElement('p', { key: 'p' + (k++), className: 'md-p' }, children));
      para = [];
    };
    const flushList = () => {
      if (!list) return;
      blocks.push(R.createElement(list.type, { key: 'l' + (k++), className: list.type === 'ul' ? 'md-ul' : 'md-ol' },
        list.items.map((it, i) => R.createElement('li', { key: 'li' + i }, inline(it, R, 'li' + k + '-' + i)))));
      list = null;
    };
    for (const raw of lines) {
      const line = raw.trimEnd();
      const ul = /^\s*[-*•]\s+(.*)$/.exec(line);
      const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
      const h = /^\s*#{1,4}\s+(.*)$/.exec(line);
      if (!line.trim()) { flushPara(); flushList(); continue; }
      if (ul || ol) {
        flushPara();
        const type = ul ? 'ul' : 'ol';
        if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
        list.items.push((ul || ol)[1]);
        continue;
      }
      flushList();
      if (h) { flushPara(); blocks.push(R.createElement('p', { key: 'h' + (k++), className: 'md-h' }, inline(h[1], R, 'h' + k))); continue; }
      para.push(line);
    }
    flushPara(); flushList();
    return blocks;
  }
  root.TaqiqMarkdown = { render };
})(typeof window !== 'undefined' ? window : globalThis);
