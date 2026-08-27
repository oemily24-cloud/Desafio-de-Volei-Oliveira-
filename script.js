
// Postado por FAGNER DOS SANTOS
// FAGNER DOS SANTOS
// Criado em: 13:2213:22
// ==========================================
// 1. VARIÁVEIS (Estado do Jogo)
// ==========================================
let pontos = 0;
let pontosAdversario = 0;
let placarTimeA = 0;
let placarTimeB = 0;
let numeroSet = 1;
let sequencia = 0;
let bolaEmJogo = true;
let etapaRally = "saque";
let posicaoBola = "a-pos1";
let audioContext;
let modoDoisJogadores = false;

function tocarApito(tipo = "curto") {
const AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) return;
audioContext = audioContext || new AudioContext();
if (audioContext.state === "suspended") audioContext.resume();

const agora = audioContext.currentTime;
const oscilador = audioContext.createOscillator();
const volume = audioContext.createGain();
oscilador.type = "square";
oscilador.frequency.setValueAtTime(tipo === "ponto" ? 1200 : 1800, agora);
volume.gain.setValueAtTime(0.0001, agora);
volume.gain.exponentialRampToValueAtTime(0.16, agora + 0.02);
volume.gain.exponentialRampToValueAtTime(0.0001, agora + (tipo === "ponto" ? 0.45 : 0.2));
oscilador.connect(volume).connect(audioContext.destination);
oscilador.start(agora);
oscilador.stop(agora + (tipo === "ponto" ? 0.45 : 0.2));
}

function moverBola(destino, texto) {
const bola = document.getElementById("bola");
const origem = document.getElementById(posicaoBola);
const alvo = document.getElementById(destino);
const quadra = document.querySelector(".quadra");
if (!bola || !alvo || !quadra) return;

const quadraRect = quadra.getBoundingClientRect();
const alvoRect = alvo.getBoundingClientRect();
bola.style.left = `${alvoRect.left - quadraRect.left + alvoRect.width / 2}px`;
bola.style.top = `${alvoRect.top - quadraRect.top + alvoRect.height / 2}px`;
bola.classList.remove("voando");
void bola.offsetWidth;
bola.classList.add("voando");
document.querySelectorAll(".posicao").forEach((posicao) => posicao.classList.remove("ativo"));
alvo.classList.add("ativo");
document.getElementById("status-jogo").textContent = texto;
posicaoBola = destino;
}

function atualizarControles() {
const etapas = ["saque", "defesa", "levantamento", "ataque", "bloqueio"];
const nomes = {
saque: "Faça o saque para iniciar o rally.",
defesa: "Receba o saque com uma defesa.",
levantamento: "Boa defesa! Faça o levantamento.",
ataque: "Bola levantada! Escolha ataque ou bloqueio.",
bloqueio: "Ataque adversário! Tente o bloqueio."
};
const donos = { saque: "jogador1", defesa: "jogador2", levantamento: "jogador1", ataque: "jogador1", bloqueio: "jogador2" };
document.querySelectorAll("button").forEach((botao) => {
	botao.disabled = ["btn-rodizio", "btn-novo-jogo", "btn-modo"].indexOf(botao.id) === -1 && !etapas.includes(etapaRally);
});
document.getElementById("btn-saque").disabled = etapaRally !== "saque";
document.getElementById("btn-defesa").disabled = etapaRally !== "defesa";
document.getElementById("btn-levantamento").disabled = etapaRally !== "levantamento";
document.getElementById("btn-ataque").disabled = etapaRally !== "ataque" || (modoDoisJogadores && donos.ataque !== "jogador1");
document.getElementById("btn-bloqueio").disabled = etapaRally !== "ataque" || (modoDoisJogadores && donos.bloqueio !== "jogador2");
document.getElementById("btn-rodizio").disabled = etapaRally !== "fim";
document.getElementById("btn-novo-jogo").disabled = false;
document.getElementById("btn-modo").disabled = false;
if (modoDoisJogadores && etapaRally === "ataque") {
	document.getElementById("instrucao-jogada").textContent = "Jogador 1: ataque | Jogador 2: bloqueio";
} else if (modoDoisJogadores && donos[etapaRally]) {
	const jogador = donos[etapaRally] === "jogador1" ? "Jogador 1" : "Jogador 2";
	document.getElementById("instrucao-jogada").textContent = `${jogador}: ${nomes[etapaRally]}`;
} else {
	document.getElementById("instrucao-jogada").textContent = nomes[etapaRally] || "Rally encerrado.";
}
document.getElementById("placar").textContent = `Set ${numeroSet} | Pontos: ${pontos} x ${pontosAdversario} | Sets: ${placarTimeA} x ${placarTimeB}`;
}

function alternarModo() {
modoDoisJogadores = !modoDoisJogadores;
document.getElementById("modo-atual").textContent = modoDoisJogadores ? "Modo: 2 jogadores" : "Modo: 1 jogador";
document.getElementById("btn-modo").textContent = modoDoisJogadores ? "Jogar sozinho" : "Jogar em dupla";
document.getElementById("status-jogo").textContent = modoDoisJogadores ? "Jogador 1 e Jogador 2: cooperem para vencer o campeonato!" : "Modo individual ativado.";
atualizarControles();
}

function avisarEtapa(etapaNecessaria) {
if (etapaRally === etapaNecessaria) return true;
const nomes = { saque: "saque", defesa: "defesa", levantamento: "levantamento", ataque: "ataque ou bloqueio" };
document.getElementById("resultado").innerHTML = `⚠️ Agora faça o <b>${nomes[etapaRally] || "próximo lance"}</b>.`;
tocarApito();
return false;
}

