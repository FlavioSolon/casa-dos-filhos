<script lang="ts">
  import QrCodeModal from './QrCodeModal.svelte';

  interface Props {
    lang?: 'pt' | 'en';
  }

  let { lang = 'pt' }: Props = $props();

  let selectedAmount = $state<number>(50);
  let customAmount = $state<string>('');
  let isCustom = $state<boolean>(false);
  let isModalOpen = $state<boolean>(false);
  let copied = $state<boolean>(false);
  let copyTimeout: number;

  const pixKeyClean = '50842391000160';
  const pixKeyFormatted = '50.842.391/0001-60';

  const presets = [
    { value: 20, pt: 'R$ 20', en: '$4 / R$20' },
    { value: 50, pt: 'R$ 50', en: '$10 / R$50', popular: true },
    { value: 100, pt: 'R$ 100', en: '$20 / R$100' },
    { value: 250, pt: 'R$ 250', en: '$50 / R$250' },
  ];

  function selectPreset(val: number) {
    selectedAmount = val;
    isCustom = false;
    customAmount = '';
  }

  function handleCustomInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = target.value.replace(/\D/g, '');
    customAmount = val;
    isCustom = true;
    selectedAmount = val ? parseInt(val, 10) : 0;
  }

  function copyPixKey() {
    navigator.clipboard.writeText(pixKeyFormatted);
    copied = true;
    clearTimeout(copyTimeout);
    copyTimeout = window.setTimeout(() => {
      copied = false;
    }, 3500);
  }

  let currentImpact = $derived.by(() => {
    if (lang === 'en') {
      if (selectedAmount <= 20) return 'Provides healthy snacks and fresh fruit for 1 child for an entire week.';
      if (selectedAmount <= 50) return 'Provides full school supplies, notebooks, and learning books for classes.';
      if (selectedAmount <= 120) return 'Provides sports uniform/gi and 1 full month of Jiu-Jitsu or Ballet classes.';
      if (selectedAmount <= 250) return 'Provides a full staple food basket for the family of an assisted child.';
      return 'Directly funds daily nutritious meals and educational workshops in Manaus.';
    } else {
      if (selectedAmount <= 20) return 'Garante lanches saudáveis e frutas frescas para 1 criança por 1 semana.';
      if (selectedAmount <= 50) return 'Garante material escolar completo, livros e apostilas de reforço.';
      if (selectedAmount <= 120) return 'Garante kimono/uniforme e 1 mês completo de aulas de Jiu-Jitsu ou Balé.';
      if (selectedAmount <= 250) return 'Garante cesta de alimentos completa para a família de uma criança assistida.';
      return 'Apoio integral aos custos diários de alimentação e oficinas educativas em Manaus.';
    }
  });
</script>

