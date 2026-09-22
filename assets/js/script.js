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

/*
    Canvas utilizado pelo Chart.js
    para desenhar o gráfico de streamings.
*/
const graficoStreamingCanvas =
    document.getElementById("grafico-streaming"); 
    
/*
    Canvas utilizado pelo Chart.js
    para desenhar o gráfico de gêneros.
*/
const graficoGenerosCanvas =
    document.getElementById("grafico-generos");

/*
    Botão utilizado para encerrar
    a sessão do usuário.
*/
const btnSair =
    document.getElementById("btn-sair");

/*
    Área do cabeçalho onde será exibido
    o nome do usuário autenticado.
*/
const usuarioLogado =
    document.getElementById("usuario-logado");

/*
    Mensagem exibida enquanto os conteúdos
    estão sendo carregados do Supabase.
*/
const mensagemCarregamento =
    document.getElementById(
        "mensagem-carregamento"
    );

/*
    Botão utilizado para solicitar
    novas recomendações.
*/
const btnRecomendacoes =
    document.getElementById(
        "btn-recomendacoes"
    );


/*
    Área onde os filmes recomendados
    serão exibidos.
*/
const listaRecomendacoes =
    document.getElementById(
        "lista-recomendacoes"
    );














// -----------------------------------------------------
// VERIFICAÇÃO DE AUTENTICAÇÃO
// -----------------------------------------------------

/*
    Confere se existe um usuário autenticado.

    Se não existir, o usuário é enviado
    para a página de login.
*/
async function verificarUsuarioLogado() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    /*
        Se não houver sessão ativa,
        bloqueamos o acesso ao CineLista.
    */
    if (!session) {

        window.location.href =
            "login.html";

        return;
    }


    /*
        Se chegou até aqui,
        existe um usuário autenticado.
    */
    console.log(
        "Usuário autenticado:",
        session.user
    );
}


































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

/*
    Guarda a instância do gráfico de streamings.

    Começa como null porque o gráfico
    ainda não foi criado.
*/
let graficoStreaming = null;

/*
    Guarda a instância do gráfico de gêneros.

    Começa como null porque o gráfico
    ainda não foi criado.
*/
let graficoGeneros = null;



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
/*
    Array que armazenará temporariamente
    os conteúdos carregados do Supabase.

    A partir de agora, o localStorage
    deixa de ser a fonte principal dos dados.
*/
const listaConteudos = [];


// -----------------------------------------------------
// SALVAR CONTEÚDO NO SUPABASE
// -----------------------------------------------------

/*
    Salva um novo filme ou série
    na tabela "conteudos" do Supabase.
*/
async function salvarConteudoNoSupabase(conteudo) {

    /*
        O objeto usado no JavaScript possui
        o campo statusSerie.

        No banco, a coluna se chama status_serie.

        Por isso montamos um novo objeto
        com os nomes das colunas do Supabase.
    */
    const registroSupabase = {

        tipo: conteudo.tipo,

        titulo: conteudo.titulo,

        genero: conteudo.genero,

        streaming: conteudo.streaming,

        lancamento: conteudo.lancamento,

        diretor: conteudo.diretor,

        /*
            Se for filme, teremos duração.
            Se não existir, enviamos null.
        */
        duracao:
            conteudo.duracao ?? null,

        /*
            Campos específicos de séries.
        */
        temporadas:
            conteudo.temporadas ?? null,

        episodios:
            conteudo.episodios ?? null,

        status_serie:
            conteudo.statusSerie ?? null
    };


    /*
        Envia o registro para a tabela
        "conteudos" no Supabase.
    */
    /*
    Salva o conteúdo no banco.

    .select() faz o Supabase devolver
    o registro que acabou de ser criado.

    .single() informa que esperamos
    apenas um registro.
*/
const { data, error } =
    await supabaseClient
        .from("conteudos")
        .insert(registroSupabase)
        .select()
        .single();


    /*
        Se o Supabase devolver algum erro,
        mostramos no Console.
    */
    if (error) {

        console.error(
            "Erro ao salvar no Supabase:",
            error
        );

        return null;
    }


/*
    Mostra no Console o registro criado,
    agora já contendo o ID gerado pelo banco.
*/
console.log(
    "Conteúdo salvo no Supabase:",
    data
);


/*
    Devolve o registro criado.

    Isso será útil para sabermos
    qual ID o Supabase atribuiu ao conteúdo.
*/
return data;
}







// -----------------------------------------------------
// ATUALIZAR CONTEÚDO NO SUPABASE
// -----------------------------------------------------

