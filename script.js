
Postada por FAGNER DOS SANTOS
FAGNER DOS SANTOS
Criado em: 13:2213:22
// ==========================================
// 1. VARIÁVEIS (Estado do Jogo)
// ==========================================
let pontos = 0;
let placarTimeA = 0;
let placarTimeB = 0;
let bolaEmJogo = true;
let bolaLevantada = false; // Controle que impede atacar sem antes levantar

// ==========================================
// 2. FUNÇÃO DE RODÍZIO (Lógica de Troca)
// ==========================================
function fazerRodizio() {
// Pega os nomes atuais de cada campo na quadra
const p1 = document.getElementById("pos1").value;
const p2 = document.getElementById("pos2").value;
const p3 = document.getElementById("pos3").value;
const p4 = document.getElementById("pos4").value;
const p5 = document.getElementById("pos5").value;
const p6 = document.getElementById("pos6").value;

// Rotação oficial de vôlei (sentido horário)
document.getElementById("pos1").value = p2;
document.getElementById("pos6").value = p1;
document.getElementById("pos5").value = p6;
document.getElementById("pos4").value = p5;
document.getElementById("pos3").value = p4;
document.getElementById("pos2").value = p3;

// Reseta a condição do levantamento no rodízio
bolaLevantada = false;

document.getElementById("resultado").innerHTML =
"🔄 Rodízio realizado! O novo sacador (Posição 1) é: <b>" + p2 + "</b>!";
}

// ==========================================
// 3. FUNÇÕES DE AÇÕES DAS JOGADAS (DOM)
// ==========================================
function sacar() {
bolaLevantada = false; // Reinicia a sequência de ataque
const sacador = document.getElementById("pos1").value;
document.getElementById("resultado").innerHTML = "🏐 Saque realizado por <b>" + sacador + "</b>!";
}

function defender() {
document.getElementById("resultado").innerHTML = "👏 Defesa realizada com sucesso! Agora preparem o levantamento.";
}

function levantar() {
// Pega o nome do jogador na Posição 3 (Levantador)
const levantador = document.getElementById("pos3").value;

// Ativa a permissão para que o ataque ocorra
bolaLevantada = true;

document.getElementById("resultado").innerHTML =
"🎯 Levantamento perfeito feito por <b>" + levantador + "</b> (Posição 3)! Bola pronta para o ATAQUE!";
}

function atacar() {
// REGRA DE VALIDAÇÃO: Verifica se houve levantamento prévio
if (!bolaLevantada) {
document.getElementById("resultado").innerHTML =
"⚠️ <b>Ataque não permitido!</b> É necessário realizar um <b>Levantamento</b> antes de atacar!";
return; // Interrompe a função
}

// Consome a bola levantada (precisará de outro levantamento no próximo ponto)
bolaLevantada = false;

pontos++;

document.getElementById("resultado").innerHTML = "🔥 Ataque potente no chão! Ponto para sua equipe!";

const elementoPlacar = document.getElementById("placar");
if (elementoPlacar) {
elementoPlacar.innerHTML = "Placar: " + pontos;
}

registrarPonto("A");
}

function bloquear() {
document.getElementById("resultado").innerHTML = "🛡️ Bloqueio realizado!";
}

// ==========================================
// 4. REGRAS DE NEGÓCIO E LÓGICA DA PARTIDA
// ==========================================
function registrarPonto(timeVencedor) {
if (!bolaEmJogo) return;

if (timeVencedor === "A") {
placarTimeA++;
console.log("Ponto para o Time A!");
// Faz o rodízio automaticamente ao marcar ponto
fazerRodizio();
} else {
placarTimeB++;
console.log("Ponto para o Time B!");
}

verificarFimDeSet();
}

function verificarFimDeSet() {
if (placarTimeA >= 5) {
console.log("Fim do Set! Time A venceu!");
document.getElementById("resultado").innerHTML = "🏆 Fim do Set! Sua equipe venceu!";
bolaEmJogo = false;
} else if (placarTimeB >= 5) {
console.log("Fim do Set! Time B venceu!");
bolaEmJogo = false;
}
}