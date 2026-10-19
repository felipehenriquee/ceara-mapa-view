// Mapa interativo do Ceará — destaque por mesorregião + busca de município
// Extraído do site "Jornal Ceará Hoje" para reuso em outros projetos.

var corBaseAtual = {};

function mudarCor(recebido) {
    var elemento = document.getElementById(recebido);
    if (!elemento) { return; }
    elemento.classList.remove(corBaseAtual[recebido] || "st18");
    elemento.classList.add("st16");
}

function voltarCor(recebido) {
    var elemento = document.getElementById(recebido);
    if (!elemento) { return; }
    elemento.classList.remove("st16");
    elemento.classList.add(corBaseAtual[recebido] || "st18");
}

// destaque de mesorregiões no mapa
var REGIOES = {
    norte:         { grupo: "Norte", excluir: "metropolitana", cor: "st1" },
    noroeste:      { grupo: "noroeste", cor: "st11" },
    metropolitana: { grupo: "metropolitana", cor: "st18" },
    jaguaribe:     { grupo: "jaguaribe", cor: "st14" },
    centroSul:     { grupo: "centro-sul", cor: "st12" },
    sul:           { grupo: "sul", cor: "st13" },
    sertoes:       { grupo: "sertoes", cor: "st15" },
    destaque:      { grupo: "Destaques", cor: "st20" }
};
var CLASSES_PINTURA = ["st1", "st11", "st12", "st13", "st14", "st15", "st16", "st18", "st20", "st-inativo"];
var regiaoAtiva = null;

function elementosDoGrupo(grupoId) {
    var grupo = document.getElementById(grupoId);
    return grupo ? Array.prototype.slice.call(grupo.querySelectorAll("polygon, path, polyline")) : [];
}

function todosOsMunicipios() {
    var todos = [];
    Object.keys(REGIOES).forEach(function (chave) {
        todos = todos.concat(elementosDoGrupo(REGIOES[chave].grupo));
    });
    var vistos = {};
    return todos.filter(function (elemento) {
        if (vistos[elemento.id]) {
            return false;
        }
        vistos[elemento.id] = true;
        return true;
    });
}

function definirCorBase(elemento, classe) {
    CLASSES_PINTURA.forEach(function (c) { elemento.classList.remove(c); });
    elemento.classList.add(classe);
    corBaseAtual[elemento.id] = classe;
}

function limparFiltroRegiao() {
    todosOsMunicipios().forEach(function (elemento) {
        definirCorBase(elemento, "st18");
    });
    document.querySelectorAll(".regiaoBtn").forEach(function (botao) {
        botao.classList.remove("ativo");
    });
    regiaoAtiva = null;
}

function aplicarFiltroRegiao(chave, botao) {
    var config = REGIOES[chave];
    if (!config) {
        return;
    }

    if (regiaoAtiva === chave) {
        limparFiltroRegiao();
        return;
    }

    todosOsMunicipios().forEach(function (elemento) {
        definirCorBase(elemento, "st-inativo");
    });

    var destacados = elementosDoGrupo(config.grupo);
    if (config.excluir) {
        var idsExcluidos = elementosDoGrupo(config.excluir).map(function (elemento) { return elemento.id; });
        destacados = destacados.filter(function (elemento) { return idsExcluidos.indexOf(elemento.id) === -1; });
    }
    destacados.forEach(function (elemento) {
        definirCorBase(elemento, config.cor);
    });

    document.querySelectorAll(".regiaoBtn").forEach(function (botao) {
        botao.classList.remove("ativo");
    });
    if (botao) {
        botao.classList.add("ativo");
    }
    regiaoAtiva = chave;
}

// busca de município, construída a partir dos próprios títulos (xlink:title) do SVG
function montarListaMunicipios() {
    var resultado = document.getElementById("resultado");
    if (!resultado) {
        return;
    }

    var links = Array.prototype.slice.call(document.querySelectorAll(".linkCidade"));
    var municipios = links.map(function (link) {
        var poligono = link.querySelector("polygon, path, polyline, rect");
        return {
            id: poligono ? poligono.id : null,
            nome: link.getAttribute("xlink:title") || link.textContent.trim(),
            href: link.getAttribute("href")
        };
    }).filter(function (municipio) {
        return municipio.id && municipio.nome;
    });

    // remove duplicados (alguns polígonos compartilham o mesmo nome/link) e ordena por nome
    var vistos = {};
    municipios = municipios.filter(function (municipio) {
        var chave = municipio.nome.toLowerCase();
        if (vistos[chave]) { return false; }
        vistos[chave] = true;
        return true;
    }).sort(function (a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); });

    var lista = document.createElement("ul");
    lista.className = "tabelaNomeCidade";

    municipios.forEach(function (municipio) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.id = municipio.id;
        link.href = municipio.href || "#";
        link.textContent = municipio.nome;
        link.addEventListener("mouseover", function () { mudarCor(municipio.id); });
        link.addEventListener("mouseout", function () { voltarCor(municipio.id); });
        item.appendChild(link);
        item.dataset.nome = municipio.nome.toLowerCase();
        lista.appendChild(item);
    });

    resultado.innerHTML = "";
    resultado.appendChild(lista);
}

function filtrarListaMunicipios(termo) {
    var termoBusca = (termo || "").trim().toLowerCase();
    document.querySelectorAll(".tabelaNomeCidade li").forEach(function (item) {
        var corresponde = !termoBusca || item.dataset.nome.indexOf(termoBusca) !== -1;
        item.classList.toggle("escondido", !corresponde);
    });
}

window.addEventListener("load", function () {
    document.querySelectorAll(".regiaoBtn").forEach(function (botao) {
        botao.addEventListener("click", function () {
            aplicarFiltroRegiao(botao.dataset.regiao, botao);
        });
    });

    montarListaMunicipios();

    var campoPesquisa = document.getElementById("pesquisa");
    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", function () {
            filtrarListaMunicipios(campoPesquisa.value);
        });
    }
});
