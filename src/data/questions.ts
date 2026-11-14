import type {
  BotReply,
  KnowledgeEntry,
  MessageBlock,
  QuickQuestion,
  QuickQuestionId,
} from "@/types/chat";
import { institution, links } from "@/data/institution";

/**
 * Base de respostas SIMULADAS do FAEBOT (fase 1 — somente front-end).
 *
 * Fontes (todas oficiais):
 *  - Site da unidade ........ https://www.faeterjbm.com.br (Início, Cursos, Pilares,
 *                             Linhas de Pesquisa, Nossas Instalações, Sobre Nós, Contato)
 *  - Matriz curricular ...... https://www.faeterjbm.com.br/assets/pdf/matriz.pdf (Matriz 2022)
 *  - Edital FAETEC 2026.1 ... Edital 8 — Ensino Superior (COSEAC/UFF): vagas, prova,
 *                             taxa, isenção, cotas e documentos de matrícula
 *  - Portal FAETEC .......... página "Educação Superior"
 *
 * Onde nenhuma fonte traz a informação (calendário acadêmico, horários de aula,
 * horário da secretaria, estágio), o FAEBOT diz isso e encaminha para a secretaria.
 *
 * Na fase 2 estas respostas passam a vir do banco de dados institucional.
 */

const { address, contact } = institution;
const fullAddress = `${address.street}, ${address.district}, ${address.city} — CEP ${address.zip}`;

/* ------------------------------------------------------------------ */
/* Perguntas rápidas                                                   */
/* ------------------------------------------------------------------ */

export const quickQuestions: QuickQuestion[] = [
  { id: "cursos", label: "Conhecer os cursos", prompt: "Quero conhecer os cursos da FAETERJ.", icon: "graduation" },
  { id: "sistemas-internet", label: "Sistemas para Internet", prompt: "Quero saber sobre o curso de Sistemas para Internet.", icon: "code" },
  { id: "ingresso", label: "Como ingressar na faculdade?", prompt: "Como faço para ingressar na faculdade?", icon: "door" },
  { id: "documentos-matricula", label: "Documentos e matrículas", prompt: "Quais documentos preciso para a matrícula?", icon: "file" },
  { id: "infraestrutura", label: "Estrutura da faculdade", prompt: "Como é a estrutura da faculdade?", icon: "monitor" },
  { id: "calendario", label: "Calendário acadêmico", prompt: "Onde vejo o calendário acadêmico?", icon: "calendar" },
  { id: "conhecer-faeterj", label: "Conhecer a FAETERJ", prompt: "Quero conhecer a FAETERJ Barra Mansa.", icon: "building" },
  { id: "atendimento", label: "Falar com atendimento", prompt: "Quero falar com um atendente.", icon: "headset" },
];

export function getQuickQuestion(id: QuickQuestionId): QuickQuestion | undefined {
  return quickQuestions.find((q) => q.id === id);
}

/* ------------------------------------------------------------------ */
/* Mensagem de boas-vindas                                             */
/* ------------------------------------------------------------------ */

export const welcomeContent: MessageBlock[] = [
  { type: "text", text: "Olá! 👋 Seja bem-vindo(a) à FAETERJ Barra Mansa!" },
  {
    type: "text",
    text: "Eu sou o FAEBOT, seu assistente virtual. Estou aqui para ajudar você a encontrar informações sobre nossa faculdade.",
  },
  { type: "text", text: "O que você gostaria de saber?" },
];

/* ------------------------------------------------------------------ */
/* Blocos reutilizáveis                                                */
/* ------------------------------------------------------------------ */

const contactBlock: MessageBlock = {
  type: "list",
  items: [
    `WhatsApp / celular: ${contact.phoneDisplay}`,
    `Telefone da unidade: ${contact.landlineDisplay}`,
    `E-mail da secretaria: ${contact.email}`,
  ],
};

const lastEditalNote: MessageBlock = {
  type: "text",
  text: "ℹ️ Dados do último processo seletivo publicado (Vestibular FAETEC 2026.1). Regras, datas e vagas podem mudar a cada edital.",
};

