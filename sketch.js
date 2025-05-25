let gotas = [];
// Aumentado o tamanho do texto "TE AMO"
let tamanhoTexto = 24; // Antes era 16, agora 24 para ser maior
let corTexto = [255, 105, 180]; // Rosa choque para o texto (RGB)

// NOVAS CORES BASE PARA O CORAÇÃO PRINCIPAL
let corCoracaoBase1 = [0, 100, 255]; // Azul
let corCoracaoBase2 = [150, 0, 200]; // Roxo
let corCoracao = []; // Será dinamicamente atualizada entre azul e roxo

let coracaoPiscando = false;
let tempoPiscando = 0;
let duracaoPiscar = 200; // ms

// --- Variáveis para a explosão ---
let particulasExplosao = [];
let maxParticulasExplosao = 150; // Quantidade de "TE AMO" na explosão
let velocidadeExplosaoMin = 5;
let velocidadeExplosaoMax = 20;
// TEMPO DE VIDA DA PARTÍCULA DA EXPLOSÃO REDUZIDO PARA 2.5 SEGUNDOS
let tempoVidaParticula = 150; // Antes era 300, agora 150 (para 2.5 segundos)

// CORES PARA AS PARTÍCULAS DA EXPLOSÃO E CORAÇÕES CAINDO (Azul, Roxo, Rosa)
// Cores ajustadas para serem um pouco mais escuras e vibrantes
const coresExplosao = [
    [220, 50, 150],   // Rosa mais escuro e vibrante
    [100, 0, 150],    // Roxo mais escuro e vibrante
    [0, 100, 200]     // Azul mais escuro e vibrante
];

// --- NOVAS VARIÁVEIS PARA A MENSAGEM SUPERIOR ---
let mensagemSuperior = "PARABÉNS AOS NOSSOS 5 MESES";
let corMensagemSuperior = [0, 255, 255]; // Ciano vibrante
let tamanhoMensagemSuperior = 40; // Tamanho do texto da mensagem

// --- NOVAS VARIÁVEIS PARA OS CORAÇÕES CAINDO ---
let coracoesCaindo = []; // Array para armazenar os corações que caem
let numCoracoesCaindo = 80; // Quantidade de corações caindo (ajuste conforme a densidade desejada)

// Aumentado o número de colunas de texto para manter a densidade mesmo com o texto maior
let numColunas = 450; // Mantido em 450, mas com texto maior, a densidade visual aumenta.


function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(60);

    // Inicializa as "gotas" de texto
    for (let i = 0; i < numColunas; i++) {
        gotas.push(new Gota(i * (width / numColunas)));
    }

    // Inicializa os corações caindo
    for (let i = 0; i < numCoracoesCaindo; i++) {
        coracoesCaindo.push(new HeartGota(random(width))); // Corações começam em posições X aleatórias
    }
}

