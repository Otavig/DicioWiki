const btn_pesquisar = document.getElementById("btn_pesquisar");
const inputPesquisa = document.getElementById("inputPesquisa");
const saida = document.getElementById("resultados");
const randomBtn = document.getElementById("btn_sortear");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function hide() {
    document.getElementById("saidaResultados").classList.add("none");
}

randomBtn.addEventListener("click", realizarPesquisaRandom);

async function realizarPesquisaRandom() {
    try {
        const apiUrl = `http://localhost:3000/random`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
            throw new Error("Falha na requisição da palavra aleatória. Por favor, tente novamente.");
        }

        const json = await res.json();

        if (json.word) {
            // Pesquisa a palavra aleatória
            inputPesquisa.value = json.word;
            realizarPesquisa();
        } else {
            throw new Error("Palavra aleatória não encontrada.");
        }
    } catch (error) {
        console.error(error);
        saida.innerHTML = `<h1>Opa, algum erro ocorreu!</h1>`;
        document.getElementById("saidaResultados").classList.remove("none");
    }
}

btn_pesquisar.addEventListener("click", realizarPesquisa);
inputPesquisa.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        realizarPesquisa();
    }
});

async function realizarPesquisa() {
    try {
        let pesquisa = inputPesquisa.value.toLowerCase();

        const apiUrl = `http://localhost:3000/search/${pesquisa}`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
            throw new Error("Falha na requisição. Por favor, tente novamente.");
        }

        const json = await res.json();

        if (json.length > 0) {
            const resultado = json[0];

            const { orth, gramGrp, def } = extractDefinition(resultado.xml);

            const html = `
                <h1 class="">${capitalizeFirstLetter(orth)}</h1>
                <h6 class="">Definições para ${capitalizeFirstLetter(orth)}</h6>
                <hr class="my-4">
                <p class="lead">${gramGrp}</p>
                <p class="lead">${def}</p>
            `;

            saida.innerHTML = html;
            document.getElementById("saidaResultados").classList.remove("none");
            inputPesquisa.value = "";
        } else {
            throw new Error("Nenhum resultado encontrado.");
        }
    } catch (error) {
        console.error(error);
        saida.innerHTML = `<h1>Opa, algum erro ocorreu!</h1>`;
        document.getElementById("saidaResultados").classList.remove("none");
    }
}

function extractDefinition(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const entry = xmlDoc.querySelector('entry');
    const orth = entry.querySelector('orth').textContent;
    const gramGrp = entry.querySelector('gramGrp').textContent;
    const def = entry.querySelector('def').textContent;

    return {
        orth,
        gramGrp,
        def
    };
}
