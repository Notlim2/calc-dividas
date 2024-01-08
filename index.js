let indice = 0;
const participantes = [];
const VALOR_VITORIA = 0.5;

function atualizarParticipantes() {
  if (!participantes?.length) {
    return;
  }

  const tableParticipantes = document.getElementById("participantes");
  const tbodyParticipantes = tableParticipantes.tBodies[0];
  tbodyParticipantes.innerHTML = "";
  for (const p of participantes) {
    const { nome, vitorias } = p;
    tbodyParticipantes.innerHTML += `
      <tr>
        <td>${nome}</td>
        <td>${vitorias}</td>
      </tr>`;
  }
}

function cadastrar(e) {
  e.preventDefault();
  const divNome = document.getElementById("nome");
  const divVitoria = document.getElementById("vitorias");
  const nome = divNome.value;
  const vitorias = divVitoria.value;

  indice++;
  participantes.push({ id: indice, nome, vitorias });

  divNome.value = "";
  divVitoria.value = "";
  divNome.focus();

  atualizarParticipantes();
}

function idCrescente(id1, id2) {
  return id1 > id2 ? 1 : -1;
}

function atualizarResultado(dividas) {
  if (!dividas?.length) {
    return;
  }

  const divResultado = document.getElementById("resultado");
  divResultado.innerHTML = "";

  for (const divida of dividas) {
    const participanteDevedor = participantes.find(
      (p) => p.id === divida.ids.idDevedor
    );
    const participanteRecebedor = participantes.find(
      (p) => p.id === divida.ids.idRecebedor
    );
    const isNegative = divida.valor < 0;
    divResultado.innerHTML += `
      <div>
        ${isNegative ? participanteRecebedor.nome : participanteDevedor.nome}
        paga ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Math.abs(divida.valor))}
        para ${
          isNegative ? participanteDevedor.nome : participanteRecebedor.nome
        }
      </div>
    `;
  }
}

function calcular() {
  const dividas = [];
  for (const devedor of participantes) {
    for (const recebedor of participantes) {
      if (devedor.id !== recebedor.id) {
        if (
          !dividas
            .map((d) => JSON.stringify(Object.values(d.ids).sort(idCrescente)))
            .includes(
              JSON.stringify([devedor.id, recebedor.id].sort(idCrescente))
            )
        ) {
          dividas.push({
            ids: { idDevedor: devedor.id, idRecebedor: recebedor.id },
            valor: VALOR_VITORIA * recebedor.vitorias,
          });
        } else {
          const divida = dividas.find(
            (d) =>
              JSON.stringify(Object.values(d.ids).sort(idCrescente)) ===
              JSON.stringify([devedor.id, recebedor.id].sort(idCrescente))
          );
          divida.valor -= VALOR_VITORIA * recebedor.vitorias;
        }
      }
    }
  }
  atualizarResultado(dividas);
}