/* ------------------------------------------------------------------ */
/* Respostas das perguntas rápidas                                     */
/* ------------------------------------------------------------------ */

export const replies: Record<QuickQuestionId, BotReply> = {
  cursos: {
    content: [
      {
        type: "text",
        text: "A FAETERJ Barra Mansa é uma faculdade pública e gratuita, mantida pela FAETEC. O curso de graduação oferecido na unidade é:",
      },
      {
        type: "list",
        items: ["🎓 Tecnologia em Sistemas para Internet — curso superior tecnológico (tecnólogo), turno da noite, 5 períodos (2,5 anos)."],
      },
      {
        type: "text",
        text: "Ao longo do curso há saídas intermediárias com certificação em Web Design, Gestão de Negócios e Empreendedorismo Digital.",
      },
      {
        type: "links",
        links: [
          { label: "Página de cursos", href: links.cursos },
          { label: "Matriz curricular (PDF)", href: links.matriz },
        ],
      },
    ],
    suggestions: ["sistemas-internet", "ingresso"],
  },

  "sistemas-internet": {
    content: [
      {
        type: "text",
        text: "O curso de Tecnologia em Sistemas para Internet forma profissionais de TI com foco em desenvolvimento web, gestão e empreendedorismo digital.",
      },
      {
        type: "list",
        items: [
          "Grau: Tecnólogo (curso superior tecnológico)",
          "Duração: 5 períodos (2,5 anos)",
          "Turno: noite",
          "Carga horária: 2.100 h/a (incluindo 100 h/a de atividades acadêmico-científico-culturais)",
          "Ensino gratuito",
        ],
      },
      { type: "text", text: "Módulos por período:" },
      {
        type: "list",
        items: [
          "1º — Módulo Básico",
          "2º — Módulo Web Design",
          "3º — Módulo Gestão de Negócios",
          "4º — Módulo Empreendedorismo Digital",
          "5º — Módulo Desenvolvimento de Sistemas Web",
        ],
      },
      {
        type: "text",
        text: "Você estuda programação web e mobile, banco de dados, redes, engenharia de software, segurança, testes, governança de TI, marketing digital e empreendedorismo. No 4º e 5º períodos há o Projeto Integrador I e II, em que é possível propor uma startup de base tecnológica.",
      },
      {
        type: "text",
        text: "Áreas de atuação: desenvolvimento de software web e mobile, análise e arquitetura de sistemas, redes, banco de dados, gestão de projetos e consultoria em TI.",
      },
      { type: "text", text: "Quer ver as disciplinas? Pergunte, por exemplo: “disciplinas do 3º período”." },
      { type: "links", links: [{ label: "Matriz curricular (PDF)", href: links.matriz }] },
    ],
    suggestions: ["ingresso", "infraestrutura"],
  },

  ingresso: {
    content: [
      {
        type: "text",
        text: "A FAETEC realiza processos seletivos a cada semestre. Para a FAETERJ Barra Mansa existem dois caminhos:",
      },
      {
        type: "list",
        items: [
          "📝 Vestibular FAETEC — prova objetiva + redação, organizada pela COSEAC/UFF.",
          "🎯 SiSU — seleção pela nota do ENEM, quando o curso participa da edição.",
        ],
      },
      { type: "text", text: "No Vestibular FAETEC 2026.1, o curso de Sistemas para Internet (noite) teve 30 vagas:" },
      {
        type: "list",
        items: [
          "16 — Ampla concorrência",
          "6 — Rede pública",
          "6 — Negros, indígenas e quilombolas",
          "2 — Pessoas com deficiência e filhos de policiais/bombeiros mortos ou incapacitados em serviço",
        ],
      },
      {
        type: "text",
        text: "Requisito: ter concluído o Ensino Médio. Taxa de inscrição: R$ 58,00, com isenção para quem está no CadÚnico (NIS).",
      },
      lastEditalNote,
      {
        type: "links",
        links: [
          { label: "Portal COSEAC (inscrições)", href: links.coseac },
          { label: "FAETEC — Ensino Superior", href: links.faetecSuperior },
          { label: "Portal do SiSU", href: links.sisu },
        ],
      },
    ],
    suggestions: ["documentos-matricula", "sistemas-internet"],
  },

  "documentos-matricula": {
    content: [
      {
        type: "text",
        text: "Para a matrícula de calouros, o edital FAETEC pede originais e cópias de:",
      },
      {
        type: "list",
        items: [
          "Carteira de identidade e CPF",
          "Certidão de nascimento ou casamento",
          "Certificado de conclusão do Ensino Médio",
          "Histórico escolar do Ensino Médio",
          "Comprovante de residência",
          "3 fotos 3x4 coloridas e recentes",
          "Título de eleitor (maiores de 18 anos)",
          "Certificado de reservista (homens maiores de 18 anos)",
          "Identidade e CPF do responsável (menores de 18 anos)",
        ],
      },
      {
        type: "text",
        text: "Também é preciso levar o formulário de matrícula preenchido e a ficha de inscrição. Quem entrou por cotas apresenta ainda o NIS e os documentos da sua modalidade (autodeclaração, comprovante de escola pública ou laudo médico).",
      },
      {
        type: "text",
        text: "Em 2026.1 a matrícula foi feita presencialmente na unidade, de 12 a 16/01/2026, das 14h às 19h.",
      },
      lastEditalNote,
      {
        type: "text",
        text: "Para declarações, histórico e outros documentos de quem já é aluno, fale com a secretaria:",
      },
      { type: "whatsapp", reason: "Documentos e matrícula" },
      { type: "links", links: [{ label: "Edital FAETEC 2026.1 (PDF)", href: links.editalVestibular }] },
    ],
    suggestions: ["ingresso", "calendario"],
  },

  infraestrutura: {
    content: [
      { type: "text", text: "A FAETERJ Barra Mansa conta com:" },
      {
        type: "list",
        items: [
          "💻 3 laboratórios de informática híbridos para aulas práticas",
          "🌐 1 laboratório de redes (fibra óptica, segurança da informação e servidores)",
          "📶 Wi-Fi em todo o campus",
          "📚 Biblioteca com livros impressos, computadores para consulta e salas de estudo individual",
          "📖 Biblioteca Virtual com mais de 9.000 títulos",
          "♟️ Área de convivência com mesas de xadrez e TV",
        ],
      },
      { type: "text", text: "Está previsto também um espaço de coworking aberto à comunidade de Barra Mansa." },
      {
        type: "links",
        links: [
          { label: "Fotos das instalações", href: links.instalacoes },
          { label: "Biblioteca Virtual", href: links.biblioteca },
        ],
      },
    ],
    suggestions: ["sistemas-internet", "conhecer-faeterj"],
  },

  calendario: {
    content: [
      {
        type: "text",
        text: "O calendário acadêmico (início das aulas, provas, férias) ainda não está cadastrado na minha base, e não quero te passar datas erradas. 🙂",
      },
      { type: "text", text: "Para confirmar as datas do semestre, fale com a secretaria:" },
      contactBlock,
      { type: "whatsapp", reason: "Consultar o calendário acadêmico" },
    ],
    suggestions: ["documentos-matricula", "ingresso"],
  },

  "conhecer-faeterj": {
    content: [
      {
        type: "text",
        text: "A FAETERJ (Faculdade de Educação Tecnológica do Estado do Rio de Janeiro) é mantida pela FAETEC, fundação vinculada à Secretaria de Estado de Ciência, Tecnologia e Inovação.",
      },
      {
        type: "text",
        text: "A unidade de Barra Mansa fica no bairro Barbará, tem a Prefeitura de Barra Mansa como parceira e é a primeira faculdade pública do município.",
      },
      {
        type: "text",
        text: "Missão: promover atividades integradas de ensino, pesquisa e extensão de qualidade, com foco no desenvolvimento humano-tecnológico e na responsabilidade socioambiental.",
      },
      {
        type: "text",
        text: "Visão: ser referência em educação superior tecnológica no Sul Fluminense.",
      },
      {
        type: "text",
        text: "Valores: empreendedorismo, responsabilidade social e ambiental, ética, transparência, inovação, comprometimento e pluralidade de ideias.",
      },
      { type: "text", text: `📍 ${fullAddress}` },
      {
        type: "links",
        links: [
          { label: "Sobre nós", href: links.sobre },
          { label: "Ver no mapa", href: links.mapa },
        ],
      },
    ],
    suggestions: ["infraestrutura", "cursos"],
  },

  atendimento: {
    content: [
      {
        type: "text",
        text: "Claro! Posso te encaminhar para um atendente da FAETERJ Barra Mansa pelo WhatsApp.",
      },
      { type: "whatsapp", reason: "Atendimento humano" },
      { type: "text", text: `Se preferir, ligue para ${contact.landlineDisplay} ou envie um e-mail para ${contact.email}.` },
    ],
    suggestions: ["conhecer-faeterj", "cursos"],
  },
};

