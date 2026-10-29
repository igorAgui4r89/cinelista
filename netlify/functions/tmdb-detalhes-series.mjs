// =====================================================
// DETALHES DE UMA SÉRIE NO TMDB
// =====================================================

/*
    Recebe o ID de uma série e devolve
    os dados necessários para preencher
    o formulário do CineLista.

    Exemplo:

    /.netlify/functions/tmdb-detalhes-series?id=1396
*/

export default async function (request) {

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


    const urlRecebida =
        new URL(request.url);


    const idSerie =
        urlRecebida.searchParams.get(
            "id"
        );


    if (!idSerie) {

        return Response.json(
            {
                erro:
                    "Informe o ID da série."
            },
            {
                status: 400
            }
        );
    }


    try {

        /*
            Endpoint de detalhes de séries.
        */
        const urlTMDb =
            new URL(
                `https://api.themoviedb.org/3/tv/${idSerie}`
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


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            return Response.json(
                {
                    erro:
                        "Erro ao buscar detalhes da série.",

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
            O CineLista trabalha apenas com:

            Em andamento
            Encerrada

            Por isso convertemos os vários
            status do TMDb para essas duas opções.
        */
        let statusSerie =
            "Em andamento";


        if (
            dados.status === "Ended" ||
            dados.status === "Canceled"
        ) {

            statusSerie =
                "Encerrada";
        }


        /*
            Devolve os campos necessários
            para o formulário.
        */
        return Response.json({

            id:
                dados.id,

            titulo:
                dados.name,

            generos:
                dados.genres.map(
                    function (genero) {

                        return genero.name;
                    }
                ),

            dataLancamento:
                dados.first_air_date,

            temporadas:
                dados.number_of_seasons || null,

            episodios:
                dados.number_of_episodes || null,

            statusSerie:
                statusSerie,

            /*
                O TMDb também fornece os criadores.

                Por enquanto apenas devolvemos
                essa informação. Depois decidimos
                como encaixá-la no formulário.
            */
            criadores:
                dados.created_by.map(
                    function (criador) {

                        return criador.name;
                    }
                )

        });


    } catch (erro) {

        console.error(
            "Erro ao buscar detalhes da série:",
            erro
        );


        return Response.json(
            {
                erro:
                    "Erro interno ao buscar detalhes da série."
            },
            {
                status: 500
            }
        );
    }
}