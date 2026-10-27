// =====================================================
// DETALHES DE UM FILME NO TMDB
// =====================================================

/*
    Esta Netlify Function recebe o ID
    de um filme encontrado anteriormente
    na busca do CineLista.

    Exemplo:

    /.netlify/functions/tmdb-detalhes?id=157336
*/

export default async function (request) {

    /*
        Recupera o token protegido
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
        Recupera a URL que chamou
        esta função.
    */
    const urlRecebida =
        new URL(request.url);


    /*
        Recupera o ID enviado.

        Exemplo:

        ?id=157336
    */
    const idFilme =
        urlRecebida.searchParams.get(
            "id"
        );


    /*
        Impede uma consulta sem ID.
    */
    if (!idFilme) {

        return Response.json(
            {
                erro:
                    "Informe o ID do filme."
            },
            {
                status: 400
            }
        );
    }


    try {

        /*
            Consulta os detalhes
            do filme escolhido.
        */
        const urlTMDb =
            new URL(
                `https://api.themoviedb.org/3/movie/${idFilme}`
            );


        /*
            Solicita informações
            em português do Brasil.
        */
        urlTMDb.searchParams.set(
            "language",
            "pt-BR"
        );


        /*
            Além dos detalhes normais,
            pedimos também os créditos.

            Assim conseguimos descobrir
            o diretor sem fazer outra requisição.
        */
        urlTMDb.searchParams.set(
            "append_to_response",
            "credits"
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


        /*
            Trata possíveis erros
            vindos do TMDb.
        */
        if (!resposta.ok) {

            return Response.json(
                {
                    erro:
                        "Erro ao buscar detalhes do filme.",

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
            Procura todas as pessoas
            que aparecem nos créditos
            com a função "Director".
        */
        const diretores =
            dados.credits?.crew
                ?.filter(
                    function (pessoa) {

                        return (
                            pessoa.job ===
                            "Director"
                        );
                    }
                )
                .map(
                    function (pessoa) {

                        return pessoa.name;
                    }
                ) || [];


        /*
            Devolve somente as informações
            necessárias para o CineLista.
        */
        return Response.json({

            id:
                dados.id,

            titulo:
                dados.title,

            /*
                Duração em minutos.
            */
            duracao:
                dados.runtime || null,

            /*
                Alguns filmes possuem
                mais de um diretor.

                Nesse caso juntamos os nomes.
            */
            diretor:
                diretores.join(" / "),

            /*
                Também devolvemos os gêneros
                completos por segurança.
            */
            generos:
                dados.genres.map(
                    function (genero) {

                        return genero.name;
                    }
                ),

            dataLancamento:
                dados.release_date

        });


    } catch (erro) {

        console.error(
            "Erro ao buscar detalhes do filme:",
            erro
        );


        return Response.json(
            {
                erro:
                    "Erro interno ao buscar detalhes do filme."
            },
            {
                status: 500
            }
        );
    }
}