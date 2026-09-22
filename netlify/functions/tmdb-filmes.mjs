// =====================================================
// TMDB - FILMES POPULARES
// Função segura executada pelo Netlify
// =====================================================

export default async function () {

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


    try {

        /*
            Faz uma requisição ao TMDb.

            Neste primeiro teste,
            buscamos filmes populares
            em português do Brasil.
        */
        const resposta =
            await fetch(
                "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        accept:
                            "application/json"
                    }
                }
            );


        /*
            Converte a resposta do TMDb
            para um objeto JavaScript.
        */
        const dados =
            await resposta.json();


        /*
            Se o TMDb responder com erro,
            devolvemos esse erro para facilitar
            o nosso teste.
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
            Por enquanto devolvemos apenas
            alguns campos úteis dos filmes.

            Depois a IA trabalhará
            com esses dados.
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
            Resposta enviada para o navegador.
        */
        return Response.json({
            filmes: filmes
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