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

/*
    Área da página onde exibiremos
    mensagens de sucesso ou erro.
*/
const authMensagem =
    document.getElementById("auth-mensagem");

/*
    Botão usado para solicitar
    a recuperação de senha.
*/
const btnRecuperarSenha =
    document.getElementById(
        "btn-recuperar-senha"
    );



// -----------------------------------------------------
// MENSAGENS DE AUTENTICAÇÃO
// -----------------------------------------------------

/*
    Exibe uma mensagem dentro
    da própria página de login.

    Recebemos:
    - texto: aquilo que será mostrado;
    - tipo: "sucesso" ou "erro".
*/
function mostrarMensagem(texto, tipo) {

    /*
        Coloca o texto dentro
        do elemento <p>.
    */
    authMensagem.textContent =
        texto;


    /*
        Primeiro removemos qualquer
        estilo de mensagem anterior.
    */
    authMensagem.classList.remove(
        "sucesso",
        "erro"
    );


    /*
        Depois adicionamos a classe
        correspondente ao tipo recebido.
    */
    authMensagem.classList.add(
        tipo
    );
}








// -----------------------------------------------------
// 2. MOSTRAR FORMULÁRIO DE LOGIN
// -----------------------------------------------------

function mostrarLogin() {

    limparMensagem();

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


    limparMensagem();


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
// LIMPAR MENSAGEM DE AUTENTICAÇÃO
// -----------------------------------------------------

/*
    Remove qualquer mensagem exibida
    anteriormente na página.
*/
function limparMensagem() {

    /*
        Remove o texto.
    */
    authMensagem.textContent = "";


    /*
        Remove também as classes visuais
        usadas para sucesso ou erro.
    */
    authMensagem.classList.remove(
        "sucesso",
        "erro"
    );
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
// RECUPERAÇÃO DE SENHA
// -----------------------------------------------------

/*
    Ao clicar em "Esqueci minha senha",
    usamos o e-mail já digitado no
    formulário de login.
*/
btnRecuperarSenha.addEventListener(
    "click",
    async function () {

        /*
            Recupera o e-mail digitado.
        */
        const email =
            document
                .getElementById("login-email")
                .value
                .trim();


        /*
            Se o usuário ainda não digitou
            um e-mail, pedimos que informe.
        */
        if (!email) {

            mostrarMensagem(
                "Digite seu e-mail para recuperar a senha.",
                "erro"
            );

            return;
        }


        /*
            Solicita ao Supabase
            o envio do e-mail de recuperação.

            Depois, o link levará o usuário
            para uma página que ainda vamos criar.
        */
        const { error } =
            await supabaseClient.auth
                .resetPasswordForEmail(
                    email,
                    {
                        redirectTo:
                            `${window.location.origin}/redefinir-senha.html`
                    }
                );


        /*
            Se ocorrer algum erro,
            mostramos na própria página.
        */
        if (error) {

            console.error(
                "Erro ao solicitar recuperação de senha:",
                error
            );

            mostrarMensagem(
                "Não foi possível enviar o e-mail de recuperação.",
                "erro"
            );

            return;
        }


        /*
            Por segurança, mostramos uma mensagem
            neutra, independentemente de existir
            ou não uma conta com esse e-mail.
        */
        mostrarMensagem(
            "Se houver uma conta associada a esse e-mail, você receberá as instruções para redefinir a senha.",
            "sucesso"
        );
    }
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


/*
    Antes de enviar o cadastro,
    verificamos se as duas senhas
    digitadas são iguais.
*/
if (senha !== confirmarSenha) {

    mostrarMensagem(
        "As senhas digitadas não são iguais.",
        "erro"
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

    /*
        Mostra o erro dentro
        da própria página.
    */
    mostrarMensagem(
        "Não foi possível criar a conta: " +
        error.message,
        "erro"
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
/*
    Se não existe sessão imediatamente após
    o cadastro, significa que o usuário ainda
    precisa confirmar o e-mail.
*/
if (data.session === null) {

    mostrarMensagem(
        "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
        "sucesso"
    );

} else {

    mostrarMensagem(
        "Conta criada com sucesso!",
        "sucesso"
    );
}


        /*
            Limpa o formulário
            depois do cadastro.
        */
        formCadastro.reset();

    }
);


// -----------------------------------------------------
// 6. LOGIN COM E-MAIL E SENHA
// -----------------------------------------------------

/*
    Quando o usuário envia o formulário
    de login, esta função é executada.
*/
formLogin.addEventListener(
    "submit",
    async function (event) {

        /*
            Impede que a página
            seja recarregada.
        */
        event.preventDefault();


        // -------------------------------------------------
        // RECUPERA OS DADOS DO FORMULÁRIO
        // -------------------------------------------------

        const email =
            document.getElementById(
                "login-email"
            ).value.trim();


        const senha =
            document.getElementById(
                "login-senha"
            ).value;


        // -------------------------------------------------
        // LOGIN NO SUPABASE
        // -------------------------------------------------

        /*
            signInWithPassword() verifica
            o e-mail e a senha no Supabase.
        */
        const { data, error } =
            await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: senha

                });


        // -------------------------------------------------
        // TRATAMENTO DE ERRO
        // -------------------------------------------------

if (error) {

    console.error(
        "Erro ao entrar:",
        error
    );

    /*
        Mostra o erro dentro
        da própria página.
    */
    mostrarMensagem(
        "Não foi possível entrar. Verifique seu e-mail e sua senha.",
        "erro"
    );

    return;
}
        // -------------------------------------------------
        // LOGIN REALIZADO
        // -------------------------------------------------

        console.log(
            "Login realizado:",
            data.user
        );


        /*
            Depois que o login dá certo,
            enviamos o usuário para
            a página principal do CineLista.
        */
        window.location.href =
            "index.html";

    }
);