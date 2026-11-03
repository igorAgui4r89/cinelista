// =====================================================
// DESTAQUE ALEATÓRIO DO CINELISTA
// =====================================================

/*
    Esta função escolhe o filme que aparecerá
    no quarto quadrante do dashboard.

    REGRA:

    1. Se hoje for uma data especial cadastrada,
       exibe o filme comemorativo.

    2. Caso contrário, escolhe um filme aleatório,
       sem considerar os gostos do usuário.
*/


// -----------------------------------------------------
// DATAS ESPECIAIS
// -----------------------------------------------------

/*
    A chave utiliza:

    MM-DD

    Exemplo:

    12-23 = 23 de dezembro.

    Depois podemos acrescentar quantos
    filmes especiais quisermos aqui.
*/
const filmesDatasEspeciais = {

    /*
        Street Fighter
        Lançamento original:
        23 de dezembro de 1994.

        ID TMDb:
        11667
    */
    "12-23": {

        id: 11667,

        motivo:
            "Aniversário de lançamento de Street Fighter"
    }
};


// -----------------------------------------------------
// DATA ATUAL NO BRASIL
// -----------------------------------------------------

function obterDataBrasil() {

    /*
        O servidor do Netlify não necessariamente
        utiliza o horário do Brasil.

        Por isso definimos explicitamente
        America/Sao_Paulo.
    */
    const partes =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    "America/Sao_Paulo",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit"
            }
        )
            .formatToParts(
                new Date()
            );


    const valores = {};


    partes.forEach(
        function (parte) {

            valores[
                parte.type
            ] = parte.value;
        }
    );


    return {

        ano:
            Number(
                valores.year
            ),

        mes:
            valores.month,

        dia:
            valores.day,

        chave:
            valores.month +
            "-" +
            valores.day
    };
}


// -----------------------------------------------------
// FUNÇÃO PRINCIPAL
// -----------------------------------------------------

