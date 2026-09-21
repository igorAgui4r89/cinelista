// =====================================================
// CINELISTA
// Controle da página de autenticação
// =====================================================


// -----------------------------------------------------
// 1. SELEÇÃO DOS ELEMENTOS DO HTML
// -----------------------------------------------------

/*
    Botão que seleciona a área de login.
*/
const btnLogin =
    document.getElementById("btn-login");


/*
    Botão que seleciona a área
    de criação de conta.
*/
const btnCadastro =
    document.getElementById("btn-cadastro");


/*
    Formulário utilizado para entrar
    em uma conta já existente.
*/
const formLogin =
    document.getElementById("form-login");


/*
    Formulário utilizado para
    criar uma nova conta.
*/
const formCadastro =
    document.getElementById("form-cadastro");


// -----------------------------------------------------
// 2. MOSTRAR FORMULÁRIO DE LOGIN
// -----------------------------------------------------

function mostrarLogin() {

    /*
        Mostra o formulário de login.
    */
    formLogin.classList.remove(
        "auth-form-oculto"
    );


    /*
        Esconde o formulário de cadastro.
    */
    formCadastro.classList.add(
        "auth-form-oculto"
    );


    /*
        Destaca visualmente a aba Entrar.
    */
    btnLogin.classList.add("ativo");


    /*
        Remove o destaque da aba Criar conta.
    */
    btnCadastro.classList.remove("ativo");
}


// -----------------------------------------------------
// 3. MOSTRAR FORMULÁRIO DE CADASTRO
// -----------------------------------------------------

function mostrarCadastro() {

    /*
        Esconde o formulário de login.
    */
    formLogin.classList.add(
        "auth-form-oculto"
    );


    /*
        Mostra o formulário de cadastro.
    */
    formCadastro.classList.remove(
        "auth-form-oculto"
    );


    /*
        Destaca visualmente a aba Criar conta.
    */
    btnCadastro.classList.add("ativo");


    /*
        Remove o destaque da aba Entrar.
    */
    btnLogin.classList.remove("ativo");
}


// -----------------------------------------------------
// 4. EVENTOS DOS BOTÕES
// -----------------------------------------------------

/*
    Ao clicar em Entrar,
    mostramos o formulário de login.
*/
btnLogin.addEventListener(
    "click",
    mostrarLogin
);


/*
    Ao clicar em Criar conta,
    mostramos o formulário de cadastro.
*/
btnCadastro.addEventListener(
    "click",
    mostrarCadastro
);


// -----------------------------------------------------
// 5. CRIAÇÃO DE CONTA NO SUPABASE
// -----------------------------------------------------

/*
    Quando o usuário envia o formulário
    de criação de conta, esta função
    é executada.
*/
formCadastro.addEventListener(
    "submit",
    async function (event) {

        /*
            Impede que o navegador
            recarregue a página.
        */
        event.preventDefault();


        // -------------------------------------------------
        // RECUPERA OS DADOS DO FORMULÁRIO
        // -------------------------------------------------

        const nome =
            document.getElementById(
                "cadastro-nome"
            ).value.trim();


        const email =
            document.getElementById(
                "cadastro-email"
            ).value.trim();


        const senha =
            document.getElementById(
                "cadastro-senha"
            ).value;


        const confirmarSenha =
            document.getElementById(
                "cadastro-confirmar-senha"
            ).value;


        // -------------------------------------------------
        // CONFERE SE AS SENHAS SÃO IGUAIS
        // -------------------------------------------------

        if (senha !== confirmarSenha) {

            alert(
                "As senhas digitadas não são iguais."
            );

            return;
        }


        // -------------------------------------------------
        // CADASTRO NO SUPABASE
        // -------------------------------------------------

        /*
            signUp() cria um novo usuário
            no Supabase Auth.

            O nome é salvo como informação
            adicional do usuário.
        */
        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: senha,

                options: {

                    data: {
                        nome: nome
                    }

                }

            });


        // -------------------------------------------------
        // TRATAMENTO DE ERRO
        // -------------------------------------------------

        if (error) {

            console.error(
                "Erro ao criar conta:",
                error
            );

            alert(
                "Não foi possível criar a conta: " +
                error.message
            );

            return;
        }


        // -------------------------------------------------
        // CADASTRO REALIZADO
        // -------------------------------------------------

        console.log(
            "Usuário criado:",
            data.user
        );


        /*
            Em projetos Supabase hospedados,
            a confirmação de e-mail costuma
            estar ativada por padrão.

            Nesse caso o usuário é criado,
            mas ainda não possui uma sessão
            até confirmar o e-mail.
        */
        if (data.session === null) {

            alert(
                "Conta criada! Verifique seu e-mail para confirmar o cadastro."
            );

        } else {

            /*
                Se a confirmação de e-mail
                estiver desativada, o usuário
                já recebe uma sessão imediatamente.
            */
            alert(
                "Conta criada com sucesso!"
            );

        }


        /*
            Limpa o formulário
            depois do cadastro.
        */
        formCadastro.reset();

    }
);