function draw() {
    // Fundo semi-transparente para o rastro geral.
    // Aumentado para 60 para reduzir o rastro nos corações caindo.
    background(0, 60); // Antes era 40

    // ATUALIZA A COR DO CORAÇÃO PRINCIPAL DINAMICAMENTE
    // O fator lerpFactor oscila suavemente entre 0 e 1
    let lerpFactor = (sin(frameCount * 0.03) + 1) / 2; // Mais lento para transição suave
    let interpolatedColor = lerpColor(color(corCoracaoBase1[0], corCoracaoBase1[1], corCoracaoBase1[2]), color(corCoracaoBase2[0], corCoracaoBase2[1], corCoracaoBase2[2]), lerpFactor);
    // Converte o objeto p5.Color de volta para um array RGB
    corCoracao = [interpolatedColor.levels[0], interpolatedColor.levels[1], interpolatedColor.levels[2]];


    // Desenha e atualiza as gotas de chuva (TE AMO)
    for (let gota of gotas) {
        gota.cair();
        gota.mostrar();
    }

    // Desenha e atualiza os corações caindo
    for (let heartGota of coracoesCaindo) {
        heartGota.cair();
        heartGota.mostrar();
    }

    // --- DESENHA A MENSAGEM SUPERIOR ---
    fill(corMensagemSuperior[0], corMensagemSuperior[1], corMensagemSuperior[2]);
    noStroke();
    textSize(tamanhoMensagemSuperior);
    textAlign(CENTER, TOP); // Alinha o texto ao centro horizontal e ao topo vertical
    text(mensagemSuperior, width / 2, 20); // Posição: centro da largura, 20 pixels do topo
    textAlign(LEFT, BASELINE); // Reseta o alinhamento para o padrão (importante para o texto caindo)


    // Desenha o coração principal
    desenharCoracao();

    // Lógica para o coração principal piscar
    if (coracaoPiscando) {
        if (millis() - tempoPiscando > duracaoPiscar) {
            coracaoPiscando = false;
        }
    }

    // --- Atualiza e desenha as partículas de explosão ---
    for (let i = particulasExplosao.length - 1; i >= 0; i--) {
        let p = particulasExplosao[i];
        p.mover();
        p.mostrar();
        if (p.estaMorta()) {
            particulasExplosao.splice(i, 1); // Remove partículas mortas
        }
    }
}

// Classe para cada "gota" de texto (chuva de TE AMO)
class Gota {
    constructor(x) {
        this.x = x;
        this.y = random(-height * 20, 0); // Começa bem mais acima para alta densidade
        this.velocidade = random(10, 25);
        this.texto = "EU TE AMO"; // Alterado de "TE AMO" para "EU TE AMO"
    }

    cair() {
        this.y += this.velocidade;
        if (this.y > height) {
            this.y = random(-height * 20, 0); // Reseta a posição Y
            this.velocidade = random(10, 25);
        }
    }

    mostrar() {
        fill(corTexto[0], corTexto[1], corTexto[2]);
        noStroke();
        textSize(tamanhoTexto); // Usa o tamanho de texto global
        text(this.texto, this.x, this.y);
    }
}

// --- NOVA CLASSE: Coração Caindo (HeartGota) ---
class HeartGota {
    constructor(x) {
        this.x = x;
        this.y = random(-height * 10, 0); // Corações podem começar um pouco mais acima ou abaixo do texto
        this.velocidade = random(7, 18); // Velocidade similar ao texto
        this.cor = random(coresExplosao); // Cor aleatória entre azul, roxo e rosa
        // TAMANHO DOS CORAÇÕES CAINDO MENOR
        this.tamanhoBase = random(tamanhoTexto * 0.8, tamanhoTexto * 1.5); // Antes era 1.5 a 2.5
    }

    cair() {
        this.y += this.velocidade;
        if (this.y > height) {
            this.y = random(-height * 10, 0); // Reseta a posição Y
            this.velocidade = random(7, 18);
            this.cor = random(coresExplosao); // Nova cor ao resetar
        }
    }

    mostrar() {
        fill(this.cor[0], this.cor[1], this.cor[2]);
        noStroke();

        push(); // Salva o estado atual das transformações
        translate(this.x, this.y); // Move para a posição do coração

        // Desenha o coração (código adaptado da função desenharCoracao)
        beginShape();
        vertex(0, this.tamanhoBase * 0.7);

        bezierVertex(
            -this.tamanhoBase * 1.0, -this.tamanhoBase * 0.3,
            -this.tamanhoBase * 0.8, -this.tamanhoBase * 1.0,
            0, -this.tamanhoBase * 0.5
        );

        bezierVertex(
            this.tamanhoBase * 0.8, -this.tamanhoBase * 1.0,
            this.tamanhoBase * 1.0, -this.tamanhoBase * 0.3,
            0, this.tamanhoBase * 0.7
        );
        endShape(CLOSE);
        pop(); // Restaura o estado salvo
    }
}


