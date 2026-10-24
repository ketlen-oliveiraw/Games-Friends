
const campoNome = document.getElementById("pesquisaNome");
const botaoNome = document.getElementById("buscarPorNome");
const resultadosNome = document.getElementById("resultadosPesquisa");

const campoAppId = document.getElementById("steamAppId");
const botaoAppId = document.getElementById("buscarSteam");
const resultadoSteam = document.getElementById("resultadoSteam");

let jogosSalvos = carregarJogosSalvos();

botaoNome.addEventListener("click", buscarPorNome);

campoNome.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        buscarPorNome();
    }
});

async function buscarPorNome() {
    const nome = campoNome.value.trim();

    if (nome.length < 2) {
        resultadosNome.textContent = "Digite pelo menos 2 letras.";
        return;
    }

    resultadosNome.textContent = "Pesquisando jogos na Steam...";

    try {
        const resposta = await fetch(
            `http://localhost:3000/api/buscar?nome=${encodeURIComponent(nome)}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            resultadosNome.textContent =
                dados.erro || "Não foi possível pesquisar.";
            return;
        }

        mostrarResultados(dados.jogos || []);
    } catch (erro) {
        console.error(erro);
        resultadosNome.textContent =
            "Não foi possível conectar ao servidor. Confira se ele está ligado.";
    }
}

function mostrarResultados(jogos) {
    resultadosNome.replaceChildren();

    if (jogos.length === 0) {
        resultadosNome.textContent = "Nenhum jogo encontrado.";
        return;
    }

    jogos.forEach((jogo) => {
        const card = document.createElement("article");
        card.className = "resultado-jogo";

        const imagem = document.createElement("img");
        imagem.src = jogo.imagem;
        imagem.alt = `Capa de ${jogo.nome}`;
        imagem.loading = "lazy";

        const informacoes = document.createElement("div");
        informacoes.className = "dados-jogo";

        const titulo = document.createElement("h3");
        titulo.textContent = jogo.nome;

        const preco = document.createElement("p");
        preco.textContent = jogo.preco || "Preço indisponível";

        const link = document.createElement("a");
        link.href = jogo.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Ver na Steam";

        const botaoAdicionar = document.createElement("button");
        botaoAdicionar.textContent = "Adicionar à lista";
        botaoAdicionar.addEventListener("click", () => {
            adicionarJogo(jogo);
        });

        informacoes.append(titulo, preco, link, botaoAdicionar);
        card.append(imagem, informacoes);
        resultadosNome.append(card);
    });
}

async function adicionarJogo(jogo) {
    const listaJogos = document.getElementById("listaJogos");

if (jogoJaExiste(jogosSalvos, jogo.appId)) {
    alert("Esse jogo já está na lista!");
    return;
}

    if (!listaJogos) {
        alert("Não encontrei a área do catálogo no HTML.");
        return;
    }

    const botao = [...resultadosNome.querySelectorAll("button")]
        .find((item) => item.dataset.appid === String(jogo.appId));

    try {
        const resposta = await fetch(
            `http://localhost:3000/api/jogo?appid=${jogo.appId}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || "Não foi possível carregar os detalhes.");
            return;
        }

        const card = document.createElement("article");
        card.className = "card-jogo";
        card.dataset.appid = String(dados.appId);

        const imagem = document.createElement("img");
        imagem.src = dados.imagem;
        imagem.alt = `Capa de ${dados.nome}`;

        const titulo = document.createElement("h2");
        titulo.textContent = dados.nome;

        const preco = document.createElement("p");
        preco.className = "preco";
        preco.textContent = dados.preco;

        const link = document.createElement("a");
        link.href = dados.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Ver na Steam";

        card.append(imagem, titulo, preco, link);
        listaJogos.append(card);

const jogoSalvo = {
    appId: String(dados.appId),
    nome: dados.nome,
    imagem: dados.imagem,
    preco: dados.preco
};

if (!jogoJaExiste(jogosSalvos, jogoSalvo.appId)) {
    jogosSalvos.push(jogoSalvo);
    salvarJogos(jogosSalvos);
}

        if (botao) {
            botao.textContent = "Adicionado";
            botao.disabled = true;
        }
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível adicionar o jogo. Confira o servidor.");
    }
}

// Mantém a pesquisa temporária por App ID.
if (botaoAppId) {
    botaoAppId.addEventListener("click", buscarPorAppId);
}

async function buscarPorAppId() {
    const appId = campoAppId.value.trim();

    if (!appId) {
        resultadoSteam.textContent = "Digite o App ID de um jogo.";
        return;
    }

    resultadoSteam.textContent = "Buscando jogo...";

    try {
        const resposta = await fetch(
            `http://localhost:3000/api/jogo?appid=${encodeURIComponent(appId)}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            resultadoSteam.textContent =
                dados.erro || "Não foi possível buscar o jogo.";
            return;
        }

        resultadoSteam.replaceChildren();

        const titulo = document.createElement("h3");
        titulo.textContent = dados.nome;

        const imagem = document.createElement("img");
        imagem.src = dados.imagem;
        imagem.alt = `Capa de ${dados.nome}`;

        const preco = document.createElement("p");
        preco.textContent = dados.preco;

        resultadoSteam.append(imagem, titulo, preco);
    } catch (erro) {
        console.error(erro);
        resultadoSteam.textContent = "Não foi possível conectar ao servidor.";
    }
}

function carregarCatalogoSalvo() {
    const listaJogos = document.getElementById("listaJogos");

    if (!listaJogos) return;

    listaJogos.replaceChildren();

    jogosSalvos.forEach((jogo) => {
        const card = document.createElement("article");
        card.className = "card-jogo";
        card.dataset.appid = String(jogo.appId);

        const imagem = document.createElement("img");
        imagem.src = jogo.imagem;
        imagem.alt = `Capa de ${jogo.nome}`;

        const titulo = document.createElement("h2");
        titulo.textContent = jogo.nome;

        const preco = document.createElement("p");
        preco.className = "preco";
        preco.textContent = jogo.preco;

        const link = document.createElement("a");
        link.href = `https://store.steampowered.com/app/${jogo.appId}/`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Ver na Steam";

        card.append(imagem, titulo, preco, link);
        listaJogos.append(card);
    });
}

    carregarCatalogoSalvo();