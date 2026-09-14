// =====================================================
// CINE LISTA
// Controle inicial do formulário de filmes e séries
// =====================================================


// -----------------------------------------------------
// 1. SELEÇÃO DOS ELEMENTOS DO HTML
// -----------------------------------------------------

// Botão utilizado para selecionar o cadastro de filmes.
const btnFilmes = document.getElementById("btn-filmes");

// Botão utilizado para selecionar o cadastro de séries.
const btnSeries = document.getElementById("btn-series");

// Área do formulário que muda conforme o tipo selecionado.
const camposDuracao = document.getElementById("campos-duracao");

// Formulário principal de cadastro.
const formulario = document.getElementById("formulario-cadastro");

// Área do HTML onde os filmes e séries cadastrados serão exibidos.
const listaConteudosHTML = document.getElementById("lista-conteudos");

// -----------------------------------------------------
// TIPO DE CONTEÚDO SELECIONADO
// -----------------------------------------------------

// A página começa com "Filmes" selecionado.
let tipoSelecionado = "filme";

// -----------------------------------------------------
// LISTA TEMPORÁRIA DE CONTEÚDOS
// -----------------------------------------------------

/*
    Este array armazenará todos os filmes e séries
    cadastrados enquanto a página estiver aberta.

    Por enquanto, os dados são temporários.
    Se a página for atualizada, o array será esvaziado.

    Mais adiante utilizaremos localStorage para
    manter os dados salvos no navegador.
*/
/*
    Tenta recuperar do navegador uma lista
    que já tenha sido salva anteriormente.

    localStorage.getItem() recupera os dados salvos.

    JSON.parse() transforma o texto salvo novamente
    em um array JavaScript.

    Se ainda não existir nada salvo, usamos [].
*/
const listaConteudos =
    JSON.parse(localStorage.getItem("cinelistaConteudos")) || [];

// -----------------------------------------------------
// SALVAMENTO NO LOCALSTORAGE
// -----------------------------------------------------

/*
    Esta função será responsável por salvar
    a lista de filmes e séries no navegador.
*/
function salvarLista() {

    /*
        O localStorage só consegue armazenar texto.

        Por isso usamos JSON.stringify() para
        transformar o array listaConteudos em texto.
    */
    localStorage.setItem(
        "cinelistaConteudos",
        JSON.stringify(listaConteudos)
    );
}


// -----------------------------------------------------
// 2. EXIBIÇÃO DOS CAMPOS DE FILME
// -----------------------------------------------------

function mostrarCamposFilme() {

    // Registra que o tipo atualmente selecionado é filme.
    tipoSelecionado = "filme";

    // Destaca visualmente o botão Filmes.
    btnFilmes.classList.add("ativo");

    // Remove o destaque do botão Séries.
    btnSeries.classList.remove("ativo");

    // Insere o campo específico de duração do filme.
    camposDuracao.innerHTML = `
        <div class="campo">

            <label for="duracao">Duração</label>

            <input
                type="number"
                id="duracao"
                min="1"
                placeholder="Ex.: 120"
                required
            >

        </div>
    `;
}


// -----------------------------------------------------
// 3. EXIBIÇÃO DOS CAMPOS DE SÉRIE
// -----------------------------------------------------

function mostrarCamposSerie() {

    // Registra que o usuário selecionou série.
    tipoSelecionado = "serie";

    // Destaca visualmente o botão Séries.
    btnSeries.classList.add("ativo");

    // Remove o destaque do botão Filmes.
    btnFilmes.classList.remove("ativo");

    // Insere os campos específicos de séries.
    camposDuracao.innerHTML = `
        <div class="campo">

            <label for="temporadas">Temporadas</label>

            <input
                type="number"
                id="temporadas"
                min="1"
                placeholder="Ex.: 5"
                required
            >

        </div>

        <div class="campo campo-episodios">

            <label for="episodios">Episódios</label>

            <input
                type="number"
                id="episodios"
                min="1"
                placeholder="Ex.: 62"
                required
            >

        </div>
    `;
}


// -----------------------------------------------------
// 4. EVENTOS DOS BOTÕES FILMES / SÉRIES
// -----------------------------------------------------

// Executa a função de filme quando o botão Filmes for clicado.
btnFilmes.addEventListener("click", mostrarCamposFilme);

// Executa a função de série quando o botão Séries for clicado.
btnSeries.addEventListener("click", mostrarCamposSerie);


// -----------------------------------------------------
// 5. VALIDAÇÃO E CAPTURA DOS DADOS
// -----------------------------------------------------

// -----------------------------------------------------
// EXIBIÇÃO DOS CONTEÚDOS NA PÁGINA
// -----------------------------------------------------

