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

// Campo utilizado para pesquisar  filmes e séries pelo título.

const campoBusca = document.getElementById("busca-titulo");

/*
    Botões utilizados para filtrar
    os conteúdos da Minha Lista.
*/
const btnFiltroTodos =
    document.getElementById("filtro-todos");

const btnFiltroFilmes =
    document.getElementById("filtro-filmes");

const btnFiltroSeries =
    document.getElementById("filtro-series");


/*
    Elementos que exibem as quantidades
    de conteúdos em cada filtro.
*/
const contadorTodos =
    document.getElementById("contador-todos");

const contadorFilmes =
    document.getElementById("contador-filmes");

const contadorSeries =
    document.getElementById("contador-series");

// Botão principal do formulário.
const btnSalvar = document.querySelector(".btn-salvar");

/*
    Elemento do Dashboard responsável
    por exibir o total de conteúdos cadastrados.
*/
const dashboardTotal =
    document.getElementById("dashboard-total");

/*
    Elemento do Dashboard responsável
    por exibir o total de filmes cadastrados.
*/
const dashboardFilmes =
    document.getElementById("dashboard-filmes");

/*
    Elemento do Dashboard responsável
    por exibir o total de séries cadastradas.
*/
const dashboardSeries =
    document.getElementById("dashboard-series");

/*
    Elemento do Dashboard responsável
    por exibir a soma dos episódios
    das séries cadastradas.
*/
const dashboardEpisodios =
    document.getElementById("dashboard-episodios");
/*
    Canvas utilizado pelo Chart.js
    para desenhar o gráfico Filmes x Séries.
*/
const graficoFilmesSeriesCanvas =
    document.getElementById("grafico-filmes-series");
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

/*
    Controla qual filtro da Minha Lista
    está selecionado.

    Começamos com "todos" para mostrar
    filmes e séries juntos.
*/
let filtroTipo = "todos";

/*
    Guarda a instância do gráfico Filmes x Séries.

    Começa como null porque, quando a página
    acaba de abrir, o gráfico ainda não existe.
*/
let graficoFilmesSeries = null;



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
// CONTADORES DA MINHA LISTA
// -----------------------------------------------------

function atualizarContadores() {

    /*
        O total é simplesmente a quantidade
        de elementos existentes no array.
    */
    const totalConteudos =
        listaConteudos.length;


    /*
        filter() cria temporariamente uma lista
        apenas com os conteúdos do tipo "filme".

        length informa quantos existem.
    */
    const totalFilmes =
        listaConteudos.filter(function (conteudo) {

            return conteudo.tipo === "filme";

        }).length;


    /*
        Fazemos a mesma coisa para as séries.
    */
    const totalSeries =
        listaConteudos.filter(function (conteudo) {

            return conteudo.tipo === "serie";

        }).length;


    /*
        Atualizamos os números exibidos
        dentro dos três botões.
    */
    contadorTodos.textContent =
        totalConteudos;

    contadorFilmes.textContent =
        totalFilmes;

    contadorSeries.textContent =
        totalSeries;
}

// -----------------------------------------------------
// DASHBOARD
// -----------------------------------------------------

// -----------------------------------------------------
// DASHBOARD
// -----------------------------------------------------

/*
    Atualiza os primeiros indicadores
    exibidos no Dashboard.
*/
// -----------------------------------------------------
// DASHBOARD
// -----------------------------------------------------

/*
    Atualiza os indicadores
    exibidos no Dashboard.
*/
// -----------------------------------------------------
// DASHBOARD
// -----------------------------------------------------

