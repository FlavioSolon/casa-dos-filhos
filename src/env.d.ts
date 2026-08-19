/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'qrcode' {
  export interface QRCodeToDataURLOptions {
    width?: number;
    margin?: number;
    scale?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' | 'low' | 'medium' | 'quartile' | 'high';
  }

  export function toDataURL(
    text: string | Buffer,
    options?: QRCodeToDataURLOptions
  ): Promise<string>;

  export function toDataURL(
    text: string | Buffer,
    callback: (error: Error | null | undefined, url: string) => void
  ): void;

  export function toDataURL(
    text: string | Buffer,
    options: QRCodeToDataURLOptions,
    callback: (error: Error | null | undefined, url: string) => void
  ): void;

  export function toString(
    text: string | Buffer,
    options?: any
  ): Promise<string>;

  export function toCanvas(
    canvasElement: HTMLCanvasElement,
    text: string | Buffer,
    options?: any
  ): Promise<void>;
}
