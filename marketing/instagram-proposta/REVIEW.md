# REVIEW — rodada 1

- `npx hyperframes check`: 0 erros, 0 avisos.
- Quadros de QA verificados por snapshot: 0, 2, 5, 6, 7.3, 7.6, 8.4, 10.2, 10.4, 13.5, 14.4, 17, 20.5, 23.75, 23.9.
- Corrigido nesta rodada: admin pequeno demais para ler (zoom 0.6 → 1.0); toast cobrindo a linha da RTX (enquadramento subiu); segundo movimento de câmera do admin sem baseline (fromTo → to); telas cortadas pela janela marcadas como overflow intencional; morph do end card trocado de width/height para scale.
- Frame 0: carrinho real com anel no "2" e título "2 no carrinho" — o gancho funciona sem som.
- Texto legível só entre 168 e 1330 px; abaixo, apenas a grade.
- Som: narração ElevenLabs (Gabriel, eleven_v4) e trilha ElevenLabs (eleven_music_v2_5, take 4, pico −1 dBTP) a 0.14. Medido, não ouvido. Sem efeitos sonoros (pop/whoosh) nesta versão.
- Pendente: aprovação do preview antes do render.