/*
    Atualiza no banco um filme ou série
    que já existe.

    Recebemos:
    - o ID do registro no Supabase;
    - os novos dados do conteúdo.
*/
async function atualizarConteudoNoSupabase(
    idSupabase,
    conteudo
) {

    /*
        Montamos novamente o objeto usando
        os nomes das colunas existentes
        na tabela do Supabase.
    */
    const registroSupabase = {

        tipo: conteudo.tipo,

        titulo: conteudo.titulo,

        genero: conteudo.genero,

        streaming: conteudo.streaming,

        lancamento: conteudo.lancamento,

        diretor: conteudo.diretor,

        /*
            Campos específicos de filme.
        */
        duracao:
            conteudo.duracao ?? null,

        /*
            Campos específicos de série.
        */
        temporadas:
            conteudo.temporadas ?? null,

        episodios:
            conteudo.episodios ?? null,

        status_serie:
            conteudo.statusSerie ?? null
    };


    /*
        Atualiza somente o registro cujo
        ID corresponde ao conteúdo editado.
    */
    const { data, error } =
        await supabaseClient
            .from("conteudos")
            .update(registroSupabase)
            .eq(
                "id",
                idSupabase
            )
            .select()
            .single();


    /*
        Se ocorrer algum erro,
        mostramos no Console.
    */
    if (error) {

        console.error(
            "Erro ao atualizar conteúdo no Supabase:",
            error
        );

        return null;
    }


    /*
        Mostra o registro atualizado
        para facilitar nosso teste.
    */
    console.log(
        "Conteúdo atualizado no Supabase:",
        data
    );


    /*
        Devolve o registro atualizado.
    */
    return data;
}














// -----------------------------------------------------
// BUSCAR CONTEÚDOS NO SUPABASE
// -----------------------------------------------------

/*
    Busca no Supabase os filmes e séries
    pertencentes ao usuário que está logado.
*/
async function buscarConteudosDoSupabase() {

    /*
        Consulta a tabela "conteudos".

        O RLS que configuramos no Supabase
        garante que o usuário receba somente
        os próprios registros.
    */
    const { data, error } =
        await supabaseClient
            .from("conteudos")
            .select(`
                id,
                tipo,
                titulo,
                genero,
                streaming,
                lancamento,
                diretor,
                duracao,
                temporadas,
                episodios,
                status_serie
            `)
            .order(
                "id",
                {
                    ascending: true
                }
            );


    /*
        Se ocorrer algum problema na consulta,
        mostramos o erro no Console.
    */
    if (error) {

        console.error(
            "Erro ao buscar conteúdos no Supabase:",
            error
        );

        return [];
    }


    /*
        O Supabase usa o nome status_serie.

        Nosso JavaScript já utiliza statusSerie.

        Aqui fazemos essa pequena adaptação
        para manter o padrão do CineLista.
    */
    const conteudosConvertidos =
        data.map(function (registro) {

            return {

                /*
                    Guardamos também o ID do banco.

                    Ele será importante depois
                    para editar e excluir registros.
                */
                idSupabase:
                    registro.id,

                tipo:
                    registro.tipo,

                titulo:
                    registro.titulo,

                genero:
                    registro.genero,

                streaming:
                    registro.streaming,

                lancamento:
                    registro.lancamento,

                diretor:
                    registro.diretor,

                duracao:
                    registro.duracao,

                temporadas:
                    registro.temporadas,

                episodios:
                    registro.episodios,

                statusSerie:
                    registro.status_serie

            };

        });


    /*
        Teste temporário.

        Por enquanto queremos apenas verificar
        se os dados estão chegando corretamente.
    */
    console.log(
        "Conteúdos recebidos do Supabase:",
        conteudosConvertidos
    );


    /*
        Devolve os conteúdos encontrados.
    */
    return conteudosConvertidos;
}

// -----------------------------------------------------
// GÊNEROS PREFERIDOS PARA RECOMENDAÇÃO
// -----------------------------------------------------