/* ------------------------------------------------------------------ */
/* Intenções extras (reconhecidas por texto livre)                     */
/* ------------------------------------------------------------------ */

const addressReply: BotReply = {
  content: [
    { type: "text", text: "A FAETERJ Barra Mansa fica em:" },
    { type: "text", text: `📍 ${fullAddress}` },
    { type: "links", links: [{ label: "Abrir no mapa", href: links.mapa }] },
  ],
  suggestions: ["infraestrutura", "atendimento"],
};

const contactReply: BotReply = {
  content: [
    { type: "text", text: "Estes são os contatos oficiais da FAETERJ Barra Mansa:" },
    contactBlock,
    {
      type: "text",
      text: "O horário de atendimento da secretaria ainda não está cadastrado aqui. Confirme pelo WhatsApp antes de ir até a unidade.",
    },
    { type: "links", links: [{ label: "Página de contato", href: links.contato }] },
    { type: "whatsapp" },
  ],
  suggestions: ["conhecer-faeterj"],
};

/** Disciplinas por período — Matriz Curricular 2022 (carga em horas-aula). */
const periods: { title: string; items: string[] }[] = [
  {
    title: "1º período — Módulo Básico (500 h/a)",
    items: [
      "Algoritmos e Linguagem de Programação I (120h)",
      "Metodologia da Pesquisa Científico-Tecnológica (60h)",
      "Português Instrumental (60h)",
      "Introdução à Lógica (60h)",
      "Matemática Aplicada (60h)",
      "Fundamentos de Sistemas Operacionais (60h)",
      "Inglês Instrumental (40h)",
      "Organização de Computadores (40h)",
    ],
  },
  {
    title: "2º período — Módulo Web Design (500 h/a)",
    items: [
      "Fundamentos de Redes de Computadores (80h)",
      "Algoritmos e Linguagem de Programação II (60h)",
      "Engenharia de Software e da Usabilidade (60h)",
      "Modelagem Conceitual de Dados (60h)",
      "Programação e Design para Web I (60h)",
      "Introdução à Administração (60h)",
      "Estatística Aplicada (40h)",
      "Gestão Ambiental e Responsabilidade Social (40h)",
      "Fundamentos de Estruturas de Dados (40h)",
    ],
  },
  {
    title: "3º período — Módulo Gestão de Negócios (500 h/a)",
    items: [
      "Análise e Projeto de Sistemas (120h)",
      "Programação e Design para Web II (80h)",
      "Mídias Digitais (60h)",
      "Gestão de Projetos Inovadores (60h)",
      "Gestão de Projeto de Banco de Dados (60h)",
      "Gestão de Processos (60h)",
      "Ética e Cidadania (60h)",
    ],
  },
  {
    title: "4º período — Módulo Empreendedorismo Digital (500 h/a)",
    items: [
      "Projeto Integrador I (80h)",
      "Programação para Dispositivos Móveis (80h)",
      "Empreendedorismo Digital (60h)",
      "Programação Cliente/Servidor (60h)",
      "Gestão de Sistemas Digitais na Web (60h)",
      "Comércio Eletrônico e Marketing Digital (60h)",
      "Segurança em Sistemas Computacionais (60h)",
      "Eletiva I (40h)",
    ],
  },
  {
    title: "5º período — Módulo Desenvolvimento de Sistemas Web (400 h/a)",
    items: [
      "Programação e Design para Web III (80h)",
      "Projeto Integrador II (80h)",
      "Governança de TI (60h)",
      "Qualidade e Testes de Software (60h)",
      "Legislação em Negócios Digitais (40h)",
      "Logística e Economia Digital (40h)",
      "Eletiva II (40h)",
    ],
  },
];

