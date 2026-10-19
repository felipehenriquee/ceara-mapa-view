-- =====================================================================
-- Seed de cidades do Ceará — gerado a partir dos arquivos em /cidades
-- =====================================================================

USE `cearahoje`;

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Fortaleza',
    'fortaleza',
    'Terra da Luz',
    'Fortaleza é a capital do estado do Ceará, no Nordeste brasileiro. Está dividida administrativamente em sete Secretarias Executivas Regionais mais a Regional do Centro (Sercefor). As regionais abrigam atualmente 119 bairros. A cidade é conhecida por suas praias, palmeiras, dunas e lagoas. O litoral de Fortaleza possui uma extensão de 34 quilômetros com um total de 15 praias principais. Tem como limites a foz do Rio Ceará, ao norte, e do Rio Pacoti, ao sul. Na arquitetura, destaca-se a Catedral Metropolitana em estilo neogótico, o Theatro José de Alencar, que é uma construção em estilo art nouveau inaugurada em 1910 e o Cineteatro São Luis, construído em 1958. A cidade conta ainda com vários pontos turísticos: Passeio Público, Jardim Japonês, Beira Mar, Praia de Iracema, Estoril, Mercado dos Pinhões, Espigão da Praia de Iracema, Mercado Central, Mercado dos Peixes, Centro Dragão do Mar de Arte e Cultura, Emcetur, Forte de Nossa Senhora da Assunção, Museu do Ceará, Museu da Fotografia, Museu da Indústria, Museu da Cultura Cearense e Museu de Arte Contemporânea, Espaço Cultural Unifor, Caixa Cultural de Fortaleza, Sobrado Dr. José Loureço, Casa José de Alencar, Museu da Imagem e do Som, Minimuseu Firmeza e Museu do Automóvel, além de barracas de praia, lojas de artesanato, boates e casas de shows.',
    '312.353',
    'Caucaia, Maracanaú, Eusébio, Aquiraz, Pacatuba e Itaitinga.',
    '2669342',
    '2020-04-13',
    'Metropolitana de Fortaleza',
    'Fortaleza',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Crato',
    'crato',
    'Cratinho de Açúcar',
    'Crato é um município brasileiro do estado do Ceará. Faz divisa com o estado de Pernambuco, constituindo também um entroncamento rodoviário que interliga a cidade ao Piauí, Paraíba, Pernambuco, além de Fortaleza, capital do Ceará, da qual fica distante 508 km. O município é dividido em dez distritos: Crato (sede), Baixio das Palmeiras, Belmonte, Campo Alegre, Dom Quintino, Monte Alverne, Bela Vista, Ponta da Serra, Santa Fé e Santa Rosa. Localiza-se no sopé da Chapada do Araripe no extremo-sul do estado e suas temperaturas são relativamente baixas no inverno, embora elevadas no verão, ao contrário de outras áreas do Nordeste. O turismo constitui uma importante fonte de renda para o município com a Chapada do Araripe e as suas belezas naturais e a arquitetura do Centro Histórico do Crato, datada do século XVIII.',
    '1176.467',
    'ao norte: Farias Brito; ao sul: Exu e Moreilândia (PE); ao leste: Caririaçu, Juazeiro do Norte e Barbalha; à oeste: Nova Olinda e Santana do Cariri.',
    '132123',
    '2020-06-21',
    'Sul Cearense',
    'Cariri',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Croatá',
    'croata',
    NULL,
    'Croatá é uma cidade cearense que fica distante 352 km de Fortaleza, capital do estado. O município possui oito distritos: Croatá (sede), Barra do Sotero, Betânia, Santa Tereza, Repartição, Lagoa da Cruz, Vista Alegre, e São Roque. A economia do município é baseada na agricultura, pecuária e no turismo. Os principais eventos culturais são: o aniversário de emancipação política do município em 3 de maio e o dia da padroeira, Nossa Senhora das Dores em 15 de setembro.',
    '696.348',
    'norte: Guaraciaba do Norte; sul: Ipueiras; leste: Ipueiras, Ipu e Guaraciaba do Norte; oeste: estado do Piauí.',
    '18063',
    '2020-05-03',
    'Noroeste',
    'Ibiapaba',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Cruz',
    'cruz',
    NULL,
    'Cruz é uma cidade cearense que fica distante 235 km de Fortaleza, capital do estado. O município possui dois distritos: Cruz (sede) e Caiçara. A economia do município é baseada na agricultura, pecuária, comércio, artesanato e turismo com a Praia do Preá, que reúne muitos adeptos do kitesurf e windsurf. Os principais eventos culturais são: emancipação municipal (14 de janeiro), Dia da Paróquia (6 de abril), Festa do Distrito de Caiçara (22 de maio), Festival Junino - durante todo o mês de junho, Festa do Padroeiro São Francisco - Distrito de Caiçara (3º final de semana de setembro), Festa do Padroeiro São Francisco (24 de setembro a 4 de outubro) e a Festa de Nossa Senhora das Graças (2º final de semana de novembro).',
    '335.921',
    'Acaraú, Bela Cruz e Jijoca de Jericoacoara.',
    '24827',
    '2020-01-14',
    'Noroeste',
    'Litoral de Camocim e Acaraú',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Eusébio',
    'eusebio',
    'Cidade Verde',
    'Eusébio é um município brasileiro localizado na região nordeste do país, no estado do Ceará, distante 24 km da capital. Possui uma posição geográfica privilegiada, sendo passagem obrigatória para os que vão para o litoral leste nordestino e também para o sul do país. Como atrativos naturais, Eusébio possui as lagoas do Parnamirim, Eusébio (Polo de Lazer), da Precabura e o rio Pacoti. O município de Eusébio conta ainda com o autódromo internacional Virgílio Távora.',
    '79.005',
    'ao norte: Fortaleza; ao leste e ao sul: Aquiraz; à oeste: Fortaleza e Itaitinga.',
    '53618',
    '2020-06-23',
    'Metropolitana de Fortaleza',
    'Fortaleza',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Guaraciaba do Norte',
    'guaraciaba-do-norte',
    NULL,
    'A cidade de Guaraciaba do Norte está localizada em cima da Serra da Ibiapaba, no estado do Ceará, a 320 km de Fortaleza. Possui um imenso potencial turístico, com parques e trilhas ecológicas, voos de asa delta, parapente e mirantes. O ponto culminante está a 984 m de altitude. A Cachoeira da Mata Fresca fica a 19 km da sede do município e tem queda d''água de mais de 40 m de altura. A Cachoeira de Morrinhos é um cenário de águas límpidas e faz parte dos atrativos da cidade, a 22 km da sede, no distrito de Morrinhos Novos. A Bica do Urubu está a 10 km do centro da cidade e também é utilizada para a prática de rapel. Já a Bica do Chuvisco possui 4 m de queda d''água e se localiza no Sítio Cruz das Almas, na zona rural. A Cidade de Pedras apresenta diversas rochas esculpidas em diferentes formas pela ação do vento e da chuva, a 28 km do centro do município, no sítio Descoberta. O Buraco dos Flamingos é acessível através de uma pequena abertura e lá é possível encontrar pedras e algumas cavidades. Guaraciaba possui ainda um sítio arqueológico com uma colônia de pedras onde há inscrições primitivas. O Casarão Antigo se localiza no sítio Tamboatá, a 1 km de Guaraciaba, e serve para estudos históricos pois foi construído no século XVIII.',
    '624.606',
    'norte: Carnaubal, São Benedito, Graça; leste: Ipu e Reriutaba; oeste: Piauí; sul: Croatá.',
    '40642',
    '2020-05-12',
    'Noroeste Cearense',
    'Ibiapaba',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Ibaretama',
    'ibaretama',
    NULL,
    'Ibaretama é uma cidade cearense que fica distante 130 km de Fortaleza, capital do estado. O município possui cinco distritos: Ibaretama (sede), Nova Vida, Oiticica, Pedra e Cal e Piranji. A economia do município é baseada na agricultura, pecuária, extração mineral para obtenção de brita, extrativismo de madeiras diversas, além da manufatura de redes, bordados, chapéus-de-palha, couro e outros produtos. O principal evento cultural é a festa da padroeira, Nossa Senhora Auxiliadora.',
    '879.255',
    'norte: Itapiúna, Aracoiaba e Ocara; sul: Quixadá; leste: Morada Nova; oeste: Quixadá.',
    '13353',
    '2020-05-08',
    'Sertões',
    'Sertão de Quixeramobim',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Iguatu',
    'iguatu',
    'Terra das Lagoas',
    'Iguatu é um município brasileiro do estado do Ceará que fica distante 380 km da capital do estado, Fortaleza. O município é dividido em oito distritos: Iguatu (sede), Barreiras, Barro Alto, Baú, Gadelha, José de Alencar, Riacho Vermelho e Suassurana. O município tem várias atrações turísticas como: Açude Orós, Açude do Governo, Açude Trussu, Lagoa Baú, Lagoa da Bastiana, Lagoa da Telha, Lagoa do Barro Alto, Lagoa do Saco, Lagoa Iguatu, Riacho Antônio, Rio Jaguaribe, além da Igreja e Capela de Nossa Senhora do Perpétuo Socorro e da Igreja Matriz de Senhora Sant''Ana (antiga Sé Catedral).',
    '992.208',
    'norte: Acopiara e Quixelô; sul: Cedro e Cariús; leste: Orós e Icó; oeste: Jucás.',
    '102498',
    '2020-01-25',
    'Centro-Sul Cearense',
    'Iguatu',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Irauçuba',
    'iraucuba',
    'Terra da Amizade',
    'Irauçuba é uma cidade cearense que fica a 150 km de Fortaleza, capital do estado. O município possui seis distritos: Irauçuba (sede), Juá, Missi, Boa Vista do Caxitoré, Coité e Campinas. A economia do município é baseada na agricultura, indústria e artesanato. Entre os principais eventos festivos do município, podem-se destacar a Festa de Emancipação Política de Irauçuba (20 de maio) e a Festa do Padroeiro São Luiz Gonzaga (21 de junho).',
    '1466.412',
    'norte: Miraíma; sul: Santa Quitéria e Canindé; leste: Itapajé e Tejuçuoca; oeste: Sobral.',
    '24156',
    '2020-05-20',
    'Noroeste',
    'Sobral',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Itapipoca',
    'itapipoca',
    'Cidade dos Três Climas',
    'Itapipoca é um município brasileiro localizado no estado do Ceará, distante 130 km da capital. É conhecida como "cidade dos três climas", por haver em seu território praias, serras e o sertão. O município é dividido em doze distritos: Itapipoca (sede), Arapari, Assunção, Baleia, Barrento, Bela Vista, Calugi, Cruxati, Deserto, Ipu Mazagão, Lagoa das Mercês e Marinheiros. O litoral de Itapipoca é formado por 25 quilômetros de praias, sendo as principais: a Praia da Baleia e Praia do Maceió, além da Barra do Rio Mundaú e as lagoas de Humaitá e do Mato. A Trilha da Bica da Canoa, na Serra de Arapari, e a Pedra de Itacoatiara fazem parte da prática do ecoturismo, com disponibilidade para esportes radicais, como rapel e voo livre. Itapipoca possui ainda um grande patrimônio natural arqueológico e paleontológico, tanques fossilíferos e grutas com inscrições rupestres, onde foram encontrados fósseis que comprovam a existência de animais da megafauna. O Museu da Pré-história, com o seu acervo de fósseis, além dos sítios paleontológicos e arqueológicos como o monólito da Pedra Ferrada, na localidade de Mucambo, também conferem uma excelente opção de turismo.',
    '1613.913',
    'norte: Oceano Atlântico; ao sul: Itapajé e Uruburetama; ao leste: Trairi e Tururu; à oeste: Miraíma e Amontada.',
    '129358',
    '2020-08-31',
    'Norte Cearense',
    'Itapipoca',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

INSERT INTO `cidades` (`nome`, `nomecru`, `apelido`, `resumo`, `area`, `limite`, `populacao`, `aniversario`, `mesorregiao`, `microrregiao`, `data_registro`, `updatedAt`)
VALUES (
    'Jati',
    'jati',
    NULL,
    'Jati é uma cidade cearense que fica distante 525 km de Fortaleza, capital do estado.',
    '368.359',
    'norte: Porteiras e Brejo Santo; sul: Penaforte e São José do Belmonte (PE); leste: Brejo Santo; oeste: Jardim.',
    '8111',
    '2020-11-22',
    'Sul',
    'Brejo Santo',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `resumo` = VALUES(`resumo`),
    `apelido` = VALUES(`apelido`),
    `area` = VALUES(`area`),
    `limite` = VALUES(`limite`),
    `populacao` = VALUES(`populacao`),
    `aniversario` = VALUES(`aniversario`),
    `mesorregiao` = VALUES(`mesorregiao`),
    `microrregiao` = VALUES(`microrregiao`),
    `updatedAt` = NOW();

