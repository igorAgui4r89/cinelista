// =====================================================
// BUSCA DE FILMES E SÉRIES NO TMDB
// =====================================================

/*
    Esta função recebe:

    titulo = texto pesquisado
    tipo   = filme ou serie

    Exemplos:

    /.netlify/functions/tmdb-busca?titulo=Interestelar&tipo=filme

    /.netlify/functions/tmdb-busca?titulo=Breaking%20Bad&tipo=serie
*/

export default async function (request) {

    /*
        Recupera o token protegido
        nas variáveis de ambiente do Netlify.
    */
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


    /*
        Recupera os parâmetros enviados
        pela URL.
    */
    const urlRecebida =
        new URL(request.url);


    const titulo =
        urlRecebida.searchParams.get(
            "titulo"
        );


    /*
        O CineLista utiliza:

        filme
        serie
    */
    const tipo =
        urlRecebida.searchParams.get(
            "tipo"
        ) || "filme";


    /*
        Não permitimos uma busca vazia.
    */
    if (
        !titulo ||
        titulo.trim() === ""
    ) {

        return Response.json(
            {
                erro:
                    "Informe um título para pesquisar."
            },
            {
                status: 400
            }
        );
    }


    /*
        Aceitamos somente os dois tipos
        utilizados pelo CineLista.
    */
    if (
        tipo !== "filme" &&
        tipo !== "serie"
    ) {

        return Response.json(
            {
                erro:
                    "Tipo de conteúdo inválido."
            },
            {
                status: 400
            }
        );
    }


    try {

        /*
            Decide qual endpoint será utilizado.

            Filme:
            /search/movie

            Série:
            /search/tv
        */
        const endpoint =
            tipo === "serie"
                ? "tv"
                : "movie";


        const urlTMDb =
            new URL(
                `https://api.themoviedb.org/3/search/${endpoint}`
            );


        urlTMDb.searchParams.set(
            "query",
            titulo.trim()
        );


        urlTMDb.searchParams.set(
            "language",
            "pt-BR"
        );


        urlTMDb.searchParams.set(
            "include_adult",
            "false"
        );


        urlTMDb.searchParams.set(
            "page",
            "1"
        );


        /*
            Consulta o TMDb.
        */
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


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            return Response.json(
                {
                    erro:
                        "Erro ao pesquisar no TMDb.",

                    detalhes:
                        dados
                },
                {
                    status:
                        resposta.status
                }
            );
        }


        /*
            Normalizamos filmes e séries
            para o mesmo formato.

            Isso é importante porque o TMDb
            utiliza nomes de propriedades diferentes:

            Filme:
            title
            release_date

            Série:
            name
            first_air_date
        */
        const resultados =
            dados.results.map(
                function (item) {

                    return {

                        id:
                            item.id,


                        /*
                            Filme usa title.
                            Série usa name.
                        */
                        titulo:
                            tipo === "serie"
                                ? item.name
                                : item.title,


                        /*
                            Título original também
                            possui nomes diferentes.
                        */
                        tituloOriginal:
                            tipo === "serie"
                                ? item.original_name
                                : item.original_title,


                        /*
                            Filme:
                            release_date

                            Série:
                            first_air_date
                        */
                        dataLancamento:
                            tipo === "serie"
                                ? item.first_air_date
                                : item.release_date,


                        generos:
                            item.genre_ids,


                        poster:
                            item.poster_path,


                        sinopse:
                            item.overview,


                        nota:
                            item.vote_average,


                        /*
                            Guardamos também o tipo.

                            Isso será útil quando
                            o usuário clicar em Selecionar.
                        */
                        tipo:
                            tipo
                    };
                }
            );


        /*
            Mantemos no máximo
            oito resultados.
        */
        return Response.json({

            busca:
                titulo.trim(),

            tipo:
                tipo,

            resultados:
                resultados.slice(
                    0,
                    8
                )

        });


    } catch (erro) {

        console.error(
            "Erro na busca TMDb:",
            erro
        );


        return Response.json(
            {
                erro:
                    "Erro interno ao pesquisar no TMDb."
            },
            {
                status: 500
            }
        );
    }
}