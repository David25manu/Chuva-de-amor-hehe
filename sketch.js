let gotas = [];
let tamanhoTexto = 24; // Tamanho do texto "EU TE AMO" caindo
let corTexto = [255, 105, 180]; // Rosa choque para o texto (RGB)

// Cores base para o coração principal (transição suave entre azul e roxo)
let corCoracaoBase1 = [0, 100, 255]; // Azul
let corCoracaoBase2 = [150, 0, 200]; // Roxo
let corCoracao = []; // Será dinamicamente atualizada em draw()

let coracaoPiscando = false;
let tempoPiscando = 0;
let duracaoPiscar = 200; // ms

// --- Variáveis para a explosão ---
let particulasExplosao = [];
let maxParticulasExplosao = 40; // Quantidade de "EU TE AMO" na explosão
let velocidadeExplosaoMin = 5;
let velocidadeExplosaoMax = 20;
let tempoVidaParticula = 90; // Tempo em frames que a partícula vive (1.5 segundos a 60fps)

// Cores para as partículas da explosão e corações caindo (Azul, Roxo, Rosa)
const coresExplosao = [
    [220, 50, 150],   // Rosa mais escuro e vibrante
    [100, 0, 150],    // Roxo mais escuro e vibrante
    [0, 100, 200]     // Azul mais escuro e vibrante
];

// --- Variáveis para a mensagem superior ---
let mensagemSuperior = "PARABÉNS AOS NOSSOS 5 MESES";
let corMensagemSuperior = [0, 255, 255]; // Ciano vibrante
let tamanhoMensagemSuperior = 28; // Tamanho do texto da mensagem


// --- Variáveis para os corações caindo ---
let coracoesCaindo = []; // Array para armazenar os corações que caem
let numCoracoesCaindo = 80; // Quantidade de corações caindo

// NÚMERO DE COLUNAS DE TEXTO AGORA É DINÂMICO PARA MELHOR RESPONSIVIDADE
let numColunas; // Será calculado em setup() e windowResized()

// --- NOVAS VARIÁVEIS PARA O EFEITO DE PULSO E BRILHO DO CORAÇÃO ---
let pulseEffectActive = false;
let pulseStartTime = 0;
let pulseDuration = 400; // Duração do pulso em milissegundos
let maxPulseScale = 1.3; // Escala máxima durante o pulso
let glowAlpha = 0; // Transparência do brilho (0 a 255)
let glowSize = 0; // Tamanho do brilho


function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(60);

    // Calcula o número de colunas dinamicamente para TRIPLICAR a densidade
    numColunas = floor(width / 5);
    if (numColunas < 150) numColunas = 150;


    // Inicializa as "gotas" de texto
    for (let i = 0; i < numColunas; i++) {
        gotas.push(new Gota(i * (width / numColunas)));
    }

    // Inicializa os corações caindo
    for (let i = 0; i < numCoracoesCaindo; i++) {
        coracoesCaindo.push(new HeartGota(random(width)));
    }
}

function draw() {
    background(0, 60); // Fundo semi-transparente para o rastro geral.

    // ATUALIZA A COR DO CORAÇÃO PRINCIPAL DINAMICAMENTE
    let lerpFactor = (sin(frameCount * 0.03) + 1) / 2;
    let interpolatedColor = lerpColor(color(corCoracaoBase1[0], corCoracaoBase1[1], corCoracaoBase1[2]), color(corCoracaoBase2[0], corCoracaoBase2[1], corCoracaoBase2[2]), lerpFactor);
    corCoracao = [interpolatedColor.levels[0], interpolatedColor.levels[1], interpolatedColor.levels[2]];


    // Desenha e atualiza as gotas de chuva ("EU TE AMO")
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
    textAlign(CENTER, TOP);
    text(mensagemSuperior, width / 2, 20, width * 0.9); // Centro X, Top Y, Largura Máxima (90% da tela)
    textAlign(LEFT, BASELINE);


    // Desenha o coração principal e seus efeitos
    desenharCoracao();

    // Lógica para o coração principal piscar (cor clara temporária)
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
    }

    cair() {
        this.y += this.velocidade;
        if (this.y > height) {
            this.y = random(-height * 20, 0);
            this.velocidade = random(4, 10);
        }
    }

    mostrar() {
        fill(corTexto[0], corTexto[1], corTexto[2]);
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
            0, this.tamanhoBase * 0.7 // CORREÇÃO APLICADA AQUI
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
        this.cor = [...random(coresExplosao), this.alpha];
    }

    mover() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        this.velocidadeX *= 0.97;
        this.velocidadeY *= 0.97;
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
    if (pulseEffectActive) {
        let elapsed = millis() - pulseStartTime;
        if (elapsed < pulseDuration) {
            let progress = map(elapsed, 0, pulseDuration, 0, 1);
            // Efeito de "pop" com overshoot (cresce um pouco mais e volta)
            if (progress < 0.5) {
                escalaCoracaoFinal = 1.0 + easeOutBack(progress * 2) * (maxPulseScale - 1.0);
            } else {
                escalaCoracaoFinal = maxPulseScale - easeInBack((progress - 0.5) * 2) * (maxPulseScale - 1.0);
                escalaCoracaoFinal = max(1.0, escalaCoracaoFinal); // Garante que não vá abaixo de 1.0
            }

            // Calcula o brilho e tamanho do glow
            glowAlpha = map(progress, 0, 1, 200, 0); // Fades out
            glowSize = map(progress, 0, 1, 0, tamanhoBase * 2.5); // Expands mais
        } else {
            pulseEffectActive = false; // Desativa o efeito de pulso
            glowAlpha = 0; // Zera a transparência do brilho
            glowSize = 0; // Zera o tamanho do brilho
            escalaCoracaoFinal = 1.0; // Volta à escala padrão
        }
    }

    // Desenha o brilho (glow) atrás do coração
    if (glowAlpha > 0) { // Só desenha se tiver visibilidade
        push();
        noStroke();
        // Usa a cor atual do coração para o brilho, com a transparência calculada
        fill(corCoracao[0], corCoracao[1], corCoracao[2], glowAlpha);
        ellipse(width / 2, height / 2 + offset, glowSize, glowSize);
        pop();
    }

    push();
    translate(width / 2, height / 2 + offset);
    scale(escalaCoracaoFinal); // Aplica a escala calculada (pulso)

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

// Funções de easing para um pulso mais interessante
// easeOutBack: começa rápido e desacelera com um pequeno "overshoot"
function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// easeInBack: desacelera e depois "puxa para trás" antes de parar
function easeInBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
}

function mousePressed() {
    coracaoPiscando = true;
    tempoPiscando = millis();

    // Ativa o novo efeito de pulso e brilho
    pulseEffectActive = true;
    pulseStartTime = millis();
    // O glowAlpha e glowSize serão calculados dinamicamente em desenharCoracao
    // Não precisamos setar valores iniciais aqui, pois o map já os controla.

    // Dispara a explosão de "EU TE AMO" no centro do coração
    for (let i = 0; i < maxParticulasExplosao; i++) {
        particulasExplosao.push(new ParticulaExplosao(width / 2, height / 2));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Recalcula numColunas ao redimensionar para TRIPLICAR a densidade
    numColunas = floor(width / 5);
    if (numColunas < 150) numColunas = 150;

    // Reinicializa as gotas com o novo número de colunas
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
