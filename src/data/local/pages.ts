import type { ContentPage } from "@/src/core/content/types";

export const pages: ContentPage[] = [
  {
    id: "tt-lowbudget",
    slug: "tt-lowbudget",
    kind: "project",
    status: "published",
    eyebrow: "Uma fixa usada • R$ 800 • muitas adaptações",
    title: "TT Lowbudget",
    summary:
      "A Laranjinha começou como uma bicicleta fixa de aço. O plano é transformá-la em uma bike de contrarrelógio simples, funcional e divertida, sem fingir que todo improviso dá certo de primeira.",
    featured: true,
    featuredPosition: 2,
    card: {
      eyebrow: "Projeto em andamento",
      title: "TT Lowbudget",
      text: "A transformação de uma fixa usada em uma TT possível, um improviso por vez.",
      action: "Conhecer a Laranjinha →",
      placeholder: "TT\nLOWBUDGET",
    },
    seo: {
      title: "Dashound - TT Lowbudget",
      description:
        "A transformação de uma bicicleta fixa usada em uma bike de contrarrelógio acessível.",
    },
    blocks: [
      {
        id: "starting-point",
        type: "summary",
        title: "O ponto de partida",
        paragraphs: [
          "Compramos a bicicleta usada por R$ 800. Ela foi parte do kit de uma prova, Night Riders em 2023, e já chegou com guidão bullhorn, selim mais esportivo e rodas de perfil médio, mas ainda funcionava como single speed ou fixa: sem marchas, sem gancheira para câmbio e com freios que precisavam de atenção.",
          "O objetivo nunca foi construir uma superbike. A proposta é brincar com a ideia de uma TT acessível, reaproveitar o que já temos e registrar o custo e o raciocínio por trás de cada escolha.",
        ],
        items: [
          { label: "Base", value: "Fixa de aço usada" },
          { label: "Compra inicial", value: "R$ 800" },
          { label: "Transmissão", value: "7 velocidades" },
          { label: "Status", value: "Fase 1 em andamento" },
        ],
      },
      {
        id: "first-phase",
        type: "timeline",
        title: "A primeira fase",
        introduction:
          "Nos primeiros episódios, transformamos essa magrela em uma bike TT minimamente viável, mas não sem o devido sufoco! Cada solução revelou o problema seguinte.",
        items: [
          {
            title: "Entender a base",
            text: "O projeto começou pela bicicleta base e por um plano: mudar posição, realocar os manetes de freios, adicionar transmissão, instalar as barras aero e lidar com os problemas que surgirem ao longo do processo.",
          },
          {
            title: "Abrir espaço para a roda",
            text: "O quadro de fixa tinha dropouts próximos de 120 mm, enquanto a roda com marchas precisava de 130 mm. Como o quadro é de aço, fizemos um cold setting e conferimos o alinhamento com ferramentas improvisadas.",
          },
          {
            title: "Encontrar os primeiros BOs",
            text: "A primeira coroa tinha BCD 130 e não serviu no pedivela BCD 110. A catraca exigia outra ferramenta e força além do que tínhamos, enquanto o câmbio precisou de uma gancheira temporária.",
          },
          {
            title: "Saber quando pedir ajuda",
            text: "A oficina do Zagaia ajudou a remover a catraca antiga e instalar a nova de sete velocidades. Depois, começamos o cabeamento dos freios em uma posição pouco convencional para liberar o cockpit.",
          },
          {
            title: "Ouvir a comunidade",
            text: "Uma sugestão dos comentários melhorou a saída dos cabos de freio. As barras aero reaproveitadas não encaixavam no guidão fino, então uns espaçadores de borracha improvisados criaram uma fixação temporária firme.",
          },
          {
            title: "Dar marchas à Laranjinha",
            text: "Instalamos um passador por fricção na ponta da barra aero, conduzimos o cabo com conduíte, abraçadeiras e fita isolante e, desta vez com o BCD correto, montamos a nova coroa e a corrente.",
          },
        ],
        callout: {
          title: "Uma observação importante",
          text: "Esse projeto é uma experiência, não um manual universal. Alterações estruturais, freios e transmissão precisam ser pensados individualmente para cada bicicleta. Cold setting é uma intervenção aplicável a determinados quadros de aço e não deve ser reproduzida em alumínio ou carbono.",
        },
      },
      {
        id: "budget",
        type: "table",
        title: "Tabela de custos",
        introduction:
          "A tabela inclui o que foi comprado, ferramentas que entraram no processo, gastos que não deram certo e o valor hipotético de peças que já estavam disponíveis. Assim, o orçamento não parece mais barato do que foi.",
        caption: "Orçamento parcial do TT Lowbudget (Fase 1)",
        columns: ["Componente", "Preço", "Link"],
        rows: [
          [{ text: "Base" }, { text: "R$800" }, { text: "N/A" }],
          [
            { text: "Passadores" },
            { text: "R$61" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/passador-shimano-alavanca-de-cmbio-tourney-tz500-3x7v-cabos/p/MLB29387498?pdp_filters=item_id%3AMLB4486797185&from=gshop&matt_tool=33829689&matt_source=google&matt_campaign_id=22090354235&matt_ad_group_id=197094184771&matt_network=g&matt_device=c&matt_creative=792355617078&matt_ad_type=pla&matt_merchant_id=735098639&matt_product_id=MLB29387498-product",
            },
          ],
          [
            { text: "Groupset 7v" },
            { text: "R$44" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/cambio-traseiro-7v-cgancheira-bike-mtb--corrente-index-21v/up/MLBU764994005",
            },
          ],
          [
            { text: "Cabos e conduites" },
            { text: "R$23" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/kit-cabos-conduites-terminal-freio-e-marcha-completo-bike/up/MLBU2887995077",
            },
          ],
          [
            { text: "Catraca" },
            { text: "R$79" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/catraca-rosca-7v-shiftech-1128d-7v-indexada-bicicleta-mtb-estrada/p/MLB36609295",
            },
          ],
          [
            { text: "Enforca Gato" },
            { text: "R$20" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/abracadeira-nylon-enforca-gato-preto-10cm-15cm-20cm-oja-tools-300-unidades/p/MLB47634073",
            },
          ],
          [
            { text: "Placas PS" },
            { text: "R$30" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/chapa-placa-ps-poliestireno-preto-fosco-05mm-126x66cm/up/MLBU3719096393",
            },
          ],
          [
            { text: "Adesivo" },
            { text: "R$20" },
            {
              text: "Abrir link",
              href: "https://produto.mercadolivre.com.br/MLB-5370745406-vinil-adesivo-p-balo-bubble-silhouete-1mx30cm-envelopamento-_JM",
            },
          ],
          [
            { text: "Coroa" },
            { text: "R$29" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/coroa-speed-53-dentes-em-aco-bcd-130mm-5-furos-39t-39d/up/MLBU1461621282",
            },
          ],
          [
            { text: "Corrente" },
            { text: "R$36" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/corrente-7v-kmc-z7-116-elos-14v-21v-speed-mtb-megarange-3x7v/up/MLBU600354526",
            },
          ],
          [{ text: "Ferramentas" }, { text: "R$100" }, { text: "N/A" }],
          [
            { text: "Roda" },
            { text: "R$150" },
            {
              text: "Abrir link",
              href: "https://www.mercadolivre.com.br/par-de-rodas-700-gta-montadas-c-blocagem/up/MLBU4082459420",
            },
          ],
          [{ text: "Compras erradas..." }, { text: "R$23" }, { text: "N/A" }],
          [{ text: "Barras Aero" }, { text: "R$75" }, { text: "N/A" }],
        ],
        closing:
          "O total da planilha é R$ 1.490. Desconsiderando os valores hipotéticos da roda e das barras aero, o gasto registrado até aqui é de R$ 1.265, incluindo ferramentas e compras erradas.",
      },
      {
        id: "lessons",
        type: "card-grid",
        title: "O que aprendemos até aqui",
        cards: [
          {
            eyebrow: "Compatibilidade",
            title: "Medir vem antes de comprar",
            text: "BCD, largura do cubo e diâmetro do guidão transformam uma peça barata em gasto perdido.",
          },
          {
            eyebrow: "Limites",
            title: "Improvisar não é fazer tudo sozinho",
            text: "Ferramenta, técnica e segurança também fazem parte do orçamento. Os profissionais ajudaram quando precisava.",
          },
          {
            eyebrow: "Processo",
            title: "A versão 1 vai ser provisória",
            text: "Algumas soluções existem para testar a ideia agora e indicar o que merece um upgrade depois.",
          },
        ],
      },
    ],
    publishedAt: "2026-07-01T12:00:00.000Z",
    updatedAt: "2026-08-12T12:00:00.000Z",
  },
  {
    id: "useful-links",
    slug: "links-uteis-e-recomendacoes",
    kind: "guide",
    status: "published",
    eyebrow: "Curadoria da Katy",
    title: "Links úteis e recomendações",
    summary:
      "Materiais gratuitos, equipamentos e produtos que aparecem nos conteúdos da Katy, reunidos em um lugar mais fácil de consultar.",
    featured: true,
    featuredPosition: 1,
    card: {
      eyebrow: "Curadoria",
      title: "Links úteis e recomendações",
      text: "Materiais gratuitos, equipamentos e referências que aparecem nos conteúdos da Katy.",
      action: "Explorar a curadoria →",
      image: "/images/links/tenis.webp",
      imageAlt: "Seleção de recomendações da Dashound",
      mosaic: [
        {
          image: "/images/links/tenis.webp",
          imageAlt: "Tênis recomendado pela Dashound",
        },
        {
          image: "/images/links/rolo.webp",
          imageAlt: "Rolo smart para ciclismo indoor",
        },
        {
          image: "/images/links/liquid-iv.webp",
          imageAlt: "Produto de hidratação recomendado",
        },
      ],
    },
    seo: {
      title: "Dashound - Links úteis e recomendações",
      description:
        "Materiais gratuitos, equipamentos e produtos apresentados nos conteúdos da Katy.",
    },
    blocks: [],
    publishedAt: "2026-07-01T12:00:00.000Z",
    updatedAt: "2026-08-12T12:00:00.000Z",
  },
];
