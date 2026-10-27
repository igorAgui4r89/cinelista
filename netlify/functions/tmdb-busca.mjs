// =====================================================
// BUSCA DE FILMES NO TMDB
// =====================================================

/*
    Esta Netlify Function recebe um título
    enviado pelo CineLista e consulta
    o catálogo do TMDb.

    Exemplo:

    /.netlify/functions/tmdb-busca?titulo=Interestelar
*/

export default async function (request) {

    /*
        Recupera o token do TMDb
        armazenado com segurança
        nas variáveis de ambiente do Netlify.
    */
    const token =
        process.env.TMDB_READ_ACCESS_TOKEN;


    /*
        Se o token não estiver configurado,
        interrompemos a execução.
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
        Converte a URL recebida
        em um objeto que podemos consultar.
    */
    const urlRecebida =
        new URL(request.url);


    /*
        Recupera o parâmetro "titulo".

        Exemplo:

        ?titulo=Interestelar
    */
    const titulo =
        urlRecebida.searchParams.get(
            "titulo"
        );


    /*
        Não fazemos uma busca vazia.
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


    try {

        /*
            Endpoint oficial do TMDb
            utilizado para busca textual
            de filmes.
        */
        const urlTMDb =
            new URL(
                "https://api.themoviedb.org/3/search/movie"
            );


        /*
            Texto digitado pelo usuário.
        */
        urlTMDb.searchParams.set(
            "query",
            titulo.trim()
        );


        /*
            Solicitamos os dados traduzidos
            para português do Brasil.
        */
        urlTMDb.searchParams.set(
            "language",
            "pt-BR"
        );


        /*
            Informamos a região Brasil.

            Isso ajuda o TMDb a utilizar
            informações regionais quando disponíveis.
        */
        urlTMDb.searchParams.set(
            "region",
            "BR"
        );


        /*
            Não queremos resultados adultos
            nesta busca.
        */
        urlTMDb.searchParams.set(
            "include_adult",
            "false"
        );


        /*
            Buscamos apenas a primeira página.

            Para o CineLista isso já será suficiente
            na primeira versão do buscador.
        */
        urlTMDb.searchParams.set(
            "page",
            "1"
        );


        /*
            Faz a requisição ao TMDb
            utilizando o Bearer Token.
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


        /*
            Converte a resposta para JavaScript.
        */
        const dados =
            await resposta.json();


        /*
            Se o TMDb devolver algum erro,
            repassamos uma mensagem para o frontend.
        */
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
            Mantemos apenas os dados
            que realmente serão úteis
            para o CineLista.
        */
        const filmes =
            dados.results.map(
                function (filme) {

                    return {

                        /*
                            ID oficial do TMDb.

                            Vamos precisar dele depois
                            para consultar detalhes.
                        */
                        id:
                            filme.id,


                        /*
                            Título em português,
                            quando disponível.
                        */
                        titulo:
                            filme.title,


                        /*
                            Título original.
                        */
                        tituloOriginal:
                            filme.original_title,


                        /*
                            Data de lançamento.
                        */
                        dataLancamento:
                            filme.release_date,


                        /*
                            IDs dos gêneros.

                            Depois o CineLista converte
                            esses números para nomes.
                        */
                        generos:
                            filme.genre_ids,


                        /*
                            Caminho do pôster.
                        */
                        poster:
                            filme.poster_path,


                        /*
                            Resumo do filme.
                        */
                        sinopse:
                            filme.overview,


                        /*
                            Nota média no TMDb.
                        */
                        nota:
                            filme.vote_average
                    };
                }
            );


        /*
            Retornamos no máximo
            os 8 primeiros resultados.

            Isso evita encher a tela
            com resultados demais.
        */
        return Response.json({
            busca:
                titulo.trim(),

            filmes:
                filmes.slice(
                    0,
                    8
                )
        });


    } catch (erro) {

        /*
            Este bloco trata erros
            inesperados de conexão
            ou execução.
        */
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