export default async function () {

    const token =
        process.env.TMDB_READ_ACCESS_TOKEN;


    if (!token) {

        return Response.json(
            {
                erro:
                    "Token do TMDb não configurado."
            },
            {
                status: 500
            }
        );
    }


    try {

        const dataBrasil =
            obterDataBrasil();


        /*
            Verifica se existe algum filme
            especial cadastrado para hoje.
        */
        const filmeEspecial =
            filmesDatasEspeciais[
                dataBrasil.chave
            ];


        // =================================================
        // FILME DE DATA ESPECIAL
        // =================================================

        if (filmeEspecial) {

            const urlTMDb =
                new URL(
                    "https://api.themoviedb.org/3/movie/" +
                    filmeEspecial.id
                );


            urlTMDb.searchParams.set(
                "language",
                "pt-BR"
            );


            const resposta =
                await fetch(
                    urlTMDb.toString(),
                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            accept:
                                "application/json"
                        }
                    }
                );


            const filme =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao buscar filme especial."
                );
            }


            /*
                Retornamos no mesmo formato
                que será usado também
                pelos filmes aleatórios.
            */
            return Response.json({

                tipoDestaque:
                    "aniversario",

                motivo:
                    filmeEspecial.motivo,

                filme: {

                    id:
                        filme.id,

                    titulo:
                        filme.title,

                    dataLancamento:
                        filme.release_date,

                    sinopse:
                        filme.overview,

                    poster:
                        filme.poster_path,

                    nota:
                        filme.vote_average
                }
            });
        }


        // =================================================
        // FILME ALEATÓRIO
        // =================================================

        /*
            Sorteamos primeiro um ano.

            Isso ajuda a evitar que o sistema
            mostre apenas lançamentos recentes.

            Pode aparecer um filme de 1950,
            1980, 2000, 2020 etc.
        */
        const primeiroAno =
            1950;


        const anoAleatorio =
            Math.floor(
                Math.random() *
                (
                    dataBrasil.ano -
                    primeiroAno +
                    1
                )
            ) +
            primeiroAno;


        /*
            Primeira consulta ao Discover.

            Não informamos gênero.

            Portanto:

            NÃO usa preferências;
            NÃO usa CineLista;
            NÃO usa recomendação personalizada.
        */
        const urlDescoberta =
            new URL(
                "https://api.themoviedb.org/3/discover/movie"
            );


        urlDescoberta.searchParams.set(
            "language",
            "pt-BR"
        );


        urlDescoberta.searchParams.set(
            "primary_release_year",
            String(
                anoAleatorio
            )
        );


        /*
            Evita títulos praticamente
            sem nenhuma avaliação.
        */
        urlDescoberta.searchParams.set(
            "vote_count.gte",
            "100"
        );


        urlDescoberta.searchParams.set(
            "sort_by",
            "popularity.desc"
        );


        urlDescoberta.searchParams.set(
            "include_adult",
            "false"
        );


        urlDescoberta.searchParams.set(
            "page",
            "1"
        );


        const respostaInicial =
            await fetch(
                urlDescoberta.toString(),
                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                        accept:
                            "application/json"
                    }
                }
            );


        const dadosIniciais =
            await respostaInicial.json();


        if (!respostaInicial.ok) {

            throw new Error(
                "Erro ao buscar filmes aleatórios."
            );
        }


        /*
            O TMDb possui várias páginas
            de resultados.

            Sorteamos uma entre as primeiras
            páginas disponíveis.
        */
        const totalPaginasDisponiveis =
            Math.min(
                dadosIniciais.total_pages || 1,
                5
            );


        const paginaAleatoria =
            Math.floor(
                Math.random() *
                totalPaginasDisponiveis
            ) + 1;


        let resultados =
            dadosIniciais.results;


        /*
            Se a página sorteada não for a primeira,
            fazemos uma segunda consulta.
        */
        if (
            paginaAleatoria !== 1
        ) {

            urlDescoberta.searchParams.set(
                "page",
                String(
                    paginaAleatoria
                )
            );


            const respostaPagina =
                await fetch(
                    urlDescoberta.toString(),
                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            accept:
                                "application/json"
                        }
                    }
                );


            const dadosPagina =
                await respostaPagina.json();


            if (respostaPagina.ok) {

                resultados =
                    dadosPagina.results;
            }
        }


        /*
            Preferimos filmes que tenham
            pôster e sinopse.

            Isso é importante porque o
            quadrante precisará dos dois.
        */
        let candidatos =
            resultados.filter(
                function (filme) {

                    return (
                        filme.poster_path &&
                        filme.overview
                    );
                }
            );


        /*
            Se por algum motivo todos os filmes
            da página estiverem sem sinopse/pôster,
            utilizamos os resultados originais.
        */
        if (
            candidatos.length === 0
        ) {

            candidatos =
                resultados;
        }


        if (
            candidatos.length === 0
        ) {

            throw new Error(
                "Nenhum filme encontrado."
            );
        }


        /*
            Agora sim fazemos o sorteio
            do filme.
        */
        const indiceAleatorio =
            Math.floor(
                Math.random() *
                candidatos.length
            );


        const filmeEscolhido =
            candidatos[
                indiceAleatorio
            ];


        return Response.json({

            tipoDestaque:
                "aleatorio",

            motivo:
                "Descoberta aleatória do CineLista",

            anoSorteado:
                anoAleatorio,

            filme: {

                id:
                    filmeEscolhido.id,

                titulo:
                    filmeEscolhido.title,

                dataLancamento:
                    filmeEscolhido.release_date,

                sinopse:
                    filmeEscolhido.overview,

                poster:
                    filmeEscolhido.poster_path,

                nota:
                    filmeEscolhido.vote_average
            }
        });


    } catch (erro) {

        console.error(
            "Erro no destaque do CineLista:",
            erro
        );


        return Response.json(
            {
                erro:
                    "Não foi possível gerar o destaque."
            },
            {
                status: 500
            }
        );
    }
}