/*
    Atualiza os indicadores
    exibidos no Dashboard.
*/
function atualizarDashboard() {

    /*
        Total geral de conteúdos cadastrados.
    */
    const totalConteudos =
        listaConteudos.length;


    /*
        Conta apenas os conteúdos
        cujo tipo é "filme".
    */
    const totalFilmes =
        listaConteudos.filter(function (conteudo) {

            return conteudo.tipo === "filme";

        }).length;


    /*
        Conta apenas os conteúdos
        cujo tipo é "serie".
    */
    const totalSeries =
        listaConteudos.filter(function (conteudo) {

            return conteudo.tipo === "serie";

        }).length;


    /*
        Começamos a soma dos episódios em zero.

        Depois vamos percorrer todas as séries
        e acrescentar seus episódios a esse valor.
    */
    let totalEpisodios = 0;


    /*
        Percorre todos os conteúdos cadastrados.
    */
    listaConteudos.forEach(function (conteudo) {

        /*
            Apenas as séries possuem
            número de episódios.
        */
        if (conteudo.tipo === "serie") {

            /*
                Soma os episódios desta série
                ao total já calculado.

                Number() garante que o valor seja
                tratado como número.

                || 0 evita problemas caso algum
                cadastro antigo não tenha episódios.
            */
            totalEpisodios +=
                Number(conteudo.episodios) || 0;

        }
  
        });


    /*
        Atualiza o card de Conteúdos.
    */
    dashboardTotal.textContent =
        totalConteudos;


    /*
        Atualiza o card de Filmes.
    */
    dashboardFilmes.textContent =
        totalFilmes;


    /*
        Atualiza o card de Séries.
    */
    dashboardSeries.textContent =
        totalSeries;


    /*
        Atualiza o card de Episódios.
    */
    dashboardEpisodios.textContent =
        totalEpisodios;
}

function atualizarGraficoFilmesSeries() {


    const totalFilmes =
        listaConteudos.filter(function (conteudo) {

            return conteudo.tipo === "filme";

        }).length;


    /*
        Conta quantos conteúdos cadastrados
        são do tipo "serie".
    */
    const totalSeries =
        listaConteudos.filter(function (conteudo) {

            return conteudo.tipo === "serie";

        }).length;

        /*
    Se o gráfico já existe,
    não criamos outro.

    Apenas substituímos os valores
    pelos números atuais da lista.
*/
if (graficoFilmesSeries !== null) {

    /*
        Atualiza os dados:
        posição 0 = Filmes
        posição 1 = Séries
    */
    graficoFilmesSeries.data.datasets[0].data = [
        totalFilmes,
        totalSeries
    ];


    /*
        Pede ao Chart.js para redesenhar
        o gráfico com os novos valores.
    */
    graficoFilmesSeries.update();


    /*
        Como o gráfico já foi atualizado,
        encerramos a função aqui.
    */
    return;
}

    /*
        new Chart() cria um novo gráfico.

        O primeiro argumento informa
        em qual canvas ele será desenhado.
    */
    /*
    Como ainda não existe gráfico,
    criamos um e guardamos sua referência.
*/
        graficoFilmesSeries = new Chart(
            graficoFilmesSeriesCanvas,

        /*
            O segundo argumento é a configuração
            completa do gráfico.
        */
        {

            /*
                "doughnut" cria um gráfico
                em formato de rosca.
            */
            type: "doughnut",


            /*
                Aqui ficam os dados
                que o gráfico vai representar.
            */
            data: {

                /*
                    Nomes das duas categorias.
                */
                labels: [
                    "Filmes",
                    "Séries"
                ],


                /*
                    datasets são os valores
                    que serão desenhados.
                */
                datasets: [
                    {

                      /*
                    Agora o gráfico utiliza os valores
                    calculados diretamente a partir
                    da lista de conteúdos.
                    */
                    data: [
                        totalFilmes,
                        totalSeries
                    ],


                        /*
                            Cores das duas partes
                            do gráfico.
                        */
                        backgroundColor: [
                            "#8f2cff",
                            "#c985ff"
                        ],


                        /*
                            Cor da borda das partes.
                        */
                        borderColor: [
                            "#b95cff",
                            "#e0b6ff"
                        ],

                        borderWidth: 1
                    }
                ]
            },


            /*
                Opções de aparência
                e comportamento do gráfico.
            */
            options: {

                /*
                    Faz o gráfico se adaptar
                    ao tamanho do container.
                */
                responsive: true,


                /*
                    Permite que o gráfico utilize
                    a altura que definimos no CSS.
                */
                maintainAspectRatio: false,


                /*
                    Define o tamanho do buraco
                    central da rosca.
                */
                cutout: "65%",


                /*
                    Configurações dos elementos
                    extras do gráfico.
                */
                plugins: {

                    /*
                        Configura a legenda.
                    */
                    legend: {

                        /*
                            Coloca Filmes e Séries
                            abaixo do gráfico.
                        */
                        position: "bottom",

                        labels: {

                            /*
                                Cor do texto da legenda
                                para combinar com o site escuro.
                            */
                            color: "#ffffff"
                        }
                    }
                }
            }
        }
    );
}
 



