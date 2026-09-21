// =====================================================
// REDEFINIÇÃO DE SENHA
// CineLista
// =====================================================


/*
    Recupera o formulário da página.
*/
const formRedefinirSenha =
    document.getElementById(
        "form-redefinir-senha"
    );


/*
    Área onde exibiremos mensagens
    de sucesso ou erro.
*/
const redefinirMensagem =
    document.getElementById(
        "redefinir-mensagem"
    );


// -----------------------------------------------------
// EXIBIR MENSAGENS
// -----------------------------------------------------

/*
    Mostra uma mensagem dentro
    da própria página.

    O tipo pode ser:
    - "sucesso";
    - "erro".
*/
function mostrarMensagemRedefinicao(
    texto,
    tipo
) {

    redefinirMensagem.textContent =
        texto;


    /*
        Remove possíveis estilos
        utilizados anteriormente.
    */
    redefinirMensagem.classList.remove(
        "sucesso",
        "erro"
    );


    /*
        Adiciona o estilo correspondente
        à mensagem atual.
    */
    redefinirMensagem.classList.add(
        tipo
    );
}


// -----------------------------------------------------
// SALVAR NOVA SENHA
// -----------------------------------------------------

formRedefinirSenha.addEventListener(
    "submit",
    async function (event) {

        /*
            Impede o comportamento padrão
            de recarregar a página.
        */
        event.preventDefault();


        /*
            Recupera as duas senhas
            digitadas pelo usuário.
        */
        const novaSenha =
            document.getElementById(
                "nova-senha"
            ).value;

        const confirmarNovaSenha =
            document.getElementById(
                "confirmar-nova-senha"
            ).value;


        /*
            Antes de falar com o Supabase,
            verificamos se as duas senhas
            são iguais.
        */
        if (
            novaSenha !==
            confirmarNovaSenha
        ) {

            mostrarMensagemRedefinicao(
                "As senhas digitadas não são iguais.",
                "erro"
            );

            return;
        }


        /*
            Atualiza a senha do usuário
            autenticado pelo link
            de recuperação.
        */
        const { error } =
            await supabaseClient.auth
                .updateUser({
                    password: novaSenha
                });


        /*
            Se o Supabase devolver um erro,
            mostramos na própria página.
        */
        if (error) {

            console.error(
                "Erro ao redefinir senha:",
                error
            );

            mostrarMensagemRedefinicao(
                "Não foi possível redefinir a senha. Tente solicitar um novo link de recuperação.",
                "erro"
            );

            return;
        }


        /*
            Se não houve erro,
            a nova senha foi salva.
        */
        mostrarMensagemRedefinicao(
            "Senha alterada com sucesso!",
            "sucesso"
        );


        /*
            Limpa os campos depois
            da alteração.
        */
        formRedefinirSenha.reset();
    }
);