/*
    Analisa os gêneros presentes na CineLista
    e identifica os três gêneros mais frequentes.

    Depois converte os nomes utilizados
    pelo CineLista para os IDs usados pelo TMDb.
*/
function obterGenerosPreferidosTMDb() {

    /*
        Relação entre os nomes dos gêneros
        e os IDs oficiais utilizados pelo TMDb.
    */
    const mapaGeneros = {

        "acao": 28,

        "aventura": 12,

        "animacao": 16,

        "comedia": 35,

        "crime": 80,

        "documentario": 99,

        "drama": 18,

        "familia": 10751,

        "fantasia": 14,

        "historia": 36,

        "terror": 27,

        "horror": 27,

        "musica": 10402,

        "misterio": 9648,

        "romance": 10749,

        "ficcao cientifica": 878,

        "sci-fi": 878,

        "suspense": 53,

        "thriller": 53,

        "guerra": 10752,

        "western": 37,

        /*
            Alguns gêneros usados no CineLista
            não existem como categoria própria
            no TMDb.

            Nesse caso associamos ao gênero
            mais próximo.
        */
        "super-herois": 28,

        "super herois": 28,

        "luta": 28,

        "artes marciais": 28
    };


    /*
        Objeto onde contaremos
        quantas vezes cada gênero aparece.
    */
    const contagemGeneros = {};


    /*
        Percorre todos os filmes e séries
        cadastrados pelo usuário.
    */
    listaConteudos.forEach(
        function (conteudo) {

            /*
                Um conteúdo pode possuir
                vários gêneros separados
                por "/" ou ",".
            */
            const generos =
                conteudo.genero.split(
                    /[\/,]/
                );


            /*
                Evita contar duas vezes o mesmo
                gênero dentro de um único conteúdo.

                Exemplo:
                Ação / Luta / Artes marciais

                Os três podem virar o ID 28,
                mas queremos contar apenas uma vez
                para aquele filme.
            */
            const idsDoConteudo =
                new Set();


            generos.forEach(
                function (genero) {

                    /*
                        Normaliza o texto:

                        "Ficção científica"
                        vira
                        "ficcao cientifica"
                    */
                    const generoNormalizado =
                        genero
                            .normalize("NFD")
                            .replace(
                                /[\u0300-\u036f]/g,
                                ""
                            )
                            .trim()
                            .toLowerCase();


                    /*
                        Procura o ID correspondente
                        no mapa acima.
                    */
                    const idGenero =
                        mapaGeneros[
                            generoNormalizado
                        ];


                    /*
                        Se encontramos um gênero
                        reconhecido pelo TMDb,
                        guardamos seu ID.
                    */
                    if (idGenero) {

                        idsDoConteudo.add(
                            idGenero
                        );
                    }
                }
            );


            /*
                Agora contamos os gêneros
                encontrados neste conteúdo.
            */
            idsDoConteudo.forEach(
                function (idGenero) {

                    if (
                        contagemGeneros[
                            idGenero
                        ]
                    ) {

                        contagemGeneros[
                            idGenero
                        ]++;

                    } else {

                        contagemGeneros[
                            idGenero
                        ] = 1;
                    }
                }
            );
        }
    );


    /*
        Transforma a contagem em uma lista,
        ordena do gênero mais frequente
        para o menos frequente
        e mantém somente os três primeiros.
    */
    const generosMaisFrequentes =
        Object.entries(
            contagemGeneros
        )
            .sort(
                function (a, b) {

                    return b[1] - a[1];
                }
            )
            .slice(0, 3)
            .map(
                function (item) {

                    /*
                        item[0] é o ID do gênero.
                    */
                    return item[0];
                }
            );


    /*
        O TMDb espera algo como:

        28|18|12

        significando:

        Ação OU Drama OU Aventura.
    */
    return generosMaisFrequentes.join(
        "|"
    );
}


// -----------------------------------------------------
// RECOMENDAÇÕES - TESTE COM TMDB
// -----------------------------------------------------