function periodReply(index: number): BotReply {
  const period = periods[index];
  return {
    content: [
      { type: "text", text: `📘 ${period.title}` },
      { type: "list", items: period.items },
      { type: "text", text: "Fonte: Matriz Curricular 2022 do curso (carga em horas-aula)." },
      { type: "links", links: [{ label: "Matriz curricular (PDF)", href: links.matriz }] },
    ],
    suggestions: ["sistemas-internet", "infraestrutura"],
  };
}

const gradeReply: BotReply = {
  content: [
    { type: "text", text: "Grade do curso de Sistemas para Internet (Matriz 2022), turno da noite:" },
    ...periods.map<MessageBlock>((p) => ({ type: "list", items: [`${p.title}: ${p.items.map((i) => i.replace(/ \(\d+h\)$/, "")).join(", ")}.`] })),
    {
      type: "text",
      text: "Para ver um período detalhado, pergunte, por exemplo: “disciplinas do 2º período”.",
    },
    { type: "links", links: [{ label: "Matriz curricular (PDF)", href: links.matriz }] },
  ],
  suggestions: ["sistemas-internet", "atendimento"],
};

const shiftReply: BotReply = {
  content: [
    {
      type: "text",
      text: "Sim! 🌙 O curso de Tecnologia em Sistemas para Internet é no turno da noite — ótimo para quem trabalha durante o dia.",
    },
    {
      type: "list",
      items: [
        "Turno: noite (é o único turno oferecido no site e no edital 2026.1)",
        "Carga semanal: 25 horas-aula do 1º ao 4º período e 20 no 5º",
        "Duração: 5 períodos (2,5 anos)",
      ],
    },
    {
      type: "text",
      text: "O horário exato de início e término das aulas de cada turma ainda não está cadastrado aqui. Confirme com a secretaria:",
    },
    { type: "whatsapp", reason: "Horário das aulas" },
  ],
  suggestions: ["sistemas-internet", "ingresso"],
};

