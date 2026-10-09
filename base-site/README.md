# Base Detalhamento Automotivo — site

Site estático (HTML, CSS e JavaScript), sem etapa de build.

## Estrutura

```
base-site/
├── index.html      # estrutura e conteúdo das seções
├── css/styles.css  # identidade visual, layout e responsividade
├── js/data.js      # contatos, pacotes, serviços e preços (edite aqui)
└── js/main.js      # renderização dos pacotes, menu, artes provisórias e animações
```

Bibliotecas carregadas por CDN: GSAP 3.12.5 + ScrollTrigger e Lucide 0.453.0. Fontes do Google Fonts.

## Como rodar no VS Code

1. Abra a pasta `base-site` no VS Code.
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.

Também funciona abrindo o `index.html` direto no navegador.

## Onde editar

- **Preços e serviços:** `js/data.js`, no array `PACKAGES`.
- **WhatsApp, telefone e endereço:** `js/data.js`, no objeto `CONFIG`.
- **Logotipo:** em `index.html`, troque o conteúdo de `.brand` (header e rodapé) por `<img src="img/logo.svg" alt="Base Detalhamento Automotivo">`.
- **Fotos reais:** as imagens atuais são ilustrações geradas em `<canvas>`. Na galeria (`index.html`), troque cada `<canvas ...>` por `<img src="img/foto.jpg" alt="..." loading="lazy">`. O CSS já aplica `object-fit: cover`. As imagens dos pacotes são definidas pelo campo `art` em `js/data.js`.
- **Hero:** o carro é um SVG ilustrativo dentro de `.hero-car`. Pode ser substituído por uma fotografia.

## Publicação

Qualquer hospedagem estática serve (Vercel, Netlify, Hostinger etc.). Basta enviar a pasta inteira.

## Vídeos de fundo

Os vídeos ficam na pasta `videos/` e são configurados apenas no `index.html`
(procure pelos comentários `===== VÍDEO...`).

| Arquivo esperado              | Onde aparece                        |
|-------------------------------|-------------------------------------|
| `videos/hero-1.mp4` … `hero-3.mp4` | Topo do site (alternam com fade) |
| `videos/experiencia.mp4`      | Seção "Experiência"                 |
| `videos/credenciamento.mp4`   | Seção "Credenciamento"              |
| `videos/contato.mp4`          | Seção "Contato"                     |

- Para usar outros nomes, troque o `src` da tag `<video>`.
- Para ter vários vídeos num mesmo fundo, adicione mais linhas `<video ...>` dentro da `<div class="bg-video">`.
- `data-interval="7"` define quantos segundos cada vídeo fica antes de trocar.
- Vídeo ausente ou com erro é ignorado e o fundo original continua.
- Recomendado: MP4 (H.264), até 1920×1080, sem áudio, 5–8 MB, 6–10 s.
