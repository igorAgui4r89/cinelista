// =====================================================
// TMDB - SÉRIES PARA RECOMENDAÇÃO
// =====================================================

/*
    Esta Netlify Function recebe
    os gêneros preferidos do usuário
    e consulta séries no TMDb.

    Exemplo:

    /.netlify/functions/tmdb-series?generos=18|80
*/

export default async function (request) {

    /*
        Recupera o token armazenado
        nas variáveis de ambiente do Netlify.
    */
    const token =
        process.env.TMDB_READ_ACCESS_TOKEN;


    /*
        Sem o token não conseguimos
        consultar o TMDb.
    */
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
        Recupera os parâmetros
        enviados pela URL.
    */
    const urlRecebida =
        new URL(request.url);


    /*
        Exemplo:

        ?generos=18|80|9648
    */
    const generos =
        urlRecebida.searchParams.get(
            "generos"
        );


    try {

        let urlTMDb;


        /*
            Se recebemos os gêneros
            preferidos do usuário,
            usamos o Discover TV.
        */
        if (generos) {

            urlTMDb =
                new URL(
                    "https://api.themoviedb.org/3/discover/tv"
                );


            /*
                Retorno em português.
            */
            urlTMDb.searchParams.set(
                "language",
                "pt-BR"
            );


            urlTMDb.searchParams.set(
                "page",
                "1"
            );


            urlTMDb.searchParams.set(
                "include_adult",
                "false"
            );


            /*
                Filtra pelas categorias
                preferidas do usuário.

                A barra | significa OU.

                Exemplo:

                18|80

                Drama OU Crime.
            */
            urlTMDb.searchParams.set(
                "with_genres",
                generos
            );


            /*
                Priorizamos séries populares.
            */
            urlTMDb.searchParams.set(
                "sort_by",
                "popularity.desc"
            );


            /*
                Evita séries praticamente
                sem avaliações.
            */
            urlTMDb.searchParams.set(
                "vote_count.gte",
                "100"
            );


            /*
                Evita recomendar séries
                que ainda nem começaram
                a ser exibidas.
            */
            const hoje =
                new Date()
                    .toISOString()
                    .slice(0, 10);


            urlTMDb.searchParams.set(
                "first_air_date.lte",
                hoje
            );


        } else {

            /*
                Caso o usuário ainda não tenha
                gêneros suficientes para personalizar,
                usamos séries populares.
            */
            urlTMDb =
                new URL(
                    "https://api.themoviedb.org/3/tv/popular"
                );


            urlTMDb.searchParams.set(
                "language",
                "pt-BR"
            );


            urlTMDb.searchParams.set(
                "page",
                "1"
            );
        }


        /*
            Faz a consulta ao TMDb.
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


        /*
            Se o TMDb responder com erro,
            repassamos a informação.
        */
        if (!resposta.ok) {

            return Response.json(
                {
                    erro:
                        "Erro ao consultar séries no TMDb.",

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
            O TMDb usa nomes diferentes
            para filmes e séries.

            Em séries:

            name
            original_name
            first_air_date
        */
        const series =
            dados.results.map(
                function (serie) {

                    return {

                        id:
                            serie.id,


                        titulo:
                            serie.name,


                        tituloOriginal:
                            serie.original_name,


                        dataLancamento:
                            serie.first_air_date,


                        sinopse:
                            serie.overview,


                        poster:
                            serie.poster_path,


                        generos:
                            serie.genre_ids,


                        nota:
                            serie.vote_average
                    };
                }
            );


        /*
            Devolve as séries
            para o JavaScript do CineLista.
        */
        return Response.json({

            generosUsados:
                generos || null,

            series:
                series
        });


    } catch (erro) {

        console.error(
            "Erro na função de séries:",
            erro
        );


        return Response.json(
            {
                erro:
                    "Erro interno ao consultar séries no TMDb."
            },
            {
                status: 500
            }
        );
    }
}