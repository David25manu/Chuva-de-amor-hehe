// Global Variables
let gotas = [];
let tamanhoTexto = 24; // Tamanho do texto "EU TE AMO" caindo

// Cores base para o coração principal (transição suave entre azul e roxo vívidos)
let corCoracaoBase1 = [0, 191, 255]; // Deep Sky Blue (Azul vívido)
let corCoracaoBase2 = [153, 50, 204]; // Dark Orchid (Roxo vívido)
let corCoracao = []; // Será dinamicamente atualizada em draw()

let coracaoPiscando = false;
let tempoPiscando = 0;
let duracaoPiscar = 200; // ms

// --- Variáveis para a explosão ---
let particulasExplosao = [];
let maxParticulasExplosao = 25; // Quantidade de "EU TE AMO" na explosão para densidade visual
let velocidadeExplosaoMin = 5;
let velocidadeExplosaoMax = 30;
let tempoVidaParticula = 180; // 3 segundos de duração para as partículas da explosão

// CORES VÍVIDAS PARA AS PARTÍCULAS QUE CAEM (Corações e "EU TE AMO" caindo)
const coresExplosao = [
    [0, 191, 255],     // Deep Sky Blue (Azul vívido)
    [153, 50, 204],    // Dark Orchid (Roxo vívido)
    [255, 20, 147]     // Deep Pink (Rosa vívido)
];

// CORES ESPECÍFICAS PARA OS "EU TE AMO" DA EXPLOSÃO (azul e roxo)
const coresExplosaoAzulRoxo = [
    [0, 191, 255],     // Deep Sky Blue (Azul vívido)
    [153, 50, 204]     // Dark Orchid (Roxo vívido)
];

// --- Variáveis para os corações caindo ---
let coracoesCaindo = []; // Array para armazenar os corações que caem
let numCoracoesCaindo = 80; // Quantidade de corações caindo

let numColunas; // Será calculado em setup() e windowResized()

// --- NOVAS VARIÁVEIS PARA O EFEITO DE PULSO E BRILHO DO CORAÇÃO ---
let pulseEffectActive = false;
let pulseStartTime = 0;
let pulseDuration = 400; // Duração do pulso em milissegundos
let maxPulseScale = 1.3; // Escala máxima durante o pulso
let glowAlpha = 0; // Transparência do brilho (0 a 255)
let glowSize = 0; // Tamanho do brilho

// Versão do script para depuração
const SCRIPT_VERSION = "2025-05-25_2030_V1.2"; // Versão atualizada

function setup() {
    console.log(`Script Version: ${SCRIPT_VERSION} - Setup started.`); // Log da versão
    createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(60);

    numColunas = floor(width / 6);
    if (numColunas < 100) numColunas = 100;

    gotas = [];
    for (let i = 0; i < numColunas; i++) {
        gotas.push(new Gota(i * (width / numColunas)));
    }

    coracoesCaindo = [];
    for (let i = 0; i < numCoracoesCaindo; i++) {
        coracoesCaindo.push(new HeartGota(random(width)));
    }
    console.log(`Script Version: ${SCRIPT_VERSION} - Setup finished.`);
}

function draw() {
    background(0, 15); // Transparência do fundo para rastro

    let lerpFactor = (sin(frameCount * 0.03) + 1) / 2;
    let interpolatedColor = lerpColor(color(corCoracaoBase1[0], corCoracaoBase1[1], corCoracaoBase1[2]), color(corCoracaoBase2[0], corCoracaoBase2[1], corCoracaoBase2[2]), lerpFactor);
    corCoracao = [interpolatedColor.levels[0], interpolatedColor.levels[1], interpolatedColor.levels[2]];


    for (let gota of gotas) {
        gota.cair();
        gota.mostrar();
    }

    // --- Atualiza e desenha os corações caindo ---
    for (let i = coracoesCaindo.length - 1; i >= 0; i--) {
        let heartGota = coracoesCaindo[i];
        // Adicionando verificação de tipo para depuração para HeartGota
        if (typeof heartGota.mostrar !== 'function') {
            console.error("ERRO: Objeto na array coracoesCaindo não tem a função 'mostrar'.");
            console.error("Tipo do objeto:", typeof heartGota);
            console.error("Objeto:", heartGota);
            // Remove o objeto problemático para evitar que o erro se repita
            coracoesCaindo.splice(i, 1);
            continue; // Pula para a próxima iteração
        }
        heartGota.cair();
        heartGota.mostrar();
    }

    desenharCoracao();

    if (coracaoPiscando) {
        if (millis() - tempoPiscando > duracaoPiscar) {
            coracaoPiscando = false;
        }
    }

    // --- Atualiza e desenha as partículas de explosão ---
    for (let i = particulasExplosao.length - 1; i >= 0; i--) {
        let p = particulasExplosao[i];
        // Adicionando verificação de tipo para depuração para ParticulaExplosao
        if (typeof p.mostrar !== 'function') {
            console.error("ERRO: Objeto na array particulasExplosao não tem a função 'mostrar'.");
            console.error("Tipo do objeto:", typeof p);
            console.error("Objeto:", p);
            // Remove o objeto problemático para evitar que o erro se repita
            particulasExplosao.splice(i, 1);
            continue; // Pula para a próxima iteração
        }
        p.mover();
        p.mostrar();
        if (p.estaMorta()) {
            particulasExplosao.splice(i, 1);
        }
    }
}