/*
    Busca filmes reais através
    da Netlify Function que criamos.

    Nesta primeira etapa ainda não existe IA.
    Estamos apenas testando a integração
    entre CineLista, Netlify e TMDb.
*/
async function carregarRecomendacoes() {

    /*
        Enquanto buscamos os filmes,
        desativamos temporariamente o botão.
    */
    btnRecomendacoes.disabled = true;

    btnRecomendacoes.textContent =
        "Buscando...";


    /*
        Limpa recomendações anteriores.
    */
    listaRecomendacoes.innerHTML = "";


    try {

        /*
            Chama a função segura hospedada
            no próprio Netlify.
        */
        /*
    Analisa a CineLista e descobre
    os gêneros predominantes do usuário.
*/
const generosPreferidos =
    obterGenerosPreferidosTMDb();


/*
    Começamos com a URL padrão
    da nossa Netlify Function.
*/
let urlRecomendacoes =
    "/.netlify/functions/tmdb-filmes";


/*
    Se encontramos gêneros na lista,
    enviamos esses IDs para a função.

    encodeURIComponent transforma:

    28|18|12

    em uma forma segura para a URL.
*/
if (generosPreferidos) {

    urlRecomendacoes +=
        "?generos=" +
        encodeURIComponent(
            generosPreferidos
        );
}


/*
    Mostra no Console quais gêneros
    estão sendo utilizados.

    Este console é temporário,
    apenas para nosso teste.
*/
console.log(
    "Gêneros usados nas recomendações:",
    generosPreferidos ||
        "Nenhum gênero identificado"
);


/*
    Chama nossa Netlify Function
    usando os gêneros daquele usuário.
*/
const resposta =
    await fetch(
        urlRecomendacoes
    );

        /*
            Se a função responder com erro,
            interrompemos o processo.
        */
        if (!resposta.ok) {

            throw new Error(
                "Não foi possível buscar os filmes."
            );
        }


        /*
            Converte o JSON recebido
            para objeto JavaScript.
        */
        const dados =
            await resposta.json();


        /*
            Cria uma lista apenas com os títulos
            que o usuário já cadastrou.

            Usaremos isso para não recomendar
            algo que já está na CineLista.
        */
        const titulosCadastrados =
            listaConteudos.map(
                function (conteudo) {

                    return conteudo.titulo
                        .trim()
                        .toLowerCase();

                }
            );


        /*
            Remove filmes que o usuário
            já possui na própria lista.

            Depois escolhemos somente
            os três primeiros.
        */
        /*
    Transforma a sequência recebida anteriormente:

    "28|18|12"

    em:

    [28, 18, 12]

    Assim podemos comparar os gêneros
    preferidos do usuário com os gêneros
    de cada filme retornado pelo TMDb.
*/
const idsGenerosPreferidos =
    generosPreferidos
        ? generosPreferidos
            .split("|")
            .map(Number)
        : [];


/*
    Primeiro removemos filmes que
    o usuário já possui na CineLista.
*/
const filmesCandidatos =
    dados.filmes.filter(
        function (filme) {

            const tituloFilme =
                filme.titulo
                    .trim()
                    .toLowerCase();


            return !titulosCadastrados
                .includes(
                    tituloFilme
                );
        }
    );


/*
    Agora damos uma pontuação
    para cada filme candidato.
*/
const filmesPontuados =
    filmesCandidatos.map(
        function (filme) {

            /*
                Conta quantos dos gêneros
                preferidos do usuário também
                aparecem neste filme.
            */
            const quantidadeGenerosEmComum =
                filme.generos.filter(
                    function (idGenero) {

                        return idsGenerosPreferidos
                            .includes(
                                idGenero
                            );
                    }
                ).length;


            /*
                Criamos uma pontuação simples.

                Cada gênero em comum vale 10 pontos.

                Depois somamos a nota do TMDb.

                Exemplo:

                2 gêneros em comum = 20 pontos
                nota 7,8 = +7,8

                total = 27,8
            */
            const pontuacao =
                (
                    quantidadeGenerosEmComum * 10
                ) +
                (
                    Number(filme.nota) || 0
                );


            /*
                Devolvemos o filme junto
                com sua pontuação.
            */
            return {
                ...filme,

                pontuacao:
                    pontuacao,

                generosEmComum:
                    quantidadeGenerosEmComum
            };
        }
    );


/*
    Ordenamos do filme com maior
    pontuação para o menor.
*/
filmesPontuados.sort(
    function (a, b) {

        return (
            b.pontuacao -
            a.pontuacao
        );
    }
);


/*
    Selecionamos primeiro os filmes
    com melhor pontuação.

    Usaremos no máximo os 8 melhores
    como candidatos finais.
*/
const melhoresCandidatos =
    filmesPontuados.slice(
        0,
        8
    );


/*
    Criamos uma cópia do array.

    Assim podemos embaralhar os candidatos
    sem alterar a ordem original
    de filmesPontuados.
*/
const candidatosEmbaralhados = [
    ...melhoresCandidatos
];


/*
    Embaralhamos os melhores candidatos.

    Percorremos o array do fim
    para o começo e trocamos
    os elementos de posição.
*/
for (
    let i =
        candidatosEmbaralhados.length - 1;

    i > 0;

    i--
) {

    /*
        Escolhe uma posição aleatória
        entre 0 e i.
    */
    const indiceAleatorio =
        Math.floor(
            Math.random() *
            (i + 1)
        );


    /*
        Troca os dois elementos
        de posição.
    */
    [
        candidatosEmbaralhados[i],
        candidatosEmbaralhados[
            indiceAleatorio
        ]
    ] = [
        candidatosEmbaralhados[
            indiceAleatorio
        ],
        candidatosEmbaralhados[i]
    ];
}


/*
    Depois do embaralhamento,
    pegamos somente três filmes.
*/
const filmesRecomendados =
    candidatosEmbaralhados.slice(
        0,
        3
    );


/*
    Mostra no Console
    quais filmes foram escolhidos.
*/
console.log(
    "Filmes recomendados:",
    filmesRecomendados
);


        /*
            Cria visualmente uma pequena
            recomendação para cada filme.
        */
        filmesRecomendados.forEach(
            function (filme) {

                /*
                    Container de uma recomendação.
                */
                const item =
                    document.createElement(
                        "div"
                    );

                item.classList.add(
                    "recomendacao-item"
                );
                
                /*
    Cria o pôster do filme.
*/
if (filme.poster) {

    const imagem =
        document.createElement(
            "img"
        );


    /*
        Monta a URL completa da imagem
        usando o poster_path retornado
        pelo TMDb.
    */
    imagem.src =
        "https://image.tmdb.org/t/p/w342" +
        filme.poster;


    /*
        Texto alternativo da imagem.
    */
    imagem.alt =
        `Pôster de ${filme.titulo}`;


    /*
        Classe usada no CSS.
    */
    imagem.classList.add(
        "recomendacao-poster"
    );


    /*
        Faz o navegador carregar a imagem
        somente quando ela estiver próxima
        da área visível da página.
    */
    imagem.loading =
        "lazy";


    /*
        Adiciona o pôster ao card.
    */
    item.appendChild(
        imagem
    );

} else {

    /*
        Caso o TMDb não tenha pôster,
        mostramos um espaço substituto.
    */
    const semPoster =
        document.createElement(
            "div"
        );

    semPoster.classList.add(
        "recomendacao-sem-poster"
    );

    semPoster.textContent =
        "Sem pôster";

    item.appendChild(
        semPoster
    );
}







                /*
                    Título do filme.
                */
                const titulo =
                    document.createElement(
                        "h4"
                    );

                titulo.textContent =
                    filme.titulo;


                /*
                    Ano de lançamento.
                */
                const ano =
                    document.createElement(
                        "p"
                    );

                if (filme.dataLancamento) {

                    ano.textContent =
                        filme.dataLancamento
                            .slice(0, 4);

                } else {

                    ano.textContent =
                        "Ano não informado";
                }


                /*
                    Monta a recomendação.
                */
                item.appendChild(
                    titulo
                );

                item.appendChild(
                    ano
                );


                /*
                    Coloca a recomendação
                    dentro do card.
                */
                listaRecomendacoes
                    .appendChild(
                        item
                    );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao buscar recomendações:",
            erro
        );


        /*
            Informa o erro dentro
            do próprio card.
        */
        listaRecomendacoes.textContent =
            "Não foi possível carregar as recomendações.";

    } finally {

        /*
            Independentemente de sucesso ou erro,
            o botão volta ao estado normal.
        */
        btnRecomendacoes.disabled = false;

        btnRecomendacoes.textContent =
            "Gerar recomendações";
    }
}


/*
    Executa a busca quando
    o usuário clicar no botão.
*/
btnRecomendacoes.addEventListener(
    "click",
    carregarRecomendacoes
);








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
// GRÁFICO: CONTEÚDOS POR STREAMING
// -----------------------------------------------------

function atualizarGraficoStreaming() {

    /*
        Recupera os dados que já preparamos.

        O resultado possui este formato:

        {
            labels: ["Disney+", "HBO Max", ...],
            dados: [3, 5, ...]
        }
    */
    const dadosStreaming =
        prepararDadosGraficoStreaming();


    /*
        Se o gráfico já existe,
        apenas atualizamos seus dados.
    */
    if (graficoStreaming !== null) {

        /*
            Atualiza os nomes das plataformas.
        */
        graficoStreaming.data.labels =
            dadosStreaming.labels;


        /*
            Atualiza as quantidades.
        */
        graficoStreaming.data.datasets[0].data =
            dadosStreaming.dados;


        /*
            Pede ao Chart.js para redesenhar
            o gráfico com os novos valores.
        */
        graficoStreaming.update();

        return;
    }


    /*
        Se o gráfico ainda não existe,
        criamos uma nova instância.
    */
    graficoStreaming = new Chart(

        graficoStreamingCanvas,

        {

            /*
                Tipo básico do gráfico.
            */
            type: "bar",


            /*
                Dados que serão representados.
            */
            data: {

                /*
                    Nomes das plataformas.
                */
                labels:
                    dadosStreaming.labels,


                /*
                    Valores correspondentes
                    a cada plataforma.
                */
                datasets: [
                    {

                        /*
                            Nome utilizado pelo Chart.js
                            para identificar os valores.
                        */
                        label: "Conteúdos",


                        /*
                            Quantidades de conteúdos.
                        */
                        data:
                            dadosStreaming.dados,


                        /*
                            Cor das barras.
                        */
                        backgroundColor:
                            "#8f2cff",


                        /*
                            Cor das bordas.
                        */
                        borderColor:
                            "#b95cff",

                        borderWidth: 1,


                        /*
                            Arredonda levemente
                            as extremidades das barras.
                        */
                        borderRadius: 6

                    }
                ]
            },


            /*
                Configurações visuais e
                de comportamento.
            */
            options: {

                /*
                    Transforma as barras
                    em barras horizontais.
                */
                indexAxis: "y",


                /*
                    Faz o gráfico se adaptar
                    ao tamanho do container.
                */
                responsive: true,


                /*
                    Permite utilizar a altura
                    definida no CSS.
                */
                maintainAspectRatio: false,


                plugins: {

                    /*
                        Não precisamos mostrar
                        uma legenda "Conteúdos",
                        pois o título do gráfico
                        já explica o que ele representa.
                    */
                    legend: {
                        display: false
                    }

                },


                /*
                    Configuração dos eixos.
                */
                scales: {

                    /*
                        Eixo horizontal:
                        mostra as quantidades.
                    */
                    x: {

                        /*
                            A contagem sempre começa em zero.
                        */
                        beginAtZero: true,

                        /*
                            As linhas da grade ficam discretas
                            para combinar com o tema escuro.
                        */
                        grid: {
                            color:
                                "rgba(255, 255, 255, 0.08)"
                        },

                        ticks: {

                            /*
                                Cor dos números do eixo.
                            */
                            color:
                                "rgba(255, 255, 255, 0.65)",

                            /*
                                Como estamos contando conteúdos,
                                queremos apenas números inteiros.
                            */
                            precision: 0
                        }
                    },


                    /*
                        Eixo vertical:
                        mostra os nomes dos streamings.
                    */
                    y: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            /*
                                Cor dos nomes das plataformas.
                            */
                            color:
                                "rgba(255, 255, 255, 0.75)"
                        }
                    }

                }

            }

        }

    );
}