const electivesReply: BotReply = {
  content: [
    {
      type: "text",
      text: "O curso tem duas disciplinas eletivas (Eletiva I no 4º período e Eletiva II no 5º, 40h cada). As opções da matriz são:",
    },
    {
      type: "list",
      items: [
        "Gestão de Serviços",
        "Arquitetura da Informação (Wireframe)",
        "Língua Brasileira de Sinais (LIBRAS)",
        "Design Thinking",
        "Computação Gráfica",
        "Empreendedorismo com Gamificação e Jogos",
        "Programação em PHP Básico",
        "Programação em Python Básico e Avançado",
      ],
    },
    { type: "text", text: "Quais eletivas abrem em cada semestre é definido pela coordenação." },
  ],
  suggestions: ["sistemas-internet"],
};

const projectReply: BotReply = {
  content: [
    {
      type: "text",
      text: "O Projeto Integrador (PI I no 4º período e PI II no 5º, 80h cada) é onde o aluno aplica o que aprendeu nas disciplinas para resolver um problema real do seu ambiente social — podendo inclusive propor uma startup de base tecnológica.",
    },
    {
      type: "text",
      text: "Ele faz parte do pilar de Pesquisa da faculdade. A unidade publicou um e-book gratuito com projetos integradores dos alunos.",
    },
    { type: "links", links: [{ label: "Linhas de pesquisa", href: links.linhasPesquisa }] },
  ],
  suggestions: ["sistemas-internet"],
};