// Classe para cada "gota" de texto ("EU TE AMO" caindo)
class Gota {
    constructor(x) {
        this.x = x;
        this.y = random(-height * 20, 0);
        this.velocidade = random(4, 10);
        this.texto = "EU TE AMO";
        this.cor = random(coresExplosao);
        this.alpha = 255;
    }

    cair() {
        this.y += this.velocidade;

        if (this.y > height - 100) {
            this.alpha = map(this.y, height - 100, height, 255, 0);
        } else {
            this.alpha = 255;
        }

        if (this.y > height) {
            this.y = random(-height * 20, 0);
            this.velocidade = random(4, 10);
            this.cor = random(coresExplosao);
            this.alpha = 255;
        }
    }

    mostrar() {
        fill(this.cor[0], this.cor[1], this.cor[2], this.alpha);
        noStroke();
        textSize(tamanhoTexto);
        text(this.texto, this.x, this.y);
    }
}

// --- CLASSE: Coração Caindo (HeartGota) ---
class HeartGota {
    constructor(x) {
        this.x = x;
        this.y = random(-height * 10, 0);
        this.velocidade = random(3.5, 9);
        this.cor = random(coresExplosao);
        this.tamanhoBase = random(tamanhoTexto * 0.8, tamanhoTexto * 1.5);
    }

    cair() {
        this.y += this.velocidade;
        if (this.y > height) {
            this.y = random(-height * 10, 0);
            this.velocidade = random(3.5, 9);
            this.cor = random(coresExplosao);
        }
    }

    mostrar() {
        fill(this.cor[0], this.cor[1], this.cor[2]);
        noStroke();

        push();
        translate(this.x, this.y);

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
        pop();
    }
}


// --- CLASSE: Partícula para a explosão ---
class ParticulaExplosao {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidadeX = random(-velocidadeExplosaoMax, velocidadeExplosaoMax);
        this.velocidadeY = random(-velocidadeExplosaoMax, velocidadeExplosaoMax);
        this.texto = "EU TE AMO";
        this.alpha = 255;
        this.tempoVida = tempoVidaParticula;
        this.tamanho = random(tamanhoTexto * 0.5, tamanhoTexto * 1.0);
        this.cor = [...random(coresExplosaoAzulRoxo), this.alpha];
    }

    mover() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        this.velocidadeX *= 0.995;
        this.velocidadeY *= 0.995;
        this.tempoVida--;
        this.alpha = map(this.tempoVida, 0, tempoVidaParticula, 0, 255);
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
    let tamanhoBase = width / 8;
    let offset = sin(frameCount * 0.08) * 5; // Movimento suave do coração

    let corAtual;
    if (coracaoPiscando) {
        corAtual = [
            min(corCoracao[0] + 50, 255),
            min(corCoracao[1] + 50, 255),
            min(corCoracao[2] + 50, 255)
        ];
    } else {
        corAtual = corCoracao; // Usa a cor interpolada entre azul e roxo
    }

    // --- Lógica para o pulso aprimorado e brilho ---
    let escalaCoracaoFinal = 1.0; // Escala padrão
    if (typeof pulseEffectActive !== 'undefined' && pulseEffectActive) {
        let elapsed = millis() - pulseStartTime;
        if (elapsed < pulseDuration) {
            let progress = map(elapsed, 0, pulseDuration, 0, 1);
            if (progress < 0.5) {
                escalaCoracaoFinal = 1.0 + easeOutBack(progress * 2) * (maxPulseScale - 1.0);
            } else {
                escalaCoracaoFinal = maxPulseScale - easeInBack((progress - 0.5) * 2) * (maxPulseScale - 1.0);
                escalaCoracaoFinal = max(1.0, escalaCoracaoFinal);
            }

            glowAlpha = map(progress, 0, 1, 200, 0);
            glowSize = map(progress, 0, 1, 0, tamanhoBase * 2.5);
        } else {
            pulseEffectActive = false;
            glowAlpha = 0;
            glowSize = 0;
            escalaCoracaoFinal = 1.0;
        }
    }

    if (glowAlpha > 0) {
        push();
        noStroke();
        fill(corCoracao[0], corCoracao[1], corCoracao[2], glowAlpha);
        ellipse(width / 2, height / 2 + offset, glowSize, glowSize);
        pop();
    }

    push();
    translate(width / 2, height / 2 + offset);
    scale(escalaCoracaoFinal);

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

function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
}

function mousePressed() {
    coracaoPiscando = true;
    tempoPiscando = millis();

    pulseEffectActive = true;
    pulseStartTime = millis();

    // Limpa a array antes de adicionar novas partículas para evitar acúmulo de objetos corrompidos
    particulasExplosao = [];
    for (let i = 0; i < maxParticulasExplosao; i++) {
        particulasExplosao.push(new ParticulaExplosao(width / 2, height / 2));
    }
    console.log(`Adicionadas ${maxParticulasExplosao} partículas de explosão.`); // Log when particles are added
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    numColunas = floor(width / 6);
    if (numColunas < 100) numColunas = 100;

    gotas = [];
    for (let i = 0; i < numColunas; i++) {
        gotas.push(new Gota(i * (width / numColunas)));
    }
    
    coracoesCaindo = [];
    for (let i = 0; i < numCoracoesCaindo; i++) {
        coracoesCaindo.push(new HeartGota(random(width)));
    }
}
