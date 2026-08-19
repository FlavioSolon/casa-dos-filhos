import { ui, defaultLang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): 'pt' | 'en' {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as 'pt' | 'en';
  return defaultLang;
}

export function useTranslations(lang: 'pt' | 'en' = defaultLang) {
  return function t(key: UiKey, vars: Record<string, string | number> = {}): string {
    const text = ui[lang][key] || ui[defaultLang][key] || key;
    return Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, 'g'), String(v)),
      text
    );
  };
}