// -----------------------------------------------------
// CONTAGEM DOS GÊNEROS
// -----------------------------------------------------

/*
    Conta quantas vezes cada gênero aparece
    nos conteúdos cadastrados.
*/
function contarGeneros() {

    /*
        Objeto onde armazenaremos a contagem.

        Exemplo:

        {
            "Ação": 4,
            "Drama": 3,
            "Fantasia": 2
        }
    */
    const contagemGeneros = {};


    /*
        Percorre todos os filmes e séries
        cadastrados na CineLista.
    */
    listaConteudos.forEach(function (conteudo) {

        /*
            O campo gênero pode conter vários gêneros.

            Exemplo:
            "Ação / Aventura / Fantasia"

            split("/") divide esse texto sempre
            que encontra uma barra.
        /*
    Separa os gêneros tanto quando foram
    cadastrados com "/" quanto com ",".

    Exemplos:

    "Ação / Aventura / Fantasia"

    e

    "Ação, Aventura, Fantasia"

    passam a ser tratados da mesma forma.
*/
const generos =
    conteudo.genero.split(/[\/,]/);

        /*
            Agora percorremos cada gênero
            encontrado nesse conteúdo.
        */
        generos.forEach(function (genero) {

            /*
                trim() remove espaços extras.

                Exemplo:
                " Aventura " vira "Aventura".
            */
            const generoLimpo =
                genero.trim();


            /*
                Se esse gênero já apareceu,
                aumentamos sua contagem.
            */
            if (contagemGeneros[generoLimpo]) {

                contagemGeneros[generoLimpo]++;

            } else {

                /*
                    Se for a primeira ocorrência,
                    começamos em 1.
                */
                contagemGeneros[generoLimpo] = 1;

            }

        });

    });


    /*
        Devolve o objeto final
        com todos os gêneros e suas quantidades.
    */
    return contagemGeneros;
}


