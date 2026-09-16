<script lang="ts">
  import QrCodeModal from './QrCodeModal.svelte';
  import { generatePixPayload, formatCurrencyBrl, parseBrlAmount } from '../utils/pix';

  interface Props {
    lang?: 'pt' | 'en';
  }

  let { lang = 'pt' }: Props = $props();

  let selectedAmount = $state<number>(60);
  let customAmount = $state<string>('');
  let isCustom = $state<boolean>(false);
  let isModalOpen = $state<boolean>(false);
  let copiedPayload = $state<boolean>(false);
  let copiedKey = $state<boolean>(false);
  let copyTimeoutPayload: number;
  let copyTimeoutKey: number;

  const pixKeyFormatted = '50.842.391/0001-60';

  const presets = [
    { value: 30, pt: 'R$ 30', en: '$6 / R$30' },
    { value: 60, pt: 'R$ 60', en: '$12 / R$60', popular: true },
    { value: 120, pt: 'R$ 120', en: '$24 / R$120' },
    { value: 300, pt: 'R$ 300', en: '$60 / R$300' },
  ];

  function selectPreset(val: number) {
    selectedAmount = val;
    isCustom = false;
    customAmount = '';
  }

  function selectAmount(val: number) {
    selectedAmount = val;
    const matchPreset = presets.find((p) => p.value === val);
    if (matchPreset) {
      isCustom = false;
      customAmount = '';
    } else {
      isCustom = true;
      customAmount = val > 0 ? val.toString() : '';
    }
  }

  function handleCustomInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const rawVal = target.value;
    customAmount = rawVal;
    isCustom = true;
    selectedAmount = parseBrlAmount(rawVal);
  }

  $effect(() => {
    function handleSelectAmountEvent(e: Event) {
      const customEv = e as CustomEvent<{ amount: number }>;
      if (customEv.detail && typeof customEv.detail.amount === 'number') {
        selectAmount(customEv.detail.amount);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('select-donation-amount', handleSelectAmountEvent);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('select-donation-amount', handleSelectAmountEvent);
      }
    };
  });

  let formattedAmountStr = $derived(formatCurrencyBrl(selectedAmount, lang));

  let currentPixPayload = $derived.by(() => {
    try {
      return generatePixPayload('50842391000160', 'CASA DOS FILHOS', 'MANAUS', selectedAmount);
    } catch (err) {
      console.error('Error generating dynamic PIX payload:', err);
      return '';
    }
  });

  function copyPixPayload() {
    try {
      const codeToCopy = currentPixPayload || pixKeyFormatted;
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(codeToCopy);
      }
      copiedPayload = true;
      clearTimeout(copyTimeoutPayload);
      copyTimeoutPayload = window.setTimeout(() => {
        copiedPayload = false;
      }, 3500);
    } catch (err) {
      console.error('Failed to copy PIX payload:', err);
    }
  }

  function copyPixKeyOnly() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(pixKeyFormatted);
      }
      copiedKey = true;
      clearTimeout(copyTimeoutKey);
      copyTimeoutKey = window.setTimeout(() => {
        copiedKey = false;
      }, 3500);
    } catch (err) {
      console.error('Failed to copy PIX key:', err);
    }
  }

  let currentImpact = $derived.by(() => {
    if (lang === 'en') {
      if (selectedAmount <= 30) return 'Provides healthy lunch and fresh fruit snacks for 1 child for an entire week.';
      if (selectedAmount <= 60) return 'Provides complete school supplies, notebooks, and learning books for classes.';
      if (selectedAmount <= 120) return 'Provides sports uniform/gi and 1 full month of Jiu-Jitsu or Ballet classes.';
      if (selectedAmount <= 300) return 'Comprehensive full monthly care for 1 child: daily meals, workshops & family support.';
      return 'Directly funds daily nutritious meals and educational workshops in Manaus.';
    } else {
      if (selectedAmount <= 30) return 'Almoço e lanches nutritivos com frutas frescas para 1 criança durante uma semana inteira.';
      if (selectedAmount <= 60) return 'Material pedagógico completo, livros e apostilas para aulas de reforço, Inglês e Espanhol.';
      if (selectedAmount <= 120) return 'Kimono de Jiu-Jitsu, sapatilha de balé, tabuleiros de xadrez e instrução semanal especializada.';
      if (selectedAmount <= 300) return 'Cuidado integral de uma criança: alimentação diária, todas as oficinas, apoio psicopedagógico e familiar.';
      return 'Garante a manutenção das despesas, alimentação e materiais gerais.';
    }
  });
</script>

<div id="doar" class="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100/80 transition-all duration-300">
  <!-- Top Rainbow Accent Bar -->
  <div class="absolute -top-1 left-8 right-8 h-1.5 rounded-t-full bg-rainbow-badge"></div>

  <!-- Toast Notification (Floating) -->
  {#if copiedPayload || copiedKey}
    <div class="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-xl animate-in slide-in-from-top duration-200">
      <svg class="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
      <span>
        {#if copiedPayload}
          {lang === 'pt' ? `Código PIX Copia e Cola (${formattedAmountStr}) copiado!` : `PIX Copy & Paste code (${formattedAmountStr}) copied!`}
        {:else}
          {lang === 'pt' ? 'Chave CNPJ copiada com sucesso!' : 'CNPJ PIX key copied successfully!'}
        {/if}
      </span>
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
        inputmode="decimal"
        placeholder={lang === 'pt' ? 'Ou digite outro valor (ex: 75,00)...' : 'Or enter custom amount (ex: 75.00)...'}
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

  <!-- PIX Key Box with Copy Action -->
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
      <button
        type="button"
        onclick={copyPixKeyOnly}
        class="text-xs font-bold text-rose-800 hover:text-rose-950 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200/60 transition-colors shrink-0 cursor-pointer"
      >
        {copiedKey ? (lang === 'pt' ? 'Copiada!' : 'Copied!') : (lang === 'pt' ? 'Copiar CNPJ' : 'Copy CNPJ')}
      </button>
    </div>
  </div>

  <!-- Primary CTAs (Copy PIX Copia e Cola with dynamic value & QR Code Modal) -->
  <div class="space-y-2.5">
    <button
      type="button"
      onclick={copyPixPayload}
      class="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.99] transition-all duration-200 cursor-pointer"
    >
      {#if copiedPayload}
        <svg class="w-5 h-5 text-emerald-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
        <span>{lang === 'pt' ? 'Código PIX Copiado!' : 'PIX Code Copied!'}</span>
      {:else}
        <svg class="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>{lang === 'pt' ? `Copiar PIX Copia e Cola (${formattedAmountStr})` : `Copy PIX Code (${formattedAmountStr})`}</span>
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
      <span>{lang === 'pt' ? `Gerar QR Code PIX (${formattedAmountStr})` : `Generate QR Code (${formattedAmountStr})`}</span>
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
