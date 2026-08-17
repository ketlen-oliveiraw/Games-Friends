const campoAppId = document.getElementById("steamAppId");
const botaoBuscar = document.getElementById("buscarSteam");
const resultadoSteam = document.getElementById("resultadoSteam");

botaoBuscar.addEventListener("click", buscarJogoSteam);


async function buscarJogoSteam() {

    const appId = campoAppId.value;

    if (!appId) {
        resultadoSteam.innerHTML = `
            <p>Digite o App ID de um jogo.</p>
        `;

        return;
    }

    resultadoSteam.innerHTML = `
        <p>Buscando jogo...</p>
    `;


    try {

        const resposta = await fetch(
            `https://store.steampowered.com/api/appdetails?appids=${appId}&l=brazilian`
        );

        const dados = await resposta.json();

        const jogo = dados[appId];

        if (!jogo || !jogo.success) {

            resultadoSteam.innerHTML = `
                <p>Jogo não encontrado.</p>
            `;

            return;
        }

        mostrarJogo(jogo.data);

    } catch (erro) {

        console.error(erro);

        resultadoSteam.innerHTML = `
            <p>Não foi possível buscar o jogo.</p>
        `;
    }
}

function mostrarJogo(jogo) {

    let preco = "Grátis";

    if (jogo.price_overview) {
        preco = jogo.price_overview.final_formatted;
    }

    resultadoSteam.innerHTML = `

        <div class="resultado-jogo">

            <img
                src="${jogo.header_image}"
                alt="Capa de ${jogo.name}"
            >

            <div class="dados-jogo">

                <h3>${jogo.name}</h3>

                <p>${preco}</p>

                <button onclick='adicionarJogo(${JSON.stringify(jogo)})'>
                    Adicionar ao GG Hub
                </button>

            </div>

        </div>

    `;
}

function adicionarJogo(jogo) {

    const listaJogos = document.getElementById("listaJogos");

    let preco = "Grátis";

    if (jogo.price_overview) {
        preco = jogo.price_overview.final_formatted;
    }


    const card = document.createElement("article");

    card.classList.add("card-jogo");


    card.innerHTML = `

        <div class="capa-jogo">

            <img
                src="${jogo.header_image}"
                alt="Capa de ${jogo.name}"
            >

        </div>


        <div class="info-jogo">

            <h2>${jogo.name}</h2>

            <p class="preco">
                💰 ${preco}
            </p>


            <div class="possui">

                <p>Quem possui:</p>

                <ul>

                    <li class="possui-jogo">
                        Ketlen
                    </li>

                    <li class="possui-jogo">
                        João
                    </li>

                    <li class="nao-possui-jogo">
                        Lucas
                    </li>

                </ul>

            </div>


            <button class="btn-detalhes">
                Ver detalhes
            </button>

        </div>

    `;


    listaJogos.appendChild(card);
}