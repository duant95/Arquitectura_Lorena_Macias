// Traducción al INGLÉS del contenido por defecto (scaffolding / fallback).
// El contenido real que Lorena carga en el panel se traduce con DeepL al guardar.
// Las claves coinciden con las de CONTENT_DEFAULTS y las props de arrays de getContent().

const content = {
  // Inicio
  inicio_hero_eyebrow: 'Architecture · Interior design',
  inicio_hero_titulo: 'Architecture\nthat <em>breathes</em>.',
  inicio_hero_descripcion:
    'Architecture and interior design projects with identity and purpose. From the building to the detail.',
  inicio_manifiesto:
    'Architecture that listens to its place, embraces the <em>light</em> and is built to be lived in.',
  inicio_cta_titulo: "Let's bring your <em>project</em> to life.",
  inicio_cta_descripcion:
    'Tell us your idea or the project you have in mind. We help you make it real.',
  // Proyectos (hero)
  proyectos_hero_titulo: 'Two decades\nof <em>projects</em>.',
  proyectos_hero_lead:
    'A career told through its work: from the high-rise buildings alongside Gustafson y Asociados to today’s signature studio. Choose a stage to explore it.',
  // Servicios (hero)
  servicios_hero_titulo: 'Services',
  servicios_hero_lead:
    'End-to-end guidance, from the first idea to the last detail on site. Tailored design at every stage.',
  // Sobre mí
  nosotros_hero_titulo: 'To design is<br /><em>to listen</em>.',
  nosotros_intro_titulo: 'A perspective that blends technique, sensibility and experience.',
  nosotros_estudio_titulo: 'A <em>complete</em> service, from idea to build.',
  nosotros_estudio_texto:
    'Estudio de Arquitectura Lorena Macías is a studio specialized in architecture, interior design and project management, with more than 25 years of experience. We develop residential, commercial and corporate projects, offering a complete service that spans design and technical documentation, coordination, construction, site supervision, interior design and landscaping. We focus on creating functional, beautiful and personalized spaces, with close attention, quality and commitment on every project.',
  nosotros_intro_lead:
    'My work is <em>functional</em>, <em>sophisticated</em> and <em>practical</em>. Every project is a conversation with the place, the light and the people who will live in it.',
  nosotros_intro_texto:
    'I design, document, direct and sell: a complete vision of the project that lets me protect your investment at every stage, from the first idea to handover.',
  nosotros_hero_lead:
    'I’m Lorena Macías, architect and project manager. Over 25 years leading complex projects (buildings, gated communities, homes, interior and yacht design), from start to finish.',
  nosotros_historia:
    'I’m an architect with more than 25 years of uninterrupted experience in Paraguay. Since 2001 I devoted myself to the design, technical documentation and site management of high-standard residential buildings, working as Project Manager. In that stage, together with the Gustafson y Asociados studio, I led some of the largest works in Asunción’s premium market: buildings of 12 to 30 floors, with apartments of 350 to 550 m².\n\nFor a decade I also worked in the sales of premium units. That dual lens, technical and commercial, lets me guide each project understanding its value and its market too, and protect your investment at every stage.\n\nIn 2019 I founded my own studio, Lorena Macías Arquitectura. Today I lead highly complex projects as Project Manager and Director of Works: from gated communities and premium homes to yacht interiors, being the first architect in Paraguay to design yacht interiors, with projects in Paraguay, Brazil and Uruguay.',
  nosotros_cita:
    'I design spaces to be lived in: careful in their materials, connected to the light and faithful to those who inhabit them.',

  // Cifras del inicio
  stats: [
    { n: '+200', l: 'PROJECTS COMPLETED' },
    { n: '25', l: 'YEARS OF EXPERIENCE' },
    { n: '30', l: 'FLOORS · PREMIUM WORK' },
    { n: '1st', l: 'IN YACHT DESIGN IN PY' },
  ],

  // Servicios
  servicios: [
    {
      titulo: 'Architectural project',
      descripcion:
        'From the preliminary design to the executive project and site management. Buildings, gated communities and high-standard homes, resolved with technical rigor and design sensibility.',
      incluye: [
        'Preliminary design & design approach',
        'Executive project & technical documentation',
        '3D renders',
        'Architectural site supervision',
      ],
    },
    {
      titulo: 'Project Management',
      descripcion:
        'Comprehensive coordination of highly complex projects. I bring together teams and suppliers, control schedule, cost and quality, and defend your investment as an independent technical lead.',
      incluye: [
        'Coordination of teams and suppliers',
        'Schedule and cost control',
        'Risk management & change orders',
        'Executive reports & independent audit',
      ],
    },
    {
      titulo: 'Interior design',
      descripcion:
        'Bespoke residential and commercial interiors. We define materials, furniture and lighting to achieve warm, sophisticated and functional spaces.',
      incluye: ['Residential & commercial', 'Materials', 'Custom furniture', 'Lighting'],
    },
    {
      titulo: 'Yacht interior design',
      descripcion:
        'Yacht interior design: functional and elegant spaces, thought through in detail for life on board and for making the most of every centimeter.',
      incluye: ['Space optimization', 'Marine materials', 'Custom furniture', 'Lighting'],
    },
    {
      titulo: 'Renovations & construction',
      descripcion:
        'We renovate and expand spaces with an integral vision. We direct and carry out the work with quality standards and attention to detail.',
      incluye: ['Full renovations', 'Extensions', 'Site management', 'Execution'],
    },
    {
      titulo: 'Landscaping',
      descripcion:
        'We design the outdoors as a natural extension of your space: gardens, decks, pools and green areas that connect the space with its surroundings.',
      incluye: ['Garden design', 'Decks & outdoors', 'Planting', 'Relaxation areas'],
    },
  ],

  // Pasos del proceso (Servicios)
  servicios_pasos: [
    { titulo: 'Listen', descripcion: 'We understand your idea, needs and budget.' },
    { titulo: 'Design', descripcion: 'Preliminary design, materials and renders.' },
    { titulo: 'Build', descripcion: 'Documentation and site management.' },
    { titulo: 'Live', descripcion: 'A space ready to be lived in.' },
  ],

  // Etapas de Proyectos
  etapas: [
    {
      key: 'propio',
      label: 'Own studio',
      period: '2019 — present',
      blurb:
        'My signature studio. I design, document, direct and sell every project from start to finish: gated communities, premium homes, interiors and yacht design.',
      note: '',
    },
    {
      key: 'gustafson',
      label: 'Project Manager',
      period: '2001 — 2019',
      blurb:
        'For nearly two decades I led the design and management of large high-rise residential projects, helping define Asunción’s premium standard. A stage developed together with the Gustafson y Asociados studio.',
      note: 'Works from this stage, developed in collaboration. Intellectual property belongs to the studio.',
    },
  ],

  // Pilares (Sobre mí)
  pilares: [
    {
      titulo: 'Project Management',
      descripcion:
        'I coordinate highly complex projects, bringing architects, engineers, specialists and suppliers together toward a single goal.',
    },
    {
      titulo: 'Complete vision',
      descripcion:
        'I design, document, direct and sell: I accompany the whole project, from the first idea to handover, in a single hand.',
    },
    {
      titulo: 'Yacht interior design',
      descripcion: 'First architect in Paraguay to design yacht interiors.',
    },
    {
      titulo: 'Team & site partners',
      descripcion:
        'An in-house site team and a network of associated specialists that I bring to each project, according to what it needs.',
    },
  ],
};

export default content;
