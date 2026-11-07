# SPEC — "O carrinho que não mente" (storyline A)

GOAL:    o dono de loja de informática entende que a einfo.tech evita a venda frustrada (carrinho que se corrige quando o estoque muda) e chama no direct.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps, Reels.
TIME:    24.0 s x 30 = 720 frames. Clock = narração (assets/audio/vo.mp3, offset +0.30 s). Trilha music.mp3 (~146 bpm detectados, batida a cada 0.41 s) a 0.14 sob a voz, fade-out 1.2 s no fim.

LOOK:
- ground #F3F5FA com grade técnica 48 px, linhas 1 px #E3E8F2 (o "papel milimetrado" de bancada de hardware); sem gradiente.
- ink #0B0F19; ink secundária #5B6475; accent #155DFC (azul do app) só no número do título, no anel de destaque e no end card.
- display Geist 700, 104 px, tracking -2.5%, alinhado à esquerda em x=72; legenda Geist 600, 54 px, centrada, ink sobre fundo #FFFFFF com 12 px de padding e raio 14.
- meio: telas reais do app (assets/screens, capturadas do localhost) dentro de uma "janela" branca: x 60, y 470, 960 x 700, raio 36, borda 1 px #E4E7EC, sombra 0 24px 60px rgba(17,24,39,.10).
- anel de destaque: borda 6 px #155DFC, raio 18, desenhado em coordenadas da imagem (acompanha o zoom).

OBJECTS: carrinho real (Ryzen 7 7800X3D, RTX 4070 Super x2, Kingston 32GB), campo "Estoque" do admin real (6 → 1), toast real "Seu carrinho foi atualizado", card real "Esgotado" (i9-14900K), marca einfo.tech (quadrado azul com ícone CPU).

ZONES (9:16): títulos 230–420; janela 470–1170; legendas 1200–1320; abaixo de 1330 só a grade.

MOTION:
- enter: expo.out 0.5 s; move/câmera (zoom da imagem): power3.inOut 0.9 s; exit: power2.in 0.25 s.
- títulos entram por máscara (clip-path de baixo para cima, 0.35 s) e ficam parados enquanto são lidos.
- troca de cena: a janela sai 120 px para a esquerda com opacidade 0 em 0.22 s e a nova entra da direita em 0.4 s (expo.out); a cena 5→6 é diferente: a janela encolhe até virar o quadrado da marca.
- um movimento herói por plano; secundários 60% da distância, 150 ms depois.

SHOTS (tempo do vídeo):
1. 0.00–3.40  carrinho: frame 0 já mostra o carrinho com o anel em "2" na RTX; push 0.85→1.15 na linha da RTX. Título "2 no carrinho" (accent no 2) visível desde o frame 0. Hand-off: whip para a esquerda.
2. 3.40–8.80  admin (notebook): vista do formulário, push no campo Estoque (0.37→0.62). Título "1 no estoque" em 3.44 ("Só"). Em 7.05 ("ajusta") o campo troca de 6 para 1 com tick; em 8.30 anel pulsa em "Salvar alterações". Hand-off: whip.
3. 8.80–12.45 carrinho corrigido: RTX com qty 1 e "1 em estoque"; em 9.55 ("corrige") o toast real sobe da base da janela (pop); anel no "1". Título "Sem surpresa no fim".
4. 12.45–15.70 vitrine: catalog-top com anel nas categorias em 13.24 ("categorias"); corte seco para busca "rtx" em 14.10 ("busca"). Título "6 categorias · 20 produtos".
5. 15.70–18.45 card "Esgotado": push no selo Esgotado e no botão desabilitado. Título "Esgotado é esgotado".
6. 18.45–24.00 end card: fundo #155DFC, a janela encolhe até virar o quadrado branco da marca; "einfo.tech" escreve-se em 18.53 com a voz; "Sua loja de hardware online" em 19.3; "Chama no direct →" em 19.94; segura até 24.0.

LEGENDAS: fala completa em grupos de 3–5 palavras (texto do roteiro, marca escrita "einfo.tech"), uma por vez, kill duro no fim de cada grupo.

BANNED: fundo escuro com objetos flutuando; glow/partículas; gradiente azul/roxo; cards de vidro; três cards em linha; tudo centralizado; tudo surgindo com fade+subida; título que continua se mexendo; logo no canto; chips em pílula decorativos; telas desenhadas no lugar das reais.

QA: f0 (hook legível sem som), 2.0 (anel no 2), 5.0 (título "1 no estoque"), 7.3 (campo = 1), 10.2 (toast inteiro dentro da janela), 13.5 (anel categorias), 14.4 (busca), 17.0 (Esgotado), 20.5 (marca + CTA), 23.9 (end card estável). Nada legível fora de 168–1330.
