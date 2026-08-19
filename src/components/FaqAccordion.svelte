<script lang="ts">
  import { ui } from '../i18n/ui';

  interface Props {
    lang?: 'pt' | 'en';
  }

  let { lang = 'pt' }: Props = $props();

  let openIndex = $state<number | null>(0); // First question open by default

  const questions = [
    { qKey: 'faq.q1', aKey: 'faq.a1' },
    { qKey: 'faq.q2', aKey: 'faq.a2' },
    { qKey: 'faq.q3', aKey: 'faq.a3' },
    { qKey: 'faq.q4', aKey: 'faq.a4' },
    { qKey: 'faq.q5', aKey: 'faq.a5' },
  ] as const;

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<div class="w-full max-w-3xl mx-auto space-y-4">
  {#each questions as item, index}
    {@const isOpen = openIndex === index}
    <div
      class="bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md
      {isOpen ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200/80'}"
    >
      <button
        type="button"
        onclick={() => toggle(index)}
        class="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-base sm:text-lg text-slate-900 transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-header-${index}`}
      >
        <span class="pr-4 flex items-center gap-3">
          <span class="flex items-center justify-center w-7 h-7 rounded-full text-xs font-black {isOpen ? 'bg-rose-900 text-white' : 'bg-slate-100 text-slate-500'}">
            0{index + 1}
          </span>
          <span>{ui[lang][item.qKey]}</span>
        </span>
        <span
          class="shrink-0 p-1.5 rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 {isOpen ? 'rotate-180 bg-rose-100 text-rose-900' : ''}"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {#if isOpen}
        <div
          id={`faq-answer-${index}`}
          role="region"
          aria-labelledby={`faq-header-${index}`}
          class="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 animate-in fade-in duration-150"
        >
          <p>{ui[lang][item.aKey]}</p>
        </div>
      {/if}
    </div>
  {/each}
</div>