<div id="doar" class="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100/80 transition-all duration-300">
  <!-- Top Rainbow Subtle Accent Bar -->
  <div class="absolute -top-1 left-8 right-8 h-1.5 rounded-t-full bg-rainbow-badge"></div>

  <!-- Toast Notification (Floating) -->
  {#if copied}
    <div class="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-xl animate-in slide-in-from-top duration-200">
      <svg class="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
      <span>{lang === 'pt' ? 'Chave PIX copiada para a área de transferência!' : 'PIX Key copied to clipboard!'}</span>
    </div>
  {/if}

  <!-- Header of Widget -->
  <div class="text-center mb-6">
    <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200/60 rounded-full text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
      <span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
      <span>{lang === 'pt' ? 'Doação Direta e Imediata' : 'Direct & Instant Donation'}</span>
    </div>
    <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
      {lang === 'pt' ? 'Faça Sua Doação via PIX' : 'Support Our Mission'}
    </h3>
    <p class="text-xs sm:text-sm text-slate-600 mt-1">
      {lang === 'pt' ? 'Escolha um valor para transformar o dia de uma criança em Manaus:' : 'Choose an amount to transform a child’s day in Manaus:'}
    </p>
  </div>

  <!-- Preset Selector Grid -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
    {#each presets as preset}
      <button
        type="button"
        onclick={() => selectPreset(preset.value)}
        class="relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer
        {selectedAmount === preset.value && !isCustom
          ? 'bg-rose-900 text-white border-rose-900 shadow-md scale-102'
          : 'bg-slate-50 hover:bg-rose-50 text-slate-800 border-slate-200/80 hover:border-rose-300'}"
      >
        {#if preset.popular}
          <span class="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-full uppercase tracking-tight shadow-xs">
            {lang === 'pt' ? 'Popular' : 'Most Chosen'}
          </span>
        {/if}
        <span>{lang === 'pt' ? preset.pt : preset.en}</span>
      </button>
    {/each}
  </div>

  <!-- Custom Amount Input Field -->
  <div class="mb-5">
    <div class="relative flex items-center">
      <span class="absolute left-3.5 text-xs font-bold text-slate-400">R$</span>
      <input
        type="text"
        inputmode="numeric"
        placeholder={lang === 'pt' ? 'Ou digite outro valor desejado...' : 'Or enter custom amount in BRL...'}
        value={customAmount}
        oninput={handleCustomInput}
        class="w-full pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border-2 rounded-2xl transition-all duration-200 outline-none
        {isCustom ? 'border-rose-800 bg-white ring-2 ring-rose-100' : 'border-slate-200 focus:border-rose-800 focus:bg-white'}"
      />
    </div>
  </div>

  <!-- Dynamic Impact Description Card -->
  <div class="p-3.5 bg-gradient-to-r from-rose-50/80 via-amber-50/60 to-rose-50/80 rounded-2xl border border-rose-100/90 mb-5 flex items-start gap-3">
    <div class="p-2 rounded-xl bg-white shadow-xs text-rose-600 shrink-0">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="text-xs text-slate-700 leading-relaxed">
      <span class="font-bold text-rose-950 block text-[11px] uppercase tracking-wide">
        {lang === 'pt' ? 'Impacto da sua contribuição:' : 'Your direct impact:'}
      </span>
      <span class="font-medium text-slate-800">{currentImpact}</span>
    </div>
  </div>

  <!-- PIX Key Box with 1-Click Copy Action -->
  <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl mb-4">
    <div class="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
      <span>{lang === 'pt' ? 'Chave PIX Oficial (CNPJ):' : 'Official PIX Key (CNPJ):'}</span>
      <span class="text-emerald-700 font-bold flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {lang === 'pt' ? 'Verificada' : 'Verified'}
      </span>
    </div>
    <div class="flex items-center justify-between gap-2">
      <span class="font-mono font-bold text-sm sm:text-base text-slate-900 tracking-wide select-all">
        {pixKeyFormatted}
      </span>
    </div>
  </div>

  <!-- Primary CTAs (Copy & QR Code Modal) -->
  <div class="space-y-2.5">
    <button
      type="button"
      onclick={copyPixKey}
      class="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.99] transition-all duration-200 cursor-pointer"
    >
      {#if copied}
        <svg class="w-5 h-5 text-emerald-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
        <span>{lang === 'pt' ? 'Chave PIX Copiada!' : 'PIX Key Copied!'}</span>
      {:else}
        <svg class="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>{lang === 'pt' ? 'Copiar Chave PIX (1 Clique)' : 'Copy PIX Key (1 Click)'}</span>
      {/if}
    </button>

    <button
      type="button"
      onclick={() => (isModalOpen = true)}
      class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-100/90 text-rose-950 font-bold text-sm rounded-2xl border border-rose-200/80 transition-colors duration-150 cursor-pointer"
    >
      <svg class="w-4 h-4 text-rose-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
      <span>{lang === 'pt' ? 'Pagar com QR Code PIX' : 'Pay with QR Code'}</span>
    </button>
  </div>

  <!-- Security Footer & International Hint -->
  <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-center text-xs text-slate-500">
    <div class="flex items-center gap-1.5 font-medium text-slate-600">
      <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span>{lang === 'pt' ? 'Destinatário Oficial: Casa dos Filhos (Sicoob)' : 'Official Recipient: Casa dos Filhos (Sicoob)'}</span>
    </div>
    
    <a
      href="#dados-bancarios"
      class="text-rose-800 hover:text-rose-950 font-semibold hover:underline"
    >
      {lang === 'pt' ? 'Ver dados bancários completos (Conta Corrente / TED)' : 'See full bank coordinates & international wire details'}
    </a>
  </div>
</div>

<!-- Svelte QR Code Modal Island -->
<QrCodeModal
  isOpen={isModalOpen}
  amount={selectedAmount}
  lang={lang}
  onClose={() => (isModalOpen = false)}
/>