const researchReply: BotReply = {
  content: [
    { type: "text", text: "O curso de Sistemas para Internet tem duas linhas de pesquisa:" },
    {
      type: "list",
      items: [
        "Engenharia Web (mobile, ERP, web): processos de desenvolvimento de software, modelagem, integração de sistemas e tecnologias emergentes para internet e dispositivos móveis.",
        "Empreendedorismo e Inovação (startups): técnicas e metodologias de inovação em produtos, serviços e processos para criar novos negócios de base tecnológica.",
      ],
    },
    {
      type: "text",
      text: "A faculdade se apoia em três pilares inseparáveis: Ensino (aulas, monitorias e laboratórios), Pesquisa (como os Projetos Integradores) e Extensão (cursos e serviços para a comunidade).",
    },
    {
      type: "links",
      links: [
        { label: "Linhas de pesquisa", href: links.linhasPesquisa },
        { label: "Pilares", href: links.pilares },
      ],
    },
  ],
  suggestions: ["sistemas-internet", "conhecer-faeterj"],
};

const quotasReply: BotReply = {
  content: [
    {
      type: "text",
      text: "No Vestibular FAETEC, 45% das vagas são reservadas para candidatos com hipossuficiência econômica (inscritos no CadÚnico):",
    },
    {
      type: "list",
      items: [
        "20% — Negros, indígenas e quilombolas",
        "20% — Estudantes que cursaram todo o Ensino Médio em escola pública",
        "5% — Pessoas com deficiência e filhos de policiais civis/militares, bombeiros e inspetores penitenciários mortos ou incapacitados em serviço",
      ],
    },
    {
      type: "text",
      text: "Em Sistemas para Internet (2026.1) isso representou 6 + 6 + 2 vagas, de um total de 30. Vagas de cotas não preenchidas passam para outras cotas e depois para a ampla concorrência.",
    },
    lastEditalNote,
    { type: "links", links: [{ label: "Edital FAETEC 2026.1 (PDF)", href: links.editalVestibular }] },
  ],
  suggestions: ["ingresso", "documentos-matricula"],
};

const examReply: BotReply = {
  content: [
    { type: "text", text: "Como foi a prova do Vestibular FAETEC 2026.1 (ensino superior):" },
    {
      type: "list",
      items: [
        "40 questões objetivas: 20 de Língua Portuguesa e 20 de Matemática (100 pontos)",
        "Redação de 20 a 30 linhas sobre tema atual (50 pontos)",
        "Duração: 4 horas",
        "Taxa de inscrição: R$ 58,00 — isenção para inscritos no CadÚnico (NIS)",
        "Inscrições, resultados e convocações: portal da COSEAC/UFF",
      ],
    },
    { type: "text", text: "Redações com menos de 20 linhas são eliminadas." },
    lastEditalNote,
    {
      type: "links",
      links: [
        { label: "Portal COSEAC", href: links.coseac },
        { label: "Edital 2026.1 (PDF)", href: links.editalVestibular },
      ],
    },
  ],
  suggestions: ["ingresso", "documentos-matricula"],
};

const internshipReply: BotReply = {
  content: [
    {
      type: "text",
      text: "A matriz curricular do curso não prevê estágio obrigatório. Ela inclui 100 h/a de atividades acadêmico-científico-culturais (atividades complementares) e os Projetos Integradores I e II.",
    },
    {
      type: "text",
      text: "Para regras de aproveitamento de atividades complementares ou estágio não obrigatório, fale com a coordenação ou a secretaria.",
    },
    { type: "whatsapp", reason: "Estágio e atividades complementares" },
  ],
  suggestions: ["sistemas-internet"],
};

