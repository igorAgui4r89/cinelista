// =====================================================
// SUPABASE
// Configuração da conexão do CineLista com o Supabase
// =====================================================

const SUPABASE_URL =
    "https://fnkjwvgpkualklkytdgn.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_FtNDg7AGLBdKP_-yU_ZLBA_9sFysBbl";


/*
    Cria o cliente Supabase.
*/
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/*
    Teste temporário da conexão.
*/
console.log(
    "Cliente Supabase criado:",
    supabaseClient
);