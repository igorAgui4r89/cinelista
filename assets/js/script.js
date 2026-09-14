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

// Botão principal do formulário.
const btnSalvar = document.querySelector(".btn-salvar");

// -----------------------------------------------------
// TIPO DE CONTEÚDO SELECIONADO
// -----------------------------------------------------

// A página começa com "Filmes" selecionado.
let tipoSelecionado = "filme";

/*
    Guarda a posição do conteúdo que está sendo editado.

    Quando o valor for null, significa que estamos
    fazendo um novo cadastro.

    Quando houver um número, significa que estamos
    editando um item que já existe no array.
*/
let indiceEmEdicao = null;



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
// EXCLUSÃO DE CONTEÚDO
// -----------------------------------------------------

/*
    Esta função recebe a posição do conteúdo
    dentro do array e remove esse item.
*/
function excluirConteudo(indice) {

    /*
        Antes de excluir, pedimos uma confirmação
        para evitar remoções acidentais.
    */
    const confirmarExclusao = confirm(
        "Deseja realmente excluir este conteúdo?"
    );


    /*
        Se o usuário clicar em "Cancelar",
        interrompemos a função.
    */
    if (!confirmarExclusao) {
        return;
    }


    /*
        splice() remove elementos de um array.

        O primeiro valor indica a posição inicial.
        O segundo indica quantos elementos serão removidos.

        Portanto:
        splice(indice, 1)

        significa:
        "remova 1 item a partir desta posição".
    */
    listaConteudos.splice(indice, 1);


    // Atualiza os dados armazenados no navegador.
    salvarLista();


    // Atualiza visualmente a seção "Minha Lista".
    renderizarLista();
}

// Atualiza visualmente a seção "Minha Lista".
renderizarLista();




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
        listaConteudos.forEach(function (conteudo, indice) {    

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
// BOTÃO EDITAR
// -------------------------------------------------

// Cria um novo elemento <button>.
const btnEditar = document.createElement("button");

// Define o texto que aparecerá dentro do botão.
btnEditar.textContent = "Editar";

// Adiciona uma classe para estilizar o botão no CSS.
btnEditar.classList.add("btn-editar");

// Define que o botão não deve enviar nenhum formulário.
btnEditar.type = "button";

/*
    Quando o usuário clicar no botão Editar,
    chamamos a função editarConteudo().

    O "indice" informa qual item da lista
    foi escolhido pelo usuário.
*/
btnEditar.addEventListener("click", function () {

    editarConteudo(indice);

});




// -------------------------------------------------
// BOTÃO EXCLUIR
// -------------------------------------------------

// Cria o botão de exclusão.
const btnExcluir = document.createElement("button");

// Texto exibido no botão.
btnExcluir.textContent = "Excluir";

// Classe utilizada para estilizar o botão no CSS.
btnExcluir.classList.add("btn-excluir");

// Define que este botão não envia formulários.
btnExcluir.type = "button";


/*
    Quando o usuário clicar no botão,
    chamamos a função excluirConteudo()
    passando a posição deste conteúdo no array.
*/
btnExcluir.addEventListener("click", function () {

    excluirConteudo(indice);

});




// -----------------------------------------------------
// EDIÇÃO DE CONTEÚDO
// -----------------------------------------------------

function editarConteudo(indice) {

    /*
        Recupera do array o conteúdo correspondente
        ao card em que o usuário clicou.
    */
    const conteudo = listaConteudos[indice];


    /*
        Guarda o índice para sabermos, no momento
        de salvar, que não é um novo cadastro.
    */
    indiceEmEdicao = indice;


    // -------------------------------------------------
    // DEFINE SE É FILME OU SÉRIE
    // -------------------------------------------------

    if (conteudo.tipo === "filme") {

        /*
            Mostra o campo de duração
            e ativa visualmente a aba Filmes.
        */
        mostrarCamposFilme();

    } else {

        /*
            Mostra os campos de temporadas e episódios
            e ativa visualmente a aba Séries.
        */
        mostrarCamposSerie();
    }


    // -------------------------------------------------
    // PREENCHE OS CAMPOS COM OS DADOS EXISTENTES
    // -------------------------------------------------

    document.getElementById("titulo").value =
        conteudo.titulo;

    document.getElementById("genero").value =
        conteudo.genero;

    document.getElementById("streaming").value =
        conteudo.streaming;

    document.getElementById("lancamento").value =
        conteudo.lancamento;

    document.getElementById("diretor").value =
        conteudo.diretor;


    // Campos específicos de filme ou série.
    if (conteudo.tipo === "filme") {

        document.getElementById("duracao").value =
            conteudo.duracao;

    } else {

        document.getElementById("temporadas").value =
            conteudo.temporadas;

        document.getElementById("episodios").value =
            conteudo.episodios;
    }


    /*
        Muda o texto do botão para deixar claro
        que estamos atualizando um cadastro existente.
    */
    btnSalvar.textContent = "Atualizar";


    /*
        Leva o usuário de volta ao formulário.
    */
    document
        .getElementById("cadastro")
        .scrollIntoView({
            behavior: "smooth"
        });
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

        // Coloca o botão Editar dentro do card.
        card.appendChild(btnEditar);

        // Coloca o botão Excluir depois dele.
        card.appendChild(btnExcluir);
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
listaConteudos.push(conteudo);/*
    Se indiceEmEdicao for null,
    estamos fazendo um novo cadastro.
*/
if (indiceEmEdicao === null) {

    listaConteudos.push(conteudo);

} else {

    /*
        Se houver um índice,
        substituímos o conteúdo antigo
        pelo conteúdo atualizado.
    */
    listaConteudos[indiceEmEdicao] = conteudo;


    /*
        Depois da atualização, voltamos
        ao modo normal de cadastro.
    */
    indiceEmEdicao = null;


    // O botão volta a se chamar Salvar.
    btnSalvar.textContent = "Salvar";
}

// Salva a lista atualizada no navegador.
salvarLista();
// Atualiza visualmente a seção "Minha Lista".

renderizarLista();

// -----------------------------------------------------
// LIMPEZA DO FORMULÁRIO
// -----------------------------------------------------

/*
    Limpa os campos do formulário depois que
    o conteúdo foi cadastrado com sucesso.
*/
formulario.reset();


/*
    Coloca novamente o cursor no campo Título,
    deixando o formulário pronto para um novo cadastro.
*/
document.getElementById("titulo").focus();


// -------------------------------------------------
// TESTES NO CONSOLE
// -------------------------------------------------

console.log("Conteúdo cadastrado:");
console.log(conteudo);

console.log("Lista atual:");
console.log(listaConteudos);
});
