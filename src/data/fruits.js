const fruits = [
  {
    id: 'apfel',
    name: 'Apfel',
    emoji: '🍎',
    tagline: 'Der zeitlose Klassiker',
    description: 'Der Apfel ist die meistkultivierte Frucht der Welt — ein Symbol für Gesundheit, Wissen und Versuchung. Seit Jahrtausenden begleitet er die Menschheit und inspiriert Künstler, Wissenschaftler und Köche gleichermaßen.',
    origin: 'Zentralasien (Kasachstan)',
    season: 'August — November',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#EE5A24'],
    nutrients: { kalorien: 52, zucker: '10g', ballaststoffe: '2.4g', vitaminC: '14%' },
    facts: [
      'Es gibt über 7.500 Apfelsorten weltweit',
      'Äpfel schwimmen, weil sie zu 25% aus Luft bestehen',
      'Die Wissenschaft der Apfelzucht heißt Pomologie'
    ]
  },
  {
    id: 'mango',
    name: 'Mango',
    emoji: '🥭',
    tagline: 'Königin der Tropen',
    description: 'Die Mango ist die meistgegessene Frucht der Welt. Ihr intensives Aroma, ihre seidige Textur und ihre leuchtende Farbe machen sie zur unangefochtenen Königin tropischer Früchte.',
    origin: 'Südasien (Indien, Myanmar)',
    season: 'Mai — September',
    color: '#F9A825',
    gradient: ['#F9A825', '#FF8F00'],
    nutrients: { kalorien: 60, zucker: '14g', ballaststoffe: '1.6g', vitaminC: '60%' },
    facts: [
      'Indien produziert fast die Hälfte aller Mangos weltweit',
      'Die Mango ist mit der Cashewnuss verwandt',
      'Buddha meditierte unter einem Mangobaum'
    ]
  },
  {
    id: 'blaubeere',
    name: 'Blaubeere',
    emoji: '🫐',
    tagline: 'Kleines Superfood',
    description: 'Klein aber oho — die Blaubeere gilt als eines der nährstoffreichsten Lebensmittel überhaupt. Ihre Antioxidantien sind legendär, ihr Geschmack perfekt zwischen süß und herb.',
    origin: 'Nordamerika',
    season: 'Juni — September',
    color: '#5C6BC0',
    gradient: ['#5C6BC0', '#3949AB'],
    nutrients: { kalorien: 57, zucker: '10g', ballaststoffe: '2.4g', vitaminC: '16%' },
    facts: [
      'Blaubeeren waren eine der ersten Früchte, die kommerziell angebaut wurden',
      'Sie können Gedächtnis und Gehirnfunktion verbessern',
      'Die blaue Farbe kommt von Anthocyanen'
    ]
  },
  {
    id: 'zitrone',
    name: 'Zitrone',
    emoji: '🍋',
    tagline: 'Sauer macht lustig',
    description: 'Die Zitrone ist ein Multitalent — von der Küche über die Medizin bis zur Reinigung. Ihre Frische und Intensität sind unvergleichlich und machen sie zur meistgenutzten Zitrusfrucht der Welt.',
    origin: 'Nordostindien / China',
    season: 'Ganzjährig',
    color: '#FDD835',
    gradient: ['#FDD835', '#F9A825'],
    nutrients: { kalorien: 29, zucker: '2.5g', ballaststoffe: '2.8g', vitaminC: '88%' },
    facts: [
      'Zitronen können als natürliche Batterie funktionieren',
      'Im 18. Jh. wurden sie gegen Skorbut auf Schiffen eingesetzt',
      'Ein Zitronenbaum kann gleichzeitig Blüten und Früchte tragen'
    ]
  },
  {
    id: 'wassermelone',
    name: 'Wassermelone',
    emoji: '🍉',
    tagline: 'Sommer in einer Frucht',
    description: 'Nichts sagt „Sommer" wie eine aufgeschnittene Wassermelone. Sie besteht zu 92% aus Wasser und ist der perfekte natürliche Durstlöscher — erfrischend, süß und unwiderstehlich.',
    origin: 'Westafrika',
    season: 'Juni — August',
    color: '#EF5350',
    gradient: ['#EF5350', '#E53935'],
    nutrients: { kalorien: 30, zucker: '6g', ballaststoffe: '0.4g', vitaminC: '13%' },
    facts: [
      'Wassermelonen sind botanisch gesehen Beeren',
      'Jeder Teil der Wassermelone ist essbar, auch die Schale',
      'Die größte Wassermelone wog über 159 kg'
    ]
  },
  {
    id: 'drachenfrucht',
    name: 'Drachenfrucht',
    emoji: '🐉',
    tagline: 'Exotische Schönheit',
    description: 'Die Drachenfrucht — oder Pitaya — ist so faszinierend wie ihr Name. Ihr außerirdisches Aussehen verbirgt ein mildes, erfrischendes Fruchtfleisch voller winziger schwarzer Samen.',
    origin: 'Mittelamerika',
    season: 'Juni — Oktober',
    color: '#EC407A',
    gradient: ['#EC407A', '#AD1457'],
    nutrients: { kalorien: 60, zucker: '8g', ballaststoffe: '3g', vitaminC: '3%' },
    facts: [
      'Die Pflanze blüht nur nachts und wird von Fledermäusen bestäubt',
      'Sie gehört zur Familie der Kakteen',
      'Es gibt rote, gelbe und weiße Sorten'
    ]
  },
  {
    id: 'pfirsich',
    name: 'Pfirsich',
    emoji: '🍑',
    tagline: 'Samtweiche Verführung',
    description: 'Der Pfirsich ist pure Sinnlichkeit — seine samtige Haut, sein saftiges Fruchtfleisch und sein betörendes Aroma machen ihn zur romantischsten aller Früchte.',
    origin: 'China',
    season: 'Juli — September',
    color: '#FF8A65',
    gradient: ['#FFAB91', '#FF7043'],
    nutrients: { kalorien: 39, zucker: '8g', ballaststoffe: '1.5g', vitaminC: '11%' },
    facts: [
      'In China gilt der Pfirsich als Symbol für Unsterblichkeit',
      'Pfirsiche und Mandeln sind eng verwandt',
      'Nektarinen sind eine Mutation des Pfirsichs'
    ]
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    emoji: '🥝',
    tagline: 'Grünes Kraftpaket',
    description: 'Unter ihrer unscheinbaren braunen Schale verbirgt die Kiwi ein leuchtendes Smaragdgrün voller Vitamine. Sie hat mehr Vitamin C als eine Orange und überrascht mit ihrem einzigartigen Geschmack.',
    origin: 'China (als „Chinesische Stachelbeere")',
    season: 'November — Mai',
    color: '#66BB6A',
    gradient: ['#66BB6A', '#43A047'],
    nutrients: { kalorien: 61, zucker: '9g', ballaststoffe: '3g', vitaminC: '154%' },
    facts: [
      'Kiwis wurden nach dem neuseeländischen Kiwi-Vogel benannt',
      'Die Schale ist essbar und nährstoffreich',
      'Kiwis enthalten ein Enzym, das Fleisch zart macht'
    ]
  }
]

export default fruits
