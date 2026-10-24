
const http = require("http");

const PORTA = 3000;

const servidor = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const url = new URL(req.url, `http://localhost:${PORTA}`);

    function responder(status, dados) {
        res.writeHead(status);
        res.end(JSON.stringify(dados));
    }

    // Rota inicial
    if (url.pathname === "/") {
        return responder(200, {
            mensagem: "Games Friends está funcionando!",
            status: "online"
        });
    }

    try {
        // NOVA ROTA: pesquisar jogos pelo nome
        if (url.pathname === "/api/buscar") {
            const nome = url.searchParams.get("nome")?.trim();

            if (!nome || nome.length < 2) {
                return responder(400, {
                    erro: "Digite pelo menos 2 caracteres."
                });
            }

            const endereco =
                "https://store.steampowered.com/api/storesearch/" +
                `?term=${encodeURIComponent(nome)}` +
                "&l=brazilian&cc=br";

            const resposta = await fetch(endereco);

            if (!resposta.ok) {
                return responder(502, {
                    erro: "A Steam não conseguiu responder à pesquisa."
                });
            }

            const dados = await resposta.json();

            const jogos = (dados.items || []).map(jogo => ({
                appId: jogo.id,
                nome: jogo.name,
                imagem: jogo.tiny_image,
                preco: jogo.price?.final_formatted || "Preço indisponível",
                link: `https://store.steampowered.com/app/${jogo.id}/`
            }));

            return responder(200, { jogos });
        }

        // BUSCAR OS DETALHES DE UM JOGO PELO APP ID
        if (url.pathname === "/api/jogo") {
            const appId = url.searchParams.get("appid");

            if (!appId || !/^\d+$/.test(appId)) {
                return responder(400, {
                    erro: "Informe um App ID válido."
                });
            }

            const endereco =
                "https://store.steampowered.com/api/appdetails" +
                `?appids=${appId}&l=brazilian&cc=br`;

            const resposta = await fetch(endereco);

            if (!resposta.ok) {
                return responder(502, {
                    erro: "A Steam não conseguiu responder à consulta."
                });
            }

            const dados = await resposta.json();
            const resultado = dados[appId];

            if (!resultado || !resultado.success) {
                return responder(404, {
                    erro: "Jogo não encontrado na Steam."
                });
            }

            const jogo = resultado.data;

            return responder(200, {
                appId: jogo.steam_appid,
                nome: jogo.name,
                imagem: jogo.header_image,
                descricao: jogo.short_description,
                preco: jogo.price_overview
                    ? jogo.price_overview.final_formatted
                    : "Grátis ou preço indisponível",
                link: `https://store.steampowered.com/app/${appId}/`
            });
        }

        return responder(404, {
            erro: "Rota não encontrada."
        });

    } catch (erro) {
        console.error("Erro no servidor:", erro);

        return responder(502, {
            erro: "Não foi possível consultar a Steam. Tente novamente."
        });
    }
});

servidor.listen(PORTA, () => {
    console.log(`Games Friends rodando em http://localhost:${PORTA}`);
});