// -----------------------------------------------------
// PREPARAÇÃO DOS DADOS DO GRÁFICO DE GÊNEROS
// -----------------------------------------------------

/*
    Organiza os gêneros do mais frequente
    para o menos frequente e prepara
    os dados para o Chart.js.
*/
function prepararDadosGraficoGeneros() {

    /*
        Recupera o objeto criado pela função
        contarGeneros().

        Exemplo:

        {
            "Ação": 8,
            "Aventura": 7,
            "Drama": 4
        }
    */
    const contagemGeneros =
        contarGeneros();


    /*
        Object.entries() transforma o objeto
        em uma lista de pares.

        Exemplo:

        [
            ["Ação", 8],
            ["Aventura", 7],
            ["Drama", 4]
        ]
    */
    const generosOrdenados =
        Object.entries(contagemGeneros);


    /*
        Ordena do maior valor
        para o menor valor.

        a[1] e b[1] representam
        as quantidades de cada gênero.
    */
    generosOrdenados.sort(function (a, b) {

        return b[1] - a[1];

    });


    /*
        Recupera somente os nomes
        dos gêneros.
    */
    const labels =
        generosOrdenados.map(function (item) {

            return item[0];

        });


    /*
        Recupera somente as quantidades.
    */
    const dados =
        generosOrdenados.map(function (item) {

            return item[1];

        });


    /*
        Devolve as duas listas
        prontas para o gráfico.
    */
    return {
        labels: labels,
        dados: dados
    };
}




// -----------------------------------------------------
// GRÁFICO: GÊNEROS MAIS CADASTRADOS
// -----------------------------------------------------

