// =====================================================
// TMDB - FILMES PARA RECOMENDAÇÃO
// Função segura executada pelo Netlify
// =====================================================

export default async function (request) {

    /*
        Recupera o token armazenado
        nas variáveis de ambiente do Netlify.
    */
    const token =
        process.env.TMDB_READ_ACCESS_TOKEN;


    /*
        Se o token não estiver disponível,
        interrompemos a função.
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
        Lê os parâmetros enviados
        na URL da nossa função.

        Exemplo:
        ?generos=28|18
    */
    const urlRecebida =
        new URL(request.url);

    const generos =
        urlRecebida.searchParams.get(
            "generos"
        );


    try {

        /*
            Se recebemos gêneros,
            usamos o endpoint "discover".

            Se não recebemos,
            mantemos a lista de populares
            como alternativa.
        */
        let urlTMDb;


        if (generos) {

            urlTMDb =
                new URL(
                    "https://api.themoviedb.org/3/discover/movie"
                );


            /*
                Configura a busca personalizada.
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
                Filtra pelos gêneros recebidos.
            */
            urlTMDb.searchParams.set(
                "with_genres",
                generos
            );


            /*
                Prioriza filmes mais populares.
            */
            urlTMDb.searchParams.set(
                "sort_by",
                "popularity.desc"
            );


            /*
                Evita recomendações baseadas
                em pouquíssimos votos.
            */
            urlTMDb.searchParams.set(
                "vote_count.gte",
                "100"
            );


            /*
                Evita recomendar filmes
                que ainda não foram lançados.
            */
            const hoje =
                new Date()
                    .toISOString()
                    .slice(0, 10);

            urlTMDb.searchParams.set(
                "primary_release_date.lte",
                hoje
            );

        } else {

            /*
                Caso nenhum gênero seja enviado,
                usamos filmes populares.
            */
            urlTMDb =
                new URL(
                    "https://api.themoviedb.org/3/movie/popular"
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
            Faz a requisição ao TMDb.
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
            Se o TMDb devolver erro,
            repassamos para facilitar o teste.
        */
        if (!resposta.ok) {

            return Response.json(
                {
                    erro:
                        "Erro ao consultar o TMDb.",

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
            Mantemos somente os campos
            úteis para o CineLista.
        */
        const filmes =
            dados.results.map(
                function (filme) {

                    return {

                        id:
                            filme.id,

                        titulo:
                            filme.title,

                        tituloOriginal:
                            filme.original_title,

                        dataLancamento:
                            filme.release_date,

                        sinopse:
                            filme.overview,

                        poster:
                            filme.poster_path,

                        generos:
                            filme.genre_ids,

                        nota:
                            filme.vote_average

                    };
                }
            );


        /*
            Envia os filmes para o frontend.

            Também devolvemos os gêneros
            utilizados apenas para facilitar
            nossos testes agora.
        */
        return Response.json({

            generosUsados:
                generos || null,

            filmes:
                filmes
        });


    } catch (erro) {

        console.error(
            "Erro na função TMDb:",
            erro
        );


        return Response.json(
            {
                erro:
                    "Erro interno ao consultar o TMDb."
            },
            {
                status: 500
            }
        );
    }
}