
const CHAVE_JOGOS = "games-friends-jogos";

function carregarJogosSalvos() {
    try {
        const dados = localStorage.getItem(CHAVE_JOGOS);
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao carregar os jogos:", erro);
        return [];
    }
}

function salvarJogos(jogos) {
    try {
        localStorage.setItem(CHAVE_JOGOS, JSON.stringify(jogos));
        return true;
    } catch (erro) {
        console.error("Erro ao salvar os jogos:", erro);
        return false;
    }
}

function jogoJaExiste(jogos, appId) {
    return jogos.some(jogo => String(jogo.appId) === String(appId));
}