function atualizarGraficoGeneros() {

    /*
        Recupera os gêneros já separados,
        contados e ordenados.

        O resultado possui este formato:

        {
            labels: ["Ação", "Aventura", "Fantasia", ...],
            dados: [8, 7, 5, ...]
        }
    */
    const dadosGeneros =
        prepararDadosGraficoGeneros();


    /*
        Se o gráfico já existe,
        não criamos outro.

        Apenas substituímos seus dados.
    */
    if (graficoGeneros !== null) {

        /*
            Atualiza os nomes dos gêneros.
        */
        graficoGeneros.data.labels =
            dadosGeneros.labels;


        /*
            Atualiza as quantidades.
        */
        graficoGeneros.data.datasets[0].data =
            dadosGeneros.dados;


        /*
            Redesenha o gráfico
            com os novos valores.
        */
        graficoGeneros.update();

        return;
    }


    /*
        Se o gráfico ainda não existe,
        criamos uma nova instância.
    */
    graficoGeneros = new Chart(

        graficoGenerosCanvas,

        {

            /*
                Utilizamos gráfico de barras.
            */
            type: "bar",


            /*
                Dados utilizados pelo gráfico.
            */
            data: {

                /*
                    Nomes dos gêneros.
                */
                labels:
                    dadosGeneros.labels,


                /*
                    Quantidades de cada gênero.
                */
                datasets: [
                    {

                        label: "Conteúdos",


                        /*
                            Valores correspondentes
                            a cada gênero.
                        */
                        data:
                            dadosGeneros.dados,


                        /*
                            Mantemos o padrão roxo
                            utilizado no Dashboard.
                        */
                        backgroundColor:
                            "#8f2cff",

                        borderColor:
                            "#b95cff",

                        borderWidth: 1,


                        /*
                            Arredonda as extremidades
                            das barras.
                        */
                        borderRadius: 6

                    }
                ]
            },


            /*
                Configurações visuais.
            */
            options: {

                /*
                    Deixa as barras horizontais.
                */
                indexAxis: "y",


                /*
                    Faz o gráfico se adaptar
                    ao tamanho disponível.
                */
                responsive: true,


                /*
                    Permite utilizar a altura
                    definida no CSS.
                */
                maintainAspectRatio: false,


                plugins: {

                    /*
                        Não precisamos mostrar
                        uma legenda "Conteúdos".
                    */
                    legend: {
                        display: false
                    }

                },


                /*
                    Configurações dos eixos.
                */
                scales: {

                    /*
                        Eixo horizontal:
                        quantidade de ocorrências.
                    */
                    x: {

                        /*
                            A contagem começa em zero.
                        */
                        beginAtZero: true,

                        grid: {

                            /*
                                Linhas discretas,
                                adequadas ao fundo escuro.
                            */
                            color:
                                "rgba(255, 255, 255, 0.08)"
                        },

                        ticks: {

                            color:
                                "rgba(255, 255, 255, 0.65)",

                            /*
                                Não queremos valores
                                decimais como 1.5 gêneros.
                            */
                            precision: 0
                        }
                    },


                    /*
                        Eixo vertical:
                        nomes dos gêneros.
                    */
                    y: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            color:
                                "rgba(255, 255, 255, 0.75)"
                        }
                    }

                }

            }

        }

    );
}














// -----------------------------------------------------
// EXCLUSÃO DE CONTEÚDO
// -----------------------------------------------------

// -----------------------------------------------------
// EXCLUIR CONTEÚDO DO SUPABASE
// -----------------------------------------------------

/*
    Exclui um filme ou série
    tanto do banco quanto da interface.
*/
async function excluirConteudo(indice) {

    /*
        Primeiro recuperamos o conteúdo
        correspondente ao card clicado.
    */
    const conteudo =
        listaConteudos[indice];


    /*
        Pedimos confirmação antes
        de excluir definitivamente.
    */
    const confirmarExclusao =
        confirm(
            `Deseja realmente excluir "${conteudo.titulo}"?`
        );


    /*
        Se o usuário cancelar,
        encerramos a função.
    */
    if (!confirmarExclusao) {
        return;
    }


    /*
        Recuperamos o ID gerado pelo Supabase.

        Esse ID identifica exatamente
        qual registro deve ser apagado.
    */
    const idSupabase =
        conteudo.idSupabase;


    /*
        Exclui da tabela "conteudos"
        somente o registro com esse ID.
    */
    const { error } =
        await supabaseClient
            .from("conteudos")
            .delete()
            .eq(
                "id",
                idSupabase
            );


    /*
        Se ocorrer algum erro,
        não alteramos a lista da tela.
    */
    if (error) {

        console.error(
            "Erro ao excluir conteúdo do Supabase:",
            error
        );

        alert(
            "Não foi possível excluir o conteúdo."
        );

        return;
    }


    /*
        Depois da exclusão,
        buscamos novamente no Supabase
        a lista oficial do usuário.
    */
    const conteudosAtualizados =
        await buscarConteudosDoSupabase();


    /*
        Limpa o array atual.
    */
    listaConteudos.length = 0;


    /*
        Preenche novamente com os registros
        que continuam existentes no banco.
    */
    listaConteudos.push(
        ...conteudosAtualizados
    );



    /*
        Atualiza os cards, contadores
        e gráficos da interface.
    */
    renderizarLista();


    console.log(
        "Conteúdo excluído do Supabase:",
        conteudo.titulo
    );
}
// -----------------------------------------------------
// INICIALIZAÇÃO DA APLICAÇÃO
// -----------------------------------------------------