// -----------------------------------------------------
// DADOS DO GRÁFICO: CONTEÚDOS POR STREAMING
// -----------------------------------------------------

/*
    Conta quantos conteúdos cadastrados
    existem em cada plataforma de streaming.
*/
function contarConteudosPorStreaming() {

    /*
        Criamos um objeto vazio.

        Nele vamos armazenar algo como:

        {
            "Netflix": 2,
            "Disney+": 3,
            "HBO Max": 4
        }
    */
    const contagemStreamings = {};


    /*
        Percorre todos os filmes e séries
        cadastrados na CineLista.
    */
    listaConteudos.forEach(function (conteudo) {

        /*
            Recupera o streaming deste conteúdo.
        */
        /*
    Recupera o streaming deste conteúdo.

    trim() remove possíveis espaços extras
    no início ou no final do texto.
*/
let streaming = conteudo.streaming.trim();


/*
    Alguns conteúdos antigos foram cadastrados
    antes da padronização do campo de streaming.

    Para o Dashboard, tratamos esses nomes antigos
    como a plataforma atualmente utilizada.
*/
if (
    streaming === "HBO +" ||
    streaming === "HBO+"
) {

    streaming = "HBO Max";
}


        /*
            Se esse streaming já apareceu antes,
            aumentamos sua quantidade em 1.
        */
        if (contagemStreamings[streaming]) {

            contagemStreamings[streaming]++;

        } else {

            /*
                Se for a primeira vez que encontramos
                esse streaming, começamos a contagem em 1.
            */
            contagemStreamings[streaming] = 1;

        }

    });


    /*
        Devolve o objeto pronto para ser
        utilizado posteriormente pelo gráfico.
    */
    return contagemStreamings;
}


// -----------------------------------------------------
// PREPARAÇÃO DOS DADOS DO GRÁFICO DE STREAMING
// -----------------------------------------------------

