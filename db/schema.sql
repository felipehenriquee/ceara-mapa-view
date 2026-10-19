-- =====================================================================
-- O Portal do Ceará — schema do banco de dados
-- Gerado a partir da leitura das queries usadas em __confidencialsite__/
-- (api/db.php conecta no banco "cearahoje")
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `cearahoje`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `cearahoje`;

-- ---------------------------------------------------------------------
-- Tabela: cidades
-- Usada em: pegaTodasCidades.php, pegaCidade.php, cadastrarCidade.php,
--           updateCidade.php, pesquisaCidade.php, cidadesDestaque.php
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cidades` (
    `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome`          VARCHAR(150)    NOT NULL,
    `nomecru`       VARCHAR(150)    NOT NULL COMMENT 'slug usado na URL, ex: fortaleza',
    `apelido`       VARCHAR(150)    DEFAULT NULL,
    `resumo`        TEXT,
    `area`          VARCHAR(50)     DEFAULT NULL COMMENT 'área em km²',
    `limite`        TEXT            COMMENT 'municípios limítrofes',
    `populacao`     VARCHAR(50)     DEFAULT NULL,
    `aniversario`   DATE            DEFAULT NULL,
    `mesorregiao`   VARCHAR(150)    DEFAULT NULL,
    `microrregiao`  VARCHAR(150)    DEFAULT NULL,
    `foto`          TEXT            COMMENT 'URL da imagem (Firebase Storage)',
    `data_registro` DATETIME        DEFAULT NULL,
    `updatedAt`     DATETIME        DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_cidades_nomecru` (`nomecru`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabela: noticias
-- Usada em: noticiaPrincipal.php, pegaTodasNoticias.php,
--           pegaNoticiaPorId.php, novasNoticias.php, processaNoticia.php
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `noticias` (
    `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `titulo`            VARCHAR(255)    NOT NULL,
    `tituloConvertido`  VARCHAR(255)    NOT NULL COMMENT 'slug usado na URL',
    `resumo`            TEXT,
    `conteudo`          LONGTEXT,
    `legenda`           VARCHAR(255)    DEFAULT NULL COMMENT 'legenda da foto',
    `foto`              TEXT            COMMENT 'URL da imagem (Firebase Storage)',
    `imagemFoco`        VARCHAR(20)     NOT NULL DEFAULT '50% 50%' COMMENT 'background-position / object-position do ponto focal da imagem',
    `imagemAjuste`      ENUM('cover','contain') NOT NULL DEFAULT 'cover' COMMENT 'cover = preenche o espaço cortando sobras; contain = mostra a imagem completa',
    `imagemZoom`        DECIMAL(3,2)    NOT NULL DEFAULT 1.00 COMMENT 'multiplicador de zoom aplicado sobre o enquadramento cover',
    `autor`             VARCHAR(150)    DEFAULT NULL,
    `cidade`            INT UNSIGNED    DEFAULT NULL COMMENT 'FK -> cidades.id (NULL quando abrangencia diferente de municipio)',
    `abrangencia`       ENUM('municipio','ceara','brasil') NOT NULL DEFAULT 'municipio' COMMENT 'municipio = usa a coluna cidade; ceara/brasil = notícia estadual/nacional',
    `paginaInicial`     TINYINT(1)      NOT NULL DEFAULT 0 COMMENT 'destaque na home',
    `ocultarData`       TINYINT(1)      NOT NULL DEFAULT 0 COMMENT 'se 1, esconde a data de publicação para o leitor',
    `createdAt`         DATETIME        NOT NULL,
    `updatedAt`         DATETIME        DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_noticias_cidade` (`cidade`),
    KEY `idx_noticias_createdAt` (`createdAt`),
    CONSTRAINT `fk_noticias_cidade` FOREIGN KEY (`cidade`) REFERENCES `cidades` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabela: eventos
-- Usada em: pegaTodosEventos.php, novosEventos.php, processaEvento.php
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos` (
    `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `titulo`            VARCHAR(255)    NOT NULL,
    `tituloConvertido`  VARCHAR(255)    NOT NULL COMMENT 'slug usado na URL',
    `resumo`            TEXT,
    `conteudo`          LONGTEXT,
    `foto`              TEXT            COMMENT 'URL da imagem (Firebase Storage)',
    `organizador`       VARCHAR(150)    DEFAULT NULL,
    `preco`             VARCHAR(50)     DEFAULT NULL,
    `localizacao`       VARCHAR(255)    DEFAULT NULL,
    `dataEvento`        DATE            DEFAULT NULL,
    `cidade`            INT UNSIGNED    NOT NULL COMMENT 'FK -> cidades.id',
    `createdAt`         DATETIME        NOT NULL,
    `updatedAt`         DATETIME        DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_eventos_cidade` (`cidade`),
    KEY `idx_eventos_createdAt` (`createdAt`),
    CONSTRAINT `fk_eventos_cidade` FOREIGN KEY (`cidade`) REFERENCES `cidades` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabela: usuarios
-- Usada em: logar.php, api/verifica_login.php (login do painel admin)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(100) NOT NULL,
    `senha`   CHAR(32)     NOT NULL COMMENT 'MD5 (mesmo formato usado em logar.php)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_usuarios_usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Usuário administrador padrão para acessar o painel_adm
-- login: admin / senha: admin123  (troque depois do primeiro acesso)
-- ---------------------------------------------------------------------
INSERT INTO `usuarios` (`usuario`, `senha`)
VALUES ('admin', MD5('admin123'))
ON DUPLICATE KEY UPDATE `usuario` = `usuario`;

-- ---------------------------------------------------------------------
-- Cidade de exemplo para testar o site (usada nas telas de notícias/eventos)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO `cidades` (`nome`, `nomecru`, `resumo`, `data_registro`, `updatedAt`)
VALUES ('Fortaleza', 'fortaleza', 'Capital do estado do Ceará.', NOW(), NOW());