const eadReply: BotReply = {
  content: [
    { type: "text", text: "Estes são os portais acadêmicos da FAETERJ Barra Mansa:" },
    {
      type: "list",
      items: [
        "Portal EAD — ambiente virtual de aprendizagem da unidade",
        "Biblioteca Virtual — mais de 9.000 títulos disponíveis para a comunidade acadêmica",
      ],
    },
    {
      type: "links",
      links: [
        { label: "Portal EAD", href: links.ead },
        { label: "Biblioteca Virtual", href: links.biblioteca },
      ],
    },
  ],
  suggestions: ["infraestrutura"],
};

const costReply: BotReply = {
  content: [
    {
      type: "text",
      text: "Não há mensalidade: a FAETERJ Barra Mansa é uma faculdade pública estadual e o ensino é gratuito. 🎉",
    },
    {
      type: "text",
      text: "O único custo previsto é a taxa de inscrição do vestibular (R$ 58,00 em 2026.1), com isenção para inscritos no CadÚnico.",
    },
  ],
  suggestions: ["ingresso", "sistemas-internet"],
};

const greetingReply: BotReply = {
  content: [
    { type: "text", text: "Olá! 😊 Que bom falar com você." },
    { type: "text", text: "Escolha um dos assuntos abaixo ou digite sua dúvida." },
  ],
  suggestions: ["cursos", "ingresso", "conhecer-faeterj"],
};

const thanksReply: BotReply = {
  content: [
    { type: "text", text: "Por nada! Fico feliz em ajudar. 💙" },
    { type: "text", text: "Se tiver outra dúvida, é só perguntar." },
  ],
  suggestions: ["cursos", "atendimento"],
};

export const fallbackReply: BotReply = {
  content: [
    {
      type: "text",
      text: "Hmm, ainda não tenho essa informação na minha base. 🤔 Estou em fase de aprendizado!",
    },
    {
      type: "text",
      text: "Você pode escolher um dos assuntos abaixo ou falar diretamente com nossa equipe:",
    },
    { type: "whatsapp", reason: "Dúvida não respondida pelo FAEBOT" },
  ],
  suggestions: ["cursos", "ingresso", "infraestrutura"],
  handoff: true,
};

/**
 * Base de conhecimento para mensagens digitadas.
 * As palavras-chave são comparadas ao texto normalizado (sem acentos, minúsculo).
 * Expressões com espaço valem 2 pontos; palavras soltas, 1. Vence a maior pontuação;
 * em caso de empate, a entrada que aparece primeiro.
 */
