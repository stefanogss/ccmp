(function () {
  var NAV = [['index.html', 'Início'], ['historia.html', 'História'], ['exposicoes.html', 'Exposições'], ['galeria.html', 'Galeria'], ['visite.html', 'Visite']];
  var aqui = (location.pathname.split('/').pop() || 'index.html');
  var url = function (f, t) { return 'https://live.staticflickr.com/65535/' + f[0] + '_' + f[1] + '_' + t + '.jpg'; };
  var flickr = function (f) { return 'https://www.flickr.com/photos/167401187@N06/' + f[0] + '/in/album-72177720337151969'; };
  var links = NAV.map(function (n) {
    return '<a href="' + n[0] + '"' + (n[0] === aqui ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
  }).join('');

  document.getElementById('topo').innerHTML =
    '<a class="pular" href="#conteudo">Pular para o conteúdo</a><header class="topo"><div class="faixa">' +
    '<a class="marca" href="index.html"><strong>Centro Cultural</strong><span>do Ministério Público de Santa Catarina</span></a>' +
    '<button class="menu-botao" aria-expanded="false" aria-controls="menu">Menu</button>' +
    '<nav id="menu" aria-label="Principal">' + links + '</nav></div></header>';

  document.getElementById('rodape').innerHTML =
    '<footer class="rodape"><div class="faixa rodape-grade">' +
    '<div><p class="rodape-titulo">Centro Cultural do MPSC</p><p>Rua Bocaiuva, 1755 · Centro<br>Florianópolis/SC · CEP 88015-904</p></div>' +
    '<div><p class="rotulo">Visitação</p><p>Segunda a sexta-feira, das 10h às 18h<br>Entrada gratuita</p></div>' +
    '<div><p class="rotulo">Agendamento</p><p><a href="mailto:ceaf@mpsc.mp.br">ceaf@mpsc.mp.br</a><br><a href="tel:+554832299304">(48) 3229-9304</a></p></div>' +
    '<div><p class="rotulo">Realização</p><div class="logos"><img src="marca/mpsc.png" alt="Ministério Público de Santa Catarina"><img src="marca/ceaf.png" alt="Centro de Estudos e Aperfeiçoamento Funcional"></div></div>' +
    '</div></footer>';

  var botao = document.querySelector('.menu-botao'), menu = document.getElementById('menu');
  botao.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', aberto);
  });

  function criaFoto(chave, grande) {
    var f = FOTOS[chave]; if (!f) return null;
    var fig = document.createElement('figure'); fig.className = 'foto';
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Ampliar: ' + f[3]);
    var i = document.createElement('img'); i.src = url(f, grande ? 'b' : 'z'); i.alt = f[3]; i.loading = 'lazy';
    i.onerror = function () { fig.remove(); registra(); };
    b.appendChild(i); fig.appendChild(b);
    var c = document.createElement('figcaption'); c.textContent = f[3]; fig.appendChild(c);
    b.addEventListener('click', function () { abre(chave, b); });
    return fig;
  }

  document.querySelectorAll('[data-f]').forEach(function (el) {
    var fig = criaFoto(el.dataset.f, el.hasAttribute('data-grande'));
    if (fig) { fig.className += ' ' + el.className; el.replaceWith(fig); } else { el.remove(); }
  });

  var grade = document.getElementById('galeria'), filtros = document.getElementById('filtros');
  if (grade) {
    Object.keys(FOTOS).forEach(function (k) {
      var fig = criaFoto(k); fig.dataset.tema = FOTOS[k][2]; grade.appendChild(fig);
    });
    var opcoes = [['todas', 'Todas']].concat(Object.keys(TEMAS).map(function (t) { return [t, TEMAS[t]]; }));
    opcoes.forEach(function (o, n) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1];
      b.setAttribute('aria-pressed', n === 0);
      b.addEventListener('click', function () {
        filtros.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        grade.querySelectorAll('.foto').forEach(function (x) { x.hidden = o[0] !== 'todas' && x.dataset.tema !== o[0]; });
        registra();
      });
      filtros.appendChild(b);
    });
  }

  var caixa = document.createElement('dialog'); caixa.className = 'caixa'; caixa.setAttribute('aria-label', 'Foto ampliada');
  caixa.innerHTML = '<button class="fechar" type="button">Fechar</button><button class="ant" type="button" aria-label="Foto anterior">‹</button>' +
    '<figure><img alt=""><figcaption><span></span> <a target="_blank" rel="noopener">Ver no Flickr</a></figcaption></figure>' +
    '<button class="prox" type="button" aria-label="Próxima foto">›</button>';
  document.body.appendChild(caixa);
  var lista = [], pos = 0, origem = null;
  function registra() {
    lista = [].slice.call(document.querySelectorAll('.foto:not([hidden]) img')).map(function (i) {
      return Object.keys(FOTOS).find(function (k) { return FOTOS[k][3] === i.alt; });
    }).filter(function (k, n, a) { return k && a.indexOf(k) === n; });
  }
  function mostra() {
    var f = FOTOS[lista[pos]], im = caixa.querySelector('img');
    im.src = url(f, 'b'); im.alt = f[3];
    caixa.querySelector('figcaption span').textContent = f[3];
    caixa.querySelector('figcaption a').href = flickr(f);
  }
  function abre(k, b) { registra(); pos = Math.max(0, lista.indexOf(k)); origem = b; mostra(); caixa.showModal(); }
  function passo(d) { pos = (pos + d + lista.length) % lista.length; mostra(); }
  caixa.querySelector('.fechar').onclick = function () { caixa.close(); };
  caixa.querySelector('.ant').onclick = function () { passo(-1); };
  caixa.querySelector('.prox').onclick = function () { passo(1); };
  caixa.addEventListener('click', function (e) { if (e.target === caixa) caixa.close(); });
  caixa.addEventListener('close', function () { if (origem) origem.focus(); });
  caixa.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') passo(-1);
    if (e.key === 'ArrowRight') passo(1);
  });
})();
