import { translateTexts } from './api.js';

const MAX_NODES = 400;
const preserveEntries = [
  ['GuruLink.app', '__BRAND_GURULINK_APP__'],
  ['GuruLink™', '__BRAND_GURULINK_TM__'],
  ['GuruLink', '__BRAND_GURULINK__'],
];

const createPreserveMap = () => new Map(preserveEntries);

export function getCurrentLanguage() {
  if (typeof window === 'undefined') return 'en';
  return window.__GuruLinkTranslationState?.lang || 'en';
}

function collectTranslatableNodes(root) {
  if (typeof window === 'undefined' || !window.NodeFilter) return [];
  const nodes = [];
  const nodeFilter = window.NodeFilter;
  const walker = document.createTreeWalker(
    root,
    nodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (!node?.nodeValue) return nodeFilter.FILTER_REJECT;
        const text = node.nodeValue.trim();
        if (text.length < 2) return nodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return nodeFilter.FILTER_REJECT;
        const tag = parent.tagName?.toLowerCase();
        if (['script', 'style', 'noscript', 'select', 'option'].includes(tag)) {
          return nodeFilter.FILTER_REJECT;
        }
        let el = parent;
        while (el) {
          if (el.classList?.contains('notranslate') || el.hasAttribute?.('data-notranslate')) {
            return nodeFilter.FILTER_REJECT;
          }
          el = el.parentElement;
        }
        return nodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node;
  while ((node = walker.nextNode()) && nodes.length < MAX_NODES) {
    nodes.push(node);
  }
  return nodes;
}

export async function applyTranslation(langCode, { silent = false } = {}) {
  if (typeof window === 'undefined') return;
  const root = document.getElementById('root');
  if (!root) {
    if (!silent) alert('Unable to access page root for translation.');
    return;
  }

  const nodes = collectTranslatableNodes(root);
  if (!nodes.length) {
    if (!silent) alert('Nothing to translate on this view.');
    return;
  }

  const preserveMap = createPreserveMap();
  const texts = nodes.map(node => {
    let value = node.nodeValue;
    preserveMap.forEach((token, key) => {
      value = value.split(key).join(token);
    });
    return value;
  });

  const { translations } = await translateTexts({ texts, target: langCode });
  if (!Array.isArray(translations) || translations.length !== nodes.length) {
    if (!silent) alert('Translation service returned an unexpected response.');
    return;
  }

  for (let i = 0; i < nodes.length; i++) {
    let value = translations[i];
    preserveMap.forEach((token, key) => {
      value = value.split(token).join(key);
    });
    nodes[i].nodeValue = value;
  }

  window.__GuruLinkTranslationState = {
    lang: langCode,
    reapply: () => applyTranslation(langCode, { silent: true })
  };
  window.dispatchEvent(new CustomEvent('gurulink:language-applied', { detail: { lang: langCode } }));
}

export function changeLanguage(langCode) {
  if (langCode === 'en') {
    if (typeof window !== 'undefined') {
      window.__GuruLinkTranslationState = null;
      window.dispatchEvent(new CustomEvent('gurulink:language-applied', { detail: { lang: 'en' } }));
      window.location.reload();
    }
    return;
  }
  return applyTranslation(langCode);
}

