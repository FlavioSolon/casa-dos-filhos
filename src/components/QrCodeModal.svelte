<script lang="ts">
  import QRCode from 'qrcode';
  import { generatePixPayload } from '../utils/pix';

  interface Props {
    isOpen: boolean;
    amount?: number;
    lang?: 'pt' | 'en';
    onClose: () => void;
  }

  let { isOpen, amount = 50, lang = 'pt', onClose }: Props = $props();

  let qrDataUrl = $state<string>('');
  let pixPayload = $state<string>('');
  let copied = $state<boolean>(false);
  let copyTimeout: number;

  $effect(() => {
    if (isOpen) {
      const payload = generatePixPayload('50842391000160', 'CASA DOS FILHOS', 'MANAUS', amount > 0 ? amount : undefined);
      pixPayload = payload;
      QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      }).then((url: string) => {
        qrDataUrl = url;
      });
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  });

  function copyPixCode() {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    copied = true;
    clearTimeout(copyTimeout);
    copyTimeout = window.setTimeout(() => {
      copied = false;
    }, 3000);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Accessible Backdrop Button -->
    <button
      type="button"
      class="fixed inset-0 w-full h-full bg-slate-900/70 backdrop-blur-xs cursor-default border-0 p-0"
      onclick={onClose}
      aria-label={lang === 'pt' ? 'Fechar modal' : 'Close modal'}
      tabindex="-1"
    ></button>

    <div
      class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 z-10"
    >
      <!-- Header Gradient & Close Button -->
      <div class="relative bg-gradient-to-r from-rose-900 via-rose-800 to-pink-800 p-6 text-white text-center">
        <!-- Close button -->
        <button
          type="button"
          onclick={onClose}
          class="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          aria-label={lang === 'pt' ? 'Fechar modal' : 'Close modal'}
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 mb-3">
          <svg class="w-6 h-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>

        <h3 id="modal-title" class="text-xl font-extrabold tracking-tight">
          {lang === 'pt' ? 'QR Code Oficial do PIX' : 'Official PIX QR Code'}
        </h3>
        <p class="text-xs text-rose-100 mt-1">
          {lang === 'pt' ? 'Aponte a câmera do seu banco para transferir' : 'Scan using your banking app to donate'}
        </p>

        {#if amount > 0}
          <div class="mt-3 inline-block bg-amber-400 text-amber-950 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
            {lang === 'pt' ? `Valor sugerido: R$ ${amount},00` : `Suggested amount: R$ ${amount}.00`}
          </div>
        {/if}
      </div>

      <!-- Body with QR Code Image -->
      <div class="p-6 flex flex-col items-center">
        <!-- QR Container with frame -->
        <div class="relative p-4 bg-white border-2 border-dashed border-rose-200 rounded-2xl shadow-inner flex items-center justify-center min-h-[220px]">
          {#if qrDataUrl}
            <img src={qrDataUrl} alt="QR Code PIX Casa dos Filhos" class="w-52 h-52 object-contain" />
          {:else}
            <div class="flex flex-col items-center gap-2 text-slate-400">
              <div class="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs font-medium">Gerando QR Code...</span>
            </div>
          {/if}
        </div>

        <!-- Beneficiary Badges -->
        <div class="w-full mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
          <div class="flex justify-between items-center text-slate-600">
            <span class="font-medium text-slate-500">{lang === 'pt' ? 'Favorecido:' : 'Beneficiary:'}</span>
            <span class="font-bold text-slate-900">CASA DOS FILHOS</span>
          </div>
          <div class="flex justify-between items-center text-slate-600">
            <span class="font-medium text-slate-500">{lang === 'pt' ? 'Chave CNPJ:' : 'CNPJ Key:'}</span>
            <span class="font-mono font-semibold text-rose-900">50.842.391/0001-60</span>
          </div>
          <div class="flex justify-between items-center text-slate-600">
            <span class="font-medium text-slate-500">{lang === 'pt' ? 'Banco:' : 'Bank:'}</span>
            <span class="font-semibold text-slate-800">Sicoob (756) • Manaus/AM</span>
          </div>
        </div>

        <!-- Copy Paste Code Button -->
        <div class="w-full mt-4">
          <button
            type="button"
            onclick={copyPixCode}
            class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all duration-150 cursor-pointer"
          >
            {#if copied}
              <svg class="w-5 h-5 text-emerald-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>{lang === 'pt' ? 'Código Copiado com Sucesso!' : 'Code Copied to Clipboard!'}</span>
            {:else}
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{lang === 'pt' ? 'Copiar Código PIX Copia e Cola' : 'Copy PIX Paste Code'}</span>
            {/if}
          </button>
        </div>

        <!-- Direct WhatsApp proof helper -->
        <a
          href="https://wa.me/5592991764615?text=Ol%C3%A1%2C+acabei+de+fazer+uma+doa%C3%A7%C3%A3o+para+a+Casa+dos+Filhos+e+gostaria+de+enviar+meu+comprovante%21"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5 hover:underline"
        >
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.96.524 1.769.814 2.8.814 3.18 0 5.768-2.587 5.768-5.766 0-3.18-2.588-5.766-5.772-5.766zm9.969 5.828c0 5.518-4.482 10-10 10-1.745 0-3.39-.45-4.834-1.246l-5.166 1.354 1.378-5.035c-.886-1.504-1.378-3.238-1.378-5.073 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
          </svg>
          {lang === 'pt' ? 'Enviar comprovante no WhatsApp' : 'Send receipt via WhatsApp'}
        </a>
      </div>
    </div>
  </div>
{/if}
