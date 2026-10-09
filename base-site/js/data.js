/* =========================================================
   DADOS DO SITE — edite aqui contatos, pacotes, serviços e preços.
   Os itens de cada pacote aparecem na ordem desta lista.
   O ícone de cada serviço vem do mapa ICONS (nomes em lucide.dev/icons).
   ========================================================= */
(function () {
  var CONFIG = {
    whatsapp: 'https://wa.me/message/L4AAO3PJPYBOP1',
    phoneDisplay: '(54) 99712-0265',
    phoneTel: 'tel:+5554997120265',
    maps: 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Rua Bortolo Zani, 927 - Bela Vista, Caxias do Sul - RS, 95072-000')
  };

  var PACKAGES = [
    {
      num: '01', kicker: 'Pacote 01', nome: 'Lavagem Técnica', nivel: null,
      descricao: 'Limpeza técnica para o cuidado diário do veículo.',
      itens: ['Pré-lavagem', 'Lavagem externa do carro', 'Limpeza interna do carro'],
      precos: { carro: 180, suv: 200 }, art: 'foam', destaque: false
    },
    {
      num: '02', kicker: 'Pacote 02 · Nível 02', nome: 'Lavagem Detalhada', nivel: 'Nível 02',
      descricao: null,
      itens: ['Pré-lavagem', 'Lavagem externa do carro', 'Elevação do carro', 'Descontaminação de pintura',
        'Limpeza interna parcial', 'Aspiração interna', 'Limpeza de vidros'],
      precos: { carro: 300, suv: 350 }, art: 'beads', destaque: false
    },
    {
      num: '03', kicker: 'Pacote 03 · Nível 03', nome: 'Lavagem Detalhada', nivel: 'Nível 03',
      descricao: null,
      itens: ['Pré-lavagem', 'Lavagem externa do carro', 'Elevação do carro', 'Remoção das rodas',
        'Descontaminação de pintura', 'Lavagem detalhada das rodas e caixas de roda',
        'Limpeza interna completa', 'Hidratação dos plásticos e borrachas'],
      precos: { carro: 500, suv: 550 }, art: 'wheel', destaque: false
    },
    {
      num: '04', kicker: 'Pacote 04 · Nível 04', nome: 'Lavagem Detalhada', nivel: 'Nível 04',
      descricao: null,
      itens: ['Pré-lavagem', 'Lavagem externa do carro', 'Elevação do carro', 'Remoção das rodas',
        'Descontaminação de pintura', 'Lavagem detalhada das rodas e caixas de roda',
        'Limpeza interna completa', 'Limpeza de vidros', 'Condicionamento dos plásticos e borrachas',
        'Lavagem de motor com água quente', 'Lavagem de chassi com água quente'],
      precos: { carro: 600, suv: 700 }, art: 'steam', destaque: true
    }
  ];

  var ICONS = {
    'Pré-lavagem': 'droplets',
    'Lavagem externa do carro': 'car',
    'Limpeza interna do carro': 'armchair',
    'Elevação do carro': 'arrow-up-from-line',
    'Descontaminação de pintura': 'sparkles',
    'Limpeza interna parcial': 'armchair',
    'Aspiração interna': 'wind',
    'Limpeza de vidros': 'scan',
    'Remoção das rodas': 'disc',
    'Lavagem detalhada das rodas e caixas de roda': 'circle-dot',
    'Limpeza interna completa': 'armchair',
    'Hidratação dos plásticos e borrachas': 'droplet',
    'Condicionamento dos plásticos e borrachas': 'flask-conical',
    'Lavagem de motor com água quente': 'thermometer',
    'Lavagem de chassi com água quente': 'flame'
  };

  window.BASE_DATA = { CONFIG: CONFIG, PACKAGES: PACKAGES, ICONS: ICONS };
})();
