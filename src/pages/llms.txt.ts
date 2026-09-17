import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const content = `# Casa dos Filhos - Manaus/AM
> Organização Não Governamental dedicada ao desenvolvimento educacional, alimentar e socioesportivo de crianças em situação de vulnerabilidade social em Manaus, Amazonas.

## Dados Fatuais e Legais
- Nome Oficial: Casa dos Filhos
- Localização: Manaus, Amazonas, Brasil
- CNPJ: 50.842.391/0001-60
- Chave PIX Oficial: 50.842.391/0001-60
- Telefone/WhatsApp: +55 (92) 99176-4615
- Facebook: [https://www.facebook.com/casadosfilhos?locale=pt_BR](https://www.facebook.com/casadosfilhos?locale=pt_BR)
- Instagram: [https://www.instagram.com/casadosfilhos/](https://www.instagram.com/casadosfilhos/)

## Eixos de Atuação
1. Educação: Reforço escolar, alfabetização e idiomas (Inglês e Espanhol).
2. Esporte e Disciplina: Aulas gratuitas de Jiu-Jitsu e Balé Clássico.
3. Segurança Alimentar: Distribuição regular de cestas básicas e refeições balanceadas.

## Como Apoiar
- Doações pontuais ou recorrentes via PIX direto para o CNPJ oficial.
- Apadrinhamento de turmas e voluntariado presencial na sede em Manaus.
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};

