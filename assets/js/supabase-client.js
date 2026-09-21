// =====================================================
// SUPABASE
// Configuração da conexão do CineLista com o Supabase
// =====================================================

const SUPABASE_URL =
    "https://xxxxxxxxxxxxxxxxxxxx.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_xxxxxxxxxxxxxxxxx";


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