function encerrarRally(mensagem, vencedor = true) {
if (vencedor) {
	pontos++;
	sequencia++;
	tocarApito("ponto");
} else {
	pontosAdversario++;
	sequencia = 0;
	tocarApito("ponto");
}
document.getElementById("resultado").innerHTML = mensagem;
bolaEmJogo = false;
etapaRally = "fim";
atualizarControles();
setTimeout(() => {
	const venceuSet = pontos >= 15 && pontos - pontosAdversario >= 2;
	const perdeuSet = pontosAdversario >= 15 && pontosAdversario - pontos >= 2;
	if (venceuSet || perdeuSet) {
		if (venceuSet) placarTimeA++;
		else placarTimeB++;
		if (placarTimeA >= 2 || placarTimeB >= 2) {
			bolaEmJogo = false;
			etapaRally = "fim";
			atualizarControles();
			document.getElementById("resultado").innerHTML = placarTimeA >= 2 ? "🏆 Campeonato vencido! Sua equipe dominou a quadra!" : "😅 O adversário venceu o campeonato. Tente novamente!";
			return;
		}
		numeroSet++;
		pontos = 0;
		pontosAdversario = 0;
		sequencia = 0;
		document.getElementById("resultado").innerHTML = venceuSet ? `🏅 Sua equipe venceu o set ${numeroSet - 1}! Começando o próximo.` : `🏐 O adversário venceu o set ${numeroSet - 1}. Ainda dá para virar!`;
	}
	bolaEmJogo = true;
	fazerRodizio();
}, 850);
}

// ==========================================
// 2. FUNÇÃO DE RODÍZIO (Lógica de Troca)
// ==========================================
function fazerRodizio() {
// Pega os nomes atuais de cada campo na quadra
const p1 = document.getElementById("a-pos1").value;
const p2 = document.getElementById("a-pos2").value;
const p3 = document.getElementById("a-pos3").value;
const p4 = document.getElementById("a-pos4").value;
const p5 = document.getElementById("a-pos5").value;
const p6 = document.getElementById("a-pos6").value;

// Rotação oficial de vôlei (sentido horário)
document.getElementById("a-pos1").value = p2;
document.getElementById("a-pos6").value = p1;
document.getElementById("a-pos5").value = p6;
document.getElementById("a-pos4").value = p5;
document.getElementById("a-pos3").value = p4;
document.getElementById("a-pos2").value = p3;

tocarApito();
etapaRally = "saque";
bolaEmJogo = true;
moverBola("a-pos1", "Rodízio concluído. A bola voltou para o novo sacador!");
atualizarControles();

document.getElementById("resultado").innerHTML =
"🔄 Rodízio realizado! O novo sacador do Time A (Posição 1) é: <b>" + p2 + "</b>!";
}

function novoJogo() {
pontos = 0;
pontosAdversario = 0;
placarTimeA = 0;
placarTimeB = 0;
numeroSet = 1;
sequencia = 0;
bolaEmJogo = true;
etapaRally = "saque";
document.getElementById("resultado").textContent = "Novo campeonato! Prepare o primeiro saque.";
atualizarControles();
moverBola("a-pos1", "A bola está pronta na posição 1 do Time A. Faça o saque!");
}

// ==========================================
// 3. FUNÇÕES DE AÇÕES DAS JOGADAS (DOM)
// ==========================================
function sacar() {
if (!avisarEtapa("saque")) return;
const sacador = document.getElementById("a-pos1").value;
tocarApito();
moverBola("b-pos5", `${sacador} sacou! O Time B recebe na posição 5.`);
document.getElementById("resultado").innerHTML = "🏐 Saque realizado por <b>" + sacador + "</b>!";
etapaRally = "defesa";
atualizarControles();
}

function defender() {
if (!avisarEtapa("defesa")) return;
tocarApito();
moverBola("a-pos3", "Defesa feita! A bola voltou para o levantador do Time A.");
document.getElementById("resultado").innerHTML = "👏 Defesa realizada com sucesso! Agora preparem o levantamento.";
etapaRally = "levantamento";
atualizarControles();
}

function levantar() {
// Pega o nome do jogador na Posição 3 (Levantador)
const levantador = document.getElementById("a-pos3").value;

if (!avisarEtapa("levantamento")) return;
tocarApito();
moverBola("a-pos3", "Levantamento pronto! Escolha ataque ou bloqueio na rede.");

document.getElementById("resultado").innerHTML =
"🎯 Levantamento perfeito feito por <b>" + levantador + "</b> (Posição 3)! Bola pronta para o ATAQUE!";
etapaRally = "ataque";
atualizarControles();
}

function atacar() {
if (!avisarEtapa("ataque")) return;
moverBola("b-pos4", "Ataque do Time A cruzou a rede! Ponto em disputa.");
const chanceErro = Math.min(0.28, 0.08 + sequencia * 0.025);
if (Math.random() < chanceErro) {
	encerrarRally("😬 Ataque para fora! O adversário ganhou o ponto.", false);
} else {
	encerrarRally("🔥 Ataque potente no chão! Ponto para sua equipe!");
}
}

function bloquear() {
if (!avisarEtapa("ataque")) return;
tocarApito();
moverBola("b-pos2", "Bloqueio na rede! A bola foi devolvida pela posição 2 do Time B.");
encerrarRally("🛡️ Bloqueio perfeito! Ponto para sua equipe!");
}

atualizarControles();
moverBola("a-pos1", "A bola está pronta na posição 1 do Time A. Faça o saque!");