/*
    Transforma a contagem dos streamings
    em duas listas:

    1. nomes das plataformas;
    2. quantidades de conteúdos.

    Esse é o formato que utilizaremos
    posteriormente no Chart.js.
*/
function prepararDadosGraficoStreaming() {

    /*
        Primeiro recuperamos o objeto produzido
        pela função contarConteudosPorStreaming().
    */
    const contagemStreamings =
        contarConteudosPorStreaming();


    /*
        Object.keys() recupera os nomes
        das propriedades do objeto.

        Exemplo:

        {
            "Disney+": 2,
            "HBO Max": 3
        }

        vira:

        ["Disney+", "HBO Max"]
    */
    const labels =
        Object.keys(contagemStreamings);


    /*
        Object.values() recupera os valores
        correspondentes às propriedades.

        No mesmo exemplo:

        [2, 3]
    */
    const dados =
        Object.values(contagemStreamings);


    /*
        Devolvemos as duas informações juntas
        para podermos utilizá-las no gráfico.
    */
    return {
        labels: labels,
        dados: dados
    };
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

/*
    Cria o gráfico de teste
    quando a página é carregada.
*/





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

  // Exibe os campos específicos de séries.
camposDuracao.innerHTML = `

    <!-- Número de temporadas -->
    <div class="campo">

        <label for="temporadas">
            Temporadas
        </label>

        <input
            type="number"
            id="temporadas"
            min="1"
            placeholder="Ex.: 5"
            required
        >

    </div>


    <!-- Número total de episódios -->
    <div class="campo campo-episodios">

        <label for="episodios">
            Episódios
        </label>

        <input
            type="number"
            id="episodios"
            min="1"
            placeholder="Ex.: 62"
            required
        >

    </div>


    <!-- Situação atual da série -->
    <div class="campo campo-status-serie">

        <label for="status-serie">
            Status da série
        </label>

        <select
            id="status-serie"
            required
        >

            <!-- Opção inicial sem valor -->
            <option value="" disabled selected>
                Selecione o status
            </option>

            <option value="Em andamento">
                Em andamento
            </option>

            <option value="Encerrada">
                Encerrada
            </option>

        </select>

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
// EVENTO DE BUSCA
// -----------------------------------------------------

/*
    Sempre que o usuário digitar ou apagar
    alguma coisa no campo de busca,
    a lista será atualizada.
*/
campoBusca.addEventListener("input", function () {

    renderizarLista();

});

// -----------------------------------------------------
// FILTROS: TODOS / FILMES / SÉRIES
// -----------------------------------------------------


/*
    Remove a classe "ativo" dos três botões.

    Essa função será usada antes de marcar
    qual botão acabou de ser selecionado.
*/
function limparFiltroAtivo() {

    btnFiltroTodos.classList.remove("ativo");

    btnFiltroFilmes.classList.remove("ativo");

    btnFiltroSeries.classList.remove("ativo");

}


/*
    FILTRO: TODOS
*/
btnFiltroTodos.addEventListener("click", function () {

    // Define que queremos mostrar todos os conteúdos.
    filtroTipo = "todos";

    // Remove o destaque dos outros botões.
    limparFiltroAtivo();

    // Destaca o botão Todos.
    btnFiltroTodos.classList.add("ativo");

    // Atualiza os cards exibidos.
    renderizarLista();

});


/*
    FILTRO: FILMES
*/
btnFiltroFilmes.addEventListener("click", function () {

    // Define que queremos mostrar somente filmes.
    filtroTipo = "filme";

    // Remove o destaque dos outros botões.
    limparFiltroAtivo();

    // Destaca o botão Filmes.
    btnFiltroFilmes.classList.add("ativo");

    // Atualiza os cards exibidos.
    renderizarLista();

});


/*
    FILTRO: SÉRIES
*/
btnFiltroSeries.addEventListener("click", function () {

    // Define que queremos mostrar somente séries.
    filtroTipo = "serie";

    // Remove o destaque dos outros botões.
    limparFiltroAtivo();

    // Destaca o botão Séries.
    btnFiltroSeries.classList.add("ativo");

    // Atualiza os cards exibidos.
    renderizarLista();

});

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
    Atualiza os números dos filtros sempre
    que a lista for renderizada.
    */
    atualizarContadores();

    /*
    Atualiza o total exibido
    no Dashboard.
    */
    /*
    Atualiza os indicadores
    exibidos no Dashboard.
    */
    atualizarDashboard();

    /*
    Atualiza também o gráfico
    Filmes x Séries.
    */
    atualizarGraficoFilmesSeries();

    // -----------------------------------------------------
// FILTRO DA BUSCA
// -----------------------------------------------------

/*
    Recupera o que o usuário digitou.

    trim() remove espaços desnecessários
    no começo e no final.

    toLowerCase() transforma tudo em minúsculas
    para a pesquisa não diferenciar maiúsculas
    de minúsculas.
*/
const termoBusca =
    campoBusca.value.trim().toLowerCase();


/*
    Criamos uma lista temporária apenas com
    os conteúdos que correspondem à pesquisa.

    Também preservamos o índice original de cada item,
    porque os botões Editar e Excluir dependem dele.
*/
/*
    Criamos uma lista temporária contendo
    apenas os conteúdos que atendem:

    1. ao texto digitado na busca;
    2. ao filtro Todos / Filmes / Séries.

    Também preservamos o índice original,
    pois Editar e Excluir dependem dele.
*/
const conteudosFiltrados = listaConteudos
    .map(function (conteudo, indiceOriginal) {

        return {
            conteudo: conteudo,
            indiceOriginal: indiceOriginal
        };

    })
    .filter(function (item) {

        /*
            Verifica se o título contém
            aquilo que foi digitado na busca.
        */
        const correspondeBusca =
            item.conteudo.titulo
                .toLowerCase()
                .includes(termoBusca);


        /*
            Por padrão consideramos que
            o conteúdo corresponde ao filtro.
        */
        let correspondeTipo = true;


        /*
            Se o filtro selecionado for "filme",
            somente conteúdos do tipo filme passam.
        */
        if (filtroTipo === "filme") {

            correspondeTipo =
                item.conteudo.tipo === "filme";

        }


        /*
            Se o filtro selecionado for "serie",
            somente conteúdos do tipo série passam.
        */
        if (filtroTipo === "serie") {

            correspondeTipo =
                item.conteudo.tipo === "serie";

        }


        /*
            O item só aparece se atender
            à busca E ao filtro de tipo.
        */
        return correspondeBusca && correspondeTipo;

    });

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
    Se existem conteúdos cadastrados,
    mas nenhum corresponde à pesquisa,
    mostramos outra mensagem.
*/
    if (conteudosFiltrados.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.classList.add("lista-vazia");

        mensagem.textContent =
            "Nenhum título encontrado.";

        listaConteudosHTML.appendChild(mensagem);

    return;
}


    /*
        Percorre todos os objetos armazenados
        dentro do array listaConteudos.
    */
        /*
    Percorre somente os conteúdos que
    passaram pelo filtro da busca.
*/
        conteudosFiltrados.forEach(function (item) {

    /*
        Recuperamos o conteúdo e também
        sua posição original no array.
    */
        const conteudo = item.conteudo;

        const indice = item.indiceOriginal; 

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
        "Lançamento: " + formatarData(conteudo.lancamento);


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
// STATUS DA SÉRIE
// -------------------------------------------------

// Cria o elemento que poderá exibir o status.
const statusSerie = document.createElement("p");

/*
    O status só deve aparecer nos cards
    que representam séries.
*/
if (conteudo.tipo === "serie") {

    statusSerie.textContent =
        "Status: " + conteudo.statusSerie;
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

        // Recupera também o status que estava salvo.
        document.getElementById("status-serie").value =
         conteudo.statusSerie;    
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

        // O status existe apenas para séries.
        if (conteudo.tipo === "serie") {
        card.appendChild(statusSerie);
        }

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

        // Recupera o status atual da série.
        conteudo.statusSerie =
        document.getElementById("status-serie").value;
    }


// -------------------------------------------------
// ARMAZENAMENTO TEMPORÁRIO
// -------------------------------------------------

/*
    O método push() adiciona o novo objeto
    ao final do array listaConteudos.
*/
/*
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


// -----------------------------------------------------
// FORMATAÇÃO DE DATA
// -----------------------------------------------------

/*
    Recebe uma data no formato padrão do input date:
    AAAA-MM-DD

    E devolve no formato brasileiro:
    DD/MM/AAAA
*/
function formatarData(data) {

    /*
        Se não existir uma data,
        devolvemos uma string vazia.
    */
    if (!data) {
        return "";
    }

    /*
        Separamos a data usando o hífen.

        Exemplo:
        "2022-09-02"

        vira:

        ano = "2022"
        mes = "09"
        dia = "02"
    */
    const [ano, mes, dia] = data.split("-");

    /*
        Retorna a data no formato brasileiro.
    */
    return `${dia}/${mes}/${ano}`;
}