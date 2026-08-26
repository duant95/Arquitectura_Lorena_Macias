// Tradução para PORTUGUÊS (Brasil) do conteúdo padrão (scaffolding / fallback).
// O conteúdo real que Lorena carrega no painel é traduzido com DeepL ao salvar.
// As chaves coincidem com as de CONTENT_DEFAULTS e as props de arrays de getContent().

const content = {
  // Início
  inicio_hero_eyebrow: 'Arquitetura · Design de interiores',
  inicio_hero_titulo: 'Arquitetura\nque <em>respira</em>.',
  inicio_hero_descripcion:
    'Projetos de arquitetura e design de interiores com identidade e propósito. Do edifício ao detalhe.',
  inicio_manifiesto:
    'Uma arquitetura que escuta o lugar, abraça a <em>luz</em> e é construída para ser vivida.',
  inicio_cta_titulo: 'Vamos dar vida ao seu <em>projeto</em>.',
  inicio_cta_descripcion:
    'Conte sua ideia ou o projeto que você imagina. Nós ajudamos a torná-lo realidade.',
  // Projetos (hero)
  proyectos_hero_titulo: 'Duas décadas\nde <em>projetos</em>.',
  proyectos_hero_lead:
    'Uma trajetória contada pela sua obra: dos edifícios em altura ao lado da Gustafson y Asociados ao estúdio autoral de hoje. Escolha a etapa para percorrê-la.',
  // Serviços (hero)
  servicios_hero_titulo: 'Serviços',
  servicios_hero_lead:
    'Acompanhamento integral, da primeira ideia ao último detalhe da obra. Design sob medida em cada etapa.',
  // Sobre mim
  nosotros_hero_titulo: 'Projetar é<br /><em>escutar</em>.',
  nosotros_intro_titulo: 'Um olhar que combina técnica, sensibilidade e trajetória.',
  nosotros_estudio_titulo: 'Um serviço <em>integral</em>, da ideia à obra.',
  nosotros_estudio_texto:
    'O Estudio de Arquitectura Lorena Macías é um estúdio especializado em arquitetura, design de interiores e gerenciamento de projetos, com mais de 25 anos de experiência. Desenvolvemos projetos residenciais, comerciais e corporativos, oferecendo um serviço integral que vai do design e da documentação técnica à coordenação, construção, acompanhamento de obra, design de interiores e paisagismo. Focamos em criar espaços funcionais, estéticos e personalizados, com atendimento próximo, qualidade e compromisso em cada projeto.',
  nosotros_intro_lead:
    'Meu trabalho é <em>funcional</em>, <em>sofisticado</em> e <em>prático</em>. Cada projeto é uma conversa com o lugar, a luz e as pessoas que vão habitá-lo.',
  nosotros_intro_texto:
    'Eu projeto, documento, dirijo e vendo: uma visão integral do projeto que me permite cuidar do seu investimento em cada etapa, da primeira ideia à entrega da obra.',
  nosotros_hero_lead:
    'Sou Lorena Macías, arquiteta e project manager. Mais de 25 anos liderando projetos de alta complexidade (edifícios, condomínios fechados, residências, interiores e design náutico), do início ao fim.',
  nosotros_historia:
    'Sou arquiteta com mais de 25 anos de trajetória ininterrupta no Paraguai. Desde 2001 me dediquei ao design, à documentação técnica e à direção de obra de edifícios residenciais de alto padrão, atuando como Gerente de Projetos. Nessa etapa, em colaboração com o estúdio Gustafson y Asociados, liderei algumas das maiores obras do mercado premium de Assunção: edifícios de 12 a 30 andares, com apartamentos de 350 a 550 m².\n\nDurante uma década também trabalhei na comercialização de unidades premium. Esse duplo olhar, técnico e de negócio, me permite acompanhar cada projeto entendendo também o seu valor e o seu mercado, e cuidar do seu investimento em cada etapa.\n\nEm 2019 fundei meu próprio estúdio, Lorena Macías Arquitectura. Hoje lidero projetos de grande complexidade como Project Manager e Diretora de Obras: de condomínios fechados e residências premium ao design de interiores náutico, sendo a primeira arquiteta no Paraguai a projetar interiores de iates, com projetos no Paraguai, Brasil e Uruguai.',
  nosotros_cita:
    'Projeto espaços para serem vividos: cuidados na sua materialidade, conectados com a luz e fiéis a quem os habita.',

  // Números do início
  stats: [
    { n: '+200', l: 'PROJETOS REALIZADOS' },
    { n: '25', l: 'ANOS DE TRAJETÓRIA' },
    { n: '30', l: 'ANDARES · OBRA PREMIUM' },
    { n: '1ª', l: 'EM DESIGN NÁUTICO NO PY' },
  ],

  // Serviços
  servicios: [
    {
      titulo: 'Projeto arquitetônico',
      descripcion:
        'Do anteprojeto ao projeto executivo e à direção de obra. Edifícios, condomínios fechados e residências de alto padrão, resolvidos com rigor técnico e sensibilidade de design.',
      incluye: [
        'Anteprojeto & partido de design',
        'Projeto executivo & documentação técnica',
        'Renders 3D',
        'Direção arquitetônica de obra',
      ],
    },
    {
      titulo: 'Project Management',
      descripcion:
        'Coordenação integral de projetos de alta complexidade. Articulo equipes e fornecedores, controlo prazos, custos e qualidade, e defendo o seu investimento como responsável técnica independente.',
      incluye: [
        'Coordenação de equipes e fornecedores',
        'Controle de prazos e custos',
        'Gestão de riscos & change orders',
        'Relatórios executivos & auditoria independente',
      ],
    },
    {
      titulo: 'Design de interiores',
      descripcion:
        'Interiores residenciais e comerciais sob medida. Definimos materialidade, mobiliário e iluminação para alcançar espaços aconchegantes, sofisticados e funcionais.',
      incluye: ['Residencial & comercial', 'Materialidade', 'Mobiliário sob medida', 'Iluminação'],
    },
    {
      titulo: 'Design de interiores náutico',
      descripcion:
        'Design de interiores náutico: espaços funcionais e elegantes, pensados nos detalhes para a vida a bordo e para o aproveitamento de cada centímetro.',
      incluye: [
        'Aproveitamento do espaço',
        'Materialidade marinha',
        'Mobiliário sob medida',
        'Iluminação',
      ],
    },
    {
      titulo: 'Reformas e obras',
      descripcion:
        'Renovamos e ampliamos espaços com visão integral. Dirigimos e executamos a obra com padrões de qualidade e atenção ao detalhe.',
      incluye: ['Reformas integrais', 'Ampliações', 'Direção de obra', 'Execução'],
    },
    {
      titulo: 'Paisagismo',
      descripcion:
        'Desenhamos o exterior como uma extensão natural do seu ambiente: jardins, decks, piscinas e áreas verdes que conectam o espaço com o entorno.',
      incluye: ['Design de jardins', 'Decks & exteriores', 'Vegetação', 'Áreas de descanso'],
    },
  ],

  // Passos do processo (Serviços)
  servicios_pasos: [
    { titulo: 'Escutar', descripcion: 'Entendemos a sua ideia, necessidades e orçamento.' },
    { titulo: 'Projetar', descripcion: 'Anteprojeto, materialidade e renders.' },
    { titulo: 'Construir', descripcion: 'Documentação e direção de obra.' },
    { titulo: 'Habitar', descripcion: 'Um espaço pronto para ser vivido.' },
  ],

  // Etapas de Projetos
  etapas: [
    {
      key: 'propio',
      label: 'Estúdio próprio',
      period: '2019 — presente',
      blurb:
        'Meu estúdio autoral. Projeto, documento, dirijo e vendo cada projeto do início ao fim: condomínios fechados, residências premium, interiores e design náutico.',
      note: '',
    },
    {
      key: 'gustafson',
      label: 'Gerente de Projetos',
      period: '2001 — 2019',
      blurb:
        'Por quase duas décadas liderei o design e a direção de grandes projetos residenciais em altura, ajudando a definir o padrão premium de Assunção. Uma etapa desenvolvida em colaboração com o estúdio Gustafson y Asociados.',
      note: 'Obras desta etapa, desenvolvidas em colaboração. A propriedade intelectual pertence ao estúdio.',
    },
  ],

  // Pilares (Sobre mim)
  pilares: [
    {
      titulo: 'Project Management',
      descripcion:
        'Coordeno projetos de alta complexidade, articulando arquitetos, calculistas, especialistas e fornecedores rumo a um mesmo objetivo.',
    },
    {
      titulo: 'Visão integral',
      descripcion:
        'Projeto, documento, dirijo e vendo: acompanho o projeto completo, da primeira ideia à entrega, em uma só mão.',
    },
    {
      titulo: 'Design de interiores náutico',
      descripcion: 'Primeira arquiteta no Paraguai a projetar interiores de iates.',
    },
    {
      titulo: 'Equipe e parceiros de obra',
      descripcion:
        'Uma equipe própria de obra e uma rede de especialistas associados que somo a cada projeto, conforme o que ele precisa.',
    },
  ],
};

export default content;