function renderizarLista() {

    /*
        Antes de desenhar a lista novamente,
        apagamos o conteúdo que já estava dentro dela.

        Isso evita que os cards sejam duplicados.
    */
    listaConteudosHTML.innerHTML = "";


    /*
        Se o array estiver vazio, mostramos
        uma mensagem informando que ainda
        não existe nenhum cadastro.
    */
    if (listaConteudos.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.classList.add("lista-vazia");

        mensagem.textContent =
            "Nenhum filme ou série cadastrado ainda.";

        listaConteudosHTML.appendChild(mensagem);

        return;
    }


    /*
        Percorre todos os objetos armazenados
        dentro do array listaConteudos.
    */
    listaConteudos.forEach(function (conteudo) {

        // Cria um elemento <article> para representar o card.
        const card = document.createElement("article");

        // Adiciona uma classe para podermos estilizar depois.
        card.classList.add("card-conteudo");


        // -------------------------------------------------
        // TIPO DO CONTEÚDO
        // -------------------------------------------------

        const tipo = document.createElement("p");

        // Adiciona uma classe para estilizar a etiqueta "Filme" ou "Série".
        tipo.classList.add("tipo-card");
        /*
            Se o tipo for "filme", mostra "Filme".
            Caso contrário, mostra "Série".
        */
        tipo.textContent =
            conteudo.tipo === "filme"
                ? "Filme"
                : "Série";


        // -------------------------------------------------
        // TÍTULO
        // -------------------------------------------------

        const titulo = document.createElement("h3");

        titulo.textContent = conteudo.titulo;


        // -------------------------------------------------
        // GÊNERO
        // -------------------------------------------------

        const genero = document.createElement("p");

        genero.textContent =
            "Gênero: " + conteudo.genero;


        // -------------------------------------------------
        // STREAMING
        // -------------------------------------------------

        const streaming = document.createElement("p");

        streaming.textContent =
            "Streaming: " + conteudo.streaming;


        // -------------------------------------------------
        // DATA DE LANÇAMENTO
        // -------------------------------------------------

        const lancamento = document.createElement("p");

        lancamento.textContent =
            "Lançamento: " + conteudo.lancamento;


        // -------------------------------------------------
        // DIRETOR
        // -------------------------------------------------

        const diretor = document.createElement("p");

        diretor.textContent =
            "Diretor: " + conteudo.diretor;


        // -------------------------------------------------
        // DURAÇÃO / TEMPORADAS / EPISÓDIOS
        // -------------------------------------------------

        const detalhes = document.createElement("p");

        if (conteudo.tipo === "filme") {

            detalhes.textContent =
                "Duração: " + conteudo.duracao + " min";

        } else {

            detalhes.textContent =
                conteudo.temporadas +
                " temporada(s) • " +
                conteudo.episodios +
                " episódio(s)";
        }


        // -------------------------------------------------
        // MONTAGEM DO CARD
        // -------------------------------------------------

        /*
            Agora colocamos todos os elementos
            que criamos dentro do card.
        */
        card.appendChild(tipo);
        card.appendChild(titulo);
        card.appendChild(genero);
        card.appendChild(detalhes);
        card.appendChild(streaming);
        card.appendChild(lancamento);
        card.appendChild(diretor);


        /*
            Por último, colocamos o card
            dentro da seção "Minha Lista".
        */
        listaConteudosHTML.appendChild(card);
    });
}

formulario.addEventListener("submit", function (event) {

    // Impede que a página seja recarregada após o envio.
    event.preventDefault();


    // -------------------------------------------------
    // VALIDAÇÃO
    // -------------------------------------------------

    // Verifica se todos os campos obrigatórios estão válidos.
    if (!formulario.checkValidity()) {

        // Mostra ao usuário o campo que precisa ser corrigido.
        formulario.reportValidity();

        // Interrompe a execução da função.
        return;
    }


    // -------------------------------------------------
    // CAPTURA DOS CAMPOS COMUNS
    // -------------------------------------------------

    // Recupera o valor digitado no título.
    const titulo = document.getElementById("titulo").value;

    // Recupera o gênero.
    const genero = document.getElementById("genero").value;

    // Recupera a plataforma de streaming.
    const streaming = document.getElementById("streaming").value;

    // Recupera a data de lançamento.
    const lancamento = document.getElementById("lancamento").value;

    // Recupera o nome do diretor.
    const diretor = document.getElementById("diretor").value;


    // -------------------------------------------------
    // CRIAÇÃO DO OBJETO
    // -------------------------------------------------

    /*
        Criamos um objeto para representar
        o conteúdo cadastrado.

        Neste momento ele contém apenas os campos
        comuns a filmes e séries.
    */
    const conteudo = {
        tipo: tipoSelecionado,
        titulo: titulo,
        genero: genero,
        streaming: streaming,
        lancamento: lancamento,
        diretor: diretor
    };


    // -------------------------------------------------
    // CAMPOS ESPECÍFICOS
    // -------------------------------------------------

    if (tipoSelecionado === "filme") {

        // Recupera a duração e converte o valor para número.
        conteudo.duracao = Number(
            document.getElementById("duracao").value
        );

    } else {

        // Recupera o número de temporadas.
        conteudo.temporadas = Number(
            document.getElementById("temporadas").value
        );

        // Recupera o número de episódios.
        conteudo.episodios = Number(
            document.getElementById("episodios").value
        );
    }


// -------------------------------------------------
// ARMAZENAMENTO TEMPORÁRIO
// -------------------------------------------------

/*
    O método push() adiciona o novo objeto
    ao final do array listaConteudos.
*/
listaConteudos.push(conteudo);

// Salva a lista atualizada no navegador.
salvarLista();

// Atualiza visualmente a seção "Minha Lista".
renderizarLista();


// -------------------------------------------------
// TESTES NO CONSOLE
// -------------------------------------------------

// Mostra apenas o conteúdo que acabou de ser cadastrado.
console.log("Conteúdo cadastrado:");
console.log(conteudo);


// Mostra todos os conteúdos cadastrados até o momento.
console.log("Lista atual:");
console.log(listaConteudos);
});

// -----------------------------------------------------
// CARREGAMENTO INICIAL DA LISTA
// -----------------------------------------------------

/*
    Quando a página é aberta ou atualizada,
    esta função exibe os conteúdos que já foram
    recuperados do localStorage.
*/
renderizarLista();