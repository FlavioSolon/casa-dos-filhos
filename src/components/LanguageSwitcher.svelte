<script lang="ts">
  interface Props {
    currentLang?: 'pt' | 'en';
  }

  let { currentLang = 'pt' }: Props = $props();

  function switchLanguage(targetLang: 'pt' | 'en') {
    if (targetLang === currentLang) return;
    const pathname = window.location.pathname;
    let newPath = pathname;

    if (currentLang === 'pt' && pathname.startsWith('/pt')) {
      newPath = pathname.replace(/^\/pt\/?/, `/${targetLang}/`);
    } else if (currentLang === 'en' && pathname.startsWith('/en')) {
      newPath = pathname.replace(/^\/en\/?/, `/${targetLang}/`);
    } else {
      newPath = `/${targetLang}/`;
    }

    if (!newPath.endsWith('/')) {
      newPath += '/';
    }

    window.location.href = newPath;
  }
</script>

<div class="inline-flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200/80 shadow-xs gap-1" role="group" aria-label="Language selector">
  <button
    type="button"
    onclick={() => switchLanguage('pt')}
    class="flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] text-xs font-bold rounded-full transition-all duration-200 cursor-pointer {currentLang === 'pt' ? 'bg-white text-rose-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}"
    aria-pressed={currentLang === 'pt'}
    aria-label="Mudar para Português"
  >
    <span class="text-sm">🇧🇷</span>
    <span>PT</span>
  </button>
  <button
    type="button"
    onclick={() => switchLanguage('en')}
    class="flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] text-xs font-bold rounded-full transition-all duration-200 cursor-pointer {currentLang === 'en' ? 'bg-white text-rose-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}"
    aria-pressed={currentLang === 'en'}
    aria-label="Switch to English"
  >
    <span class="text-sm">🇺🇸</span>
    <span>EN</span>
  </button>
</div>