export const knowledgeBase: KnowledgeEntry[] = [
  { id: "atendimento", keywords: ["atendente", "atendimento", "humano", "falar com alguem", "falar com uma pessoa", "whatsapp", "pessoa de verdade", "ajuda humana", "reclamacao", "ouvidoria"], reply: replies.atendimento },
  { id: "periodo-1", keywords: ["1 periodo", "1o periodo", "primeiro periodo", "periodo 1", "modulo basico"], reply: periodReply(0) },
  { id: "periodo-2", keywords: ["2 periodo", "2o periodo", "segundo periodo", "periodo 2", "modulo web design"], reply: periodReply(1) },
  { id: "periodo-3", keywords: ["3 periodo", "3o periodo", "terceiro periodo", "periodo 3", "gestao de negocios"], reply: periodReply(2) },
  { id: "periodo-4", keywords: ["4 periodo", "4o periodo", "quarto periodo", "periodo 4", "empreendedorismo digital"], reply: periodReply(3) },
  { id: "periodo-5", keywords: ["5 periodo", "5o periodo", "quinto periodo", "ultimo periodo", "periodo 5"], reply: periodReply(4) },
  { id: "eletivas", keywords: ["eletiva", "optativa", "libras", "python", "php", "design thinking", "computacao grafica"], reply: electivesReply },
  { id: "projeto-integrador", keywords: ["projeto integrador", "tcc", "trabalho de conclusao", "startup", "e-book", "ebook"], reply: projectReply },
  { id: "pesquisa", keywords: ["pesquisa", "linhas de pesquisa", "pilar", "pilares", "extensao", "engenharia web", "inovacao"], reply: researchReply },
  { id: "estagio", keywords: ["estagio", "atividades complementares", "horas complementares", "aacc"], reply: internshipReply },
  { id: "grade", keywords: ["grade", "disciplina", "materia", "matriz", "curriculo", "o que vou estudar", "o que estuda"], reply: gradeReply },
  { id: "cotas", keywords: ["cota", "cotista", "reserva de vagas", "escola publica", "rede publica", "cadunico", "pcd", "deficiencia", "negro", "indigena", "quilombola"], reply: quotasReply },
  { id: "prova", keywords: ["prova", "redacao", "questoes", "vestibular", "coseac", "taxa", "isencao", "inscricao"], reply: examReply },
  { id: "custo", keywords: ["mensalidade", "pago", "pagar", "quanto custa", "preco", "gratuit", "de graca", "custa", "cobra", "dinheiro", "particular", "boleto"], reply: costReply },
  { id: "documentos-matricula", keywords: ["matricula", "documento", "documentacao", "declaracao", "historico", "diploma", "rematricula", "foto 3x4", "certidao", "reservista", "matricular", "papelada", "levar no dia", "rg", "cpf", "comprovante de residencia"], reply: replies["documentos-matricula"] },
  { id: "ingresso", keywords: ["ingress", "entrar", "sisu", "enem", "processo seletivo", "vaga", "selecao", "como faco para estudar", "como entro", "quero estudar", "estudar ai", "estudar la", "passar", "aprovado", "admissao", "concorrer", "candidato"], reply: replies.ingresso },
  { id: "infraestrutura", keywords: ["estrutura", "infraestrutura", "laboratorio", "wi-fi", "wifi", "internet no campus", "computador", "instalac", "coworking", "xadrez", "biblioteca fisica", "sala", "predio", "espaco", "pc"], reply: replies.infraestrutura },
  { id: "sistemas-internet", keywords: ["sistemas para internet", "sistemas", "programacao", "programar", "desenvolvimento web", "area de atuacao", "saida intermediaria", "duracao", "quanto tempo", "carga horaria", "mercado de trabalho", "emprego", "trabalhar com", "dura", "anos", "diploma de tecnologo", "o curso e bom"], reply: replies["sistemas-internet"] },
  { id: "horarios", keywords: ["horario", "aula", "turno", "noite", "noturno", "que horas", "de noite", "a noite", "manha", "tarde", "trabalho de dia", "quem trabalha", "trabalhando", "integral"], reply: shiftReply },
  { id: "calendario", keywords: ["calendario", "data", "ferias", "semestre", "inicio das aulas", "recesso", "volta as aulas", "comecam as aulas", "comeca as aulas", "quando comeca", "quando comecam", "comeco das aulas"], reply: replies.calendario },
  { id: "endereco", keywords: ["endereco", "onde fica", "localizacao", "como chegar", "mapa", "barbara", "rua"], reply: addressReply },
  { id: "contato", keywords: ["contato", "telefone", "email", "e-mail", "ligar", "fone", "numero", "secretaria"], reply: contactReply },
  { id: "ead", keywords: ["ead", "distancia", "biblioteca", "portal", "online", "livro"], reply: eadReply },
  { id: "cursos", keywords: ["curso", "graduacao", "faculdade oferece", "tecnologo", "formacao"], reply: replies.cursos },
  { id: "conhecer-faeterj", keywords: ["faeterj", "faetec", "sobre", "historia", "missao", "visao", "valores", "instituicao", "conhecer", "publica"], reply: replies["conhecer-faeterj"] },
  { id: "agradecimento", keywords: ["obrigad", "valeu", "agradec", "show", "perfeito"], reply: thanksReply },
  { id: "saudacao", keywords: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "eai", "e ai", "hello"], reply: greetingReply },
];