// --- CLASSE: Partícula para a explosão ---
class ParticulaExplosao {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidadeX = random(-velocidadeExplosaoMax, velocidadeExplosaoMax);
        this.velocidadeY = random(-velocidadeExplosaoMax, velocidadeExplosaoMax);
        this.texto = "EU TE AMO"; // Alterado de "TE AMO" para "EU TE AMO"
        this.alpha = 255; // Transparência inicial
        this.tempoVida = tempoVidaParticula; // Contador de frames
        // TAMANHO DAS LETRAS DA EXPLOSÃO MENORES
        this.tamanho = random(tamanhoTexto * 0.5, tamanhoTexto * 1.0); // Antes era 0.8 a 1.5
        this.cor = [...random(coresExplosao), this.alpha]; // Copia a cor e adiciona o alpha
    }

    mover() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        // Fator de desaceleração para a explosão (mantido para dispersão)
        // Diminuído o fator de desaceleração para mais rastro (partículas persistem mais)
        this.velocidadeX *= 0.97; // Antes era 0.95
        this.velocidadeY *= 0.97; // Antes era 0.95
        this.tempoVida--;
        // Alpha mapeado para mais rastro na explosão
        this.alpha = map(this.tempoVida, 0, tempoVidaParticula, 0, 255); // Mantido em 255 para rastro forte
        this.cor[3] = this.alpha;
    }

    mostrar() {
        fill(this.cor[0], this.cor[1], this.cor[2], this.cor[3]);
        noStroke();
        textSize(this.tamanho);
        text(this.texto, this.x, this.y);
    }

    estaMorta() {
        return this.tempoVida < 0;
    }
}


// FUNÇÃO DO CORAÇÃO PRINCIPAL
function desenharCoracao() {
    // TAMANHO DO CORAÇÃO PRINCIPAL MENOR
    let tamanhoBase = width / 8; // Antes era width / 6

    let offset = sin(frameCount * 0.08) * 5;

    // A cor atual do coração agora é a dinamicamente interpolada ou uma versão clara dela
    let corAtual;
    if (coracaoPiscando) {
        // Cria uma versão mais clara da cor interpolada atual
        corAtual = [
            min(corCoracao[0] + 50, 255), // Garante que o valor não exceda 255
            min(corCoracao[1] + 50, 255),
            min(corCoracao[2] + 50, 255)
        ];
    } else {
        corAtual = corCoracao; // Usa a cor interpolada entre azul e roxo
    }

    let escalaCoracao = coracaoPiscando ? 1.15 : 1.0;

    push();
    translate(width / 2, height / 2 + offset);
    scale(escalaCoracao);

    fill(corAtual[0], corAtual[1], corAtual[2]);
    noStroke();

    beginShape();
    vertex(0, tamanhoBase * 0.7);

    bezierVertex(
        -tamanhoBase * 1.0, -tamanhoBase * 0.3,
        -tamanhoBase * 0.8, -tamanhoBase * 1.0,
        0, -tamanhoBase * 0.5
    );

    bezierVertex(
        tamanhoBase * 0.8, -tamanhoBase * 1.0,
        tamanhoBase * 1.0, -tamanhoBase * 0.3,
        0, tamanhoBase * 0.7
    );
    endShape(CLOSE);

    pop();
}

function mousePressed() {
    coracaoPiscando = true;
    tempoPiscando = millis();

    for (let i = 0; i < maxParticulasExplosao; i++) {
        particulasExplosao.push(new ParticulaExplosao(width / 2, height / 2));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    gotas = [];
    for (let i = 0; i < numColunas; i++) {
        gotas.push(new Gota(i * (width / numColunas)));
    }
    // Reinicializa os corações caindo ao redimensionar
    coracoesCaindo = [];
    for (let i = 0; i < numCoracoesCaindo; i++) {
        coracoesCaindo.push(new HeartGota(random(width)));
    }
}