/*
    Esta função é executada quando
    a página principal do CineLista abre.

    Primeiro verificamos se existe
    um usuário autenticado.

    Somente depois disso carregamos
    a aplicação.
*/
async function iniciarAplicacao() {

    /*
        Consulta o Supabase para descobrir
        se existe uma sessão ativa.
    */
    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    /*
        Se não existe sessão,
        significa que o usuário não está logado.
    */
    if (!session) {

        /*
            Envia o usuário para
            a página de login.
        */
        window.location.replace(
            "login.html"
        );

        return;
    }


    /*
        Se existe uma sessão,
        mostramos no Console qual usuário
        está autenticado.
    */
    console.log(
        "Usuário autenticado:",
        session.user
    );

/*
    Recupera o nome que foi salvo
    nos metadados do usuário
    no momento do cadastro.
*/
const nomeUsuario =
    session.user.user_metadata.nome;


/*
    Se existir um nome cadastrado,
    mostramos uma saudação no cabeçalho.

    Caso contrário, mostramos apenas "Olá!".
*/
if (nomeUsuario) {

    usuarioLogado.textContent =
        `Olá, ${nomeUsuario}!`;

} else {

    usuarioLogado.textContent =
        "Olá!";
}


/*
    Enquanto buscamos os dados,
    mantemos a mensagem de carregamento visível.
*/
mensagemCarregamento.style.display =
    "block";


/*
    Remove temporariamente o texto inicial
    da lista para não aparecer
    "Nenhum filme ou série cadastrado"
    enquanto o Supabase ainda está carregando.
*/
listaConteudosHTML.innerHTML = "";

/*
    Busca os conteúdos que já estão
    armazenados no Supabase.
*/
/*
    Busca no Supabase os conteúdos
    pertencentes ao usuário logado.
*/
const conteudosSupabase =
    await buscarConteudosDoSupabase();


/*
    Limpa o array utilizado pela interface.

    Neste momento ele já começa vazio,
    mas esta linha também será útil
    quando recarregarmos os dados no futuro.
*/
listaConteudos.length = 0;


/*
    Copia para listaConteudos todos
    os registros recebidos do Supabase.

    O operador ... espalha os itens
    dentro do nosso array.
*/
listaConteudos.push(
    ...conteudosSupabase
);

/*
    Os dados já chegaram.

    Agora podemos esconder
    a mensagem de carregamento.
*/
mensagemCarregamento.style.display =
    "none";
/*
    Agora a Minha Lista, os contadores
    e os gráficos são renderizados
    utilizando os dados do Supabase.
*/
renderizarLista();
}


/*
    Inicia a aplicação.
*/
iniciarAplicacao();


// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------

/*
    Ao clicar em Sair,
    encerramos a sessão atual no Supabase.
*/
btnSair.addEventListener(
    "click",
    async function () {

        /*
            signOut() remove a sessão
            do usuário autenticado.
        */
        const { error } =
            await supabaseClient.auth.signOut();


        /*
            Se ocorrer algum problema,
            mostramos o erro no Console.
        */
        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            alert(
                "Não foi possível sair da conta."
            );

            return;
        }


        /*
            Depois que a sessão é encerrada,
            voltamos para a tela de login.
        */
        window.location.replace(
            "login.html"
        );

    }
);





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

    /*
    Atualiza o gráfico
    de conteúdos por streaming.
    */
    atualizarGraficoStreaming();

    /*
    Atualiza o gráfico
    de gêneros cadastrados.
    */
    atualizarGraficoGeneros();

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

formulario.addEventListener(
    "submit",
    async function (event) {

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

    /*
        Salva o novo conteúdo no Supabase
        e recebe de volta o registro criado.
    */
    const conteudoSalvo =
        await salvarConteudoNoSupabase(
            conteudo
        );


    /*
        Se ocorreu algum erro no banco,
        interrompemos o cadastro.

        Assim evitamos mostrar na tela
        um conteúdo que não foi realmente salvo.
    */
    if (!conteudoSalvo) {

        alert(
            "Não foi possível salvar o conteúdo."
        );

        return;
    }


    /*
        Agora buscamos novamente a lista
        diretamente do Supabase.

        Assim a interface sempre reflete
        exatamente o que existe no banco.
    */
    const conteudosAtualizados =
        await buscarConteudosDoSupabase();


    /*
        Limpa o array atual.
    */
    listaConteudos.length = 0;


    /*
        Coloca no array os dados
        recém-carregados do banco.
    */
    listaConteudos.push(
        ...conteudosAtualizados
    );

} else {

    /*
        Recuperamos o conteúdo que está
        sendo editado antes de alterá-lo.
    */
    const conteudoEmEdicao =
        listaConteudos[indiceEmEdicao];


    /*
        Quando carregamos os dados do Supabase,
        guardamos o ID de cada registro
        na propriedade idSupabase.

        É esse ID que identifica exatamente
        qual linha deve ser atualizada.
    */
    const idSupabase =
        conteudoEmEdicao.idSupabase;


    /*
        Envia os novos dados
        para o Supabase.
    */
    const conteudoAtualizado =
        await atualizarConteudoNoSupabase(
            idSupabase,
            conteudo
        );


    /*
        Se a atualização falhar,
        interrompemos o processo.

        Assim não alteramos somente a tela
        sem alterar também o banco.
    */
    if (!conteudoAtualizado) {

        alert(
            "Não foi possível atualizar o conteúdo."
        );

        return;
    }


    /*
        Depois da atualização,
        buscamos novamente a lista oficial
        diretamente do Supabase.
    */
    const conteudosAtualizados =
        await buscarConteudosDoSupabase();


    /*
        Esvazia o array atual.
    */
    listaConteudos.length = 0;


    /*
        Preenche novamente o array
        com os dados vindos do banco.
    */
    listaConteudos.push(
        ...conteudosAtualizados
    );


    /*
        Saímos do modo de edição.
    */
    indiceEmEdicao = null;


    /*
        O botão volta a se chamar Salvar.
    */
    btnSalvar.textContent = "Salvar";
}

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