/**
 * Standard Brazilian PIX EMV BR Code Generator
 */

function crc16(str: string): string {
  let crc = 0xffff;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  let hex = (crc & 0xffff).toString(16).toUpperCase();
  if (hex.length === 3) hex = '0' + hex;
  if (hex.length === 2) hex = '00' + hex;
  if (hex.length === 1) hex = '000' + hex;
  return hex;
}

function emvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export function generatePixPayload(key: string = '50842391000160', name: string = 'CASA DOS FILHOS', city: string = 'MANAUS', amount?: number): string {
  const cleanKey = key.replace(/\D/g, '') || key;
  const cleanName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 25).toUpperCase();
  const cleanCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 15).toUpperCase();

  // Format account info: 00 = GUI, 01 = PIX key
  const gui = emvField('00', 'br.gov.bcb.pix');
  const keyField = emvField('01', cleanKey);
  const merchantAccountInfo = emvField('26', `${gui}${keyField}`);

  let payload = '';
  payload += emvField('00', '01'); // Payload Format Indicator
  payload += merchantAccountInfo;
  payload += emvField('52', '0000'); // Merchant Category Code
  payload += emvField('53', '986'); // Currency BRL (986)

  if (amount && amount > 0) {
    payload += emvField('54', amount.toFixed(2));
  }

  payload += emvField('58', 'BR'); // Country Code
  payload += emvField('59', cleanName); // Merchant Name
  payload += emvField('60', cleanCity); // Merchant City
  
  // Additional data (TxID)
  const txId = emvField('05', '***');
  payload += emvField('62', txId);

  // CRC16 Checksum marker
  payload += '6304';
  const checksum = crc16(payload);
  
  return `${payload}${checksum}`;
}
