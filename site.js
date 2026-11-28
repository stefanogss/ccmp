(function () {
  var NAV = [['index.html', 'Início'], ['exposicoes.html', 'Exposições'], ['linha-do-tempo.html', 'Linha do tempo'], ['galeria.html', 'Galeria'], ['visite.html', 'Visite']];
  var aqui = (location.pathname.split('/').pop() || 'index.html');
  if (aqui === 'edla.html' || aqui === 'antigo-novo.html' || aqui === 'hassis.html') aqui = 'exposicoes.html';
  var url = function (f, t) { return 'https://live.staticflickr.com/65535/' + f[0] + '_' + f[1] + '_' + t + '.jpg'; };
  var flickr = function (f) { return 'https://www.flickr.com/photos/167401187@N06/' + f[0] + '/in/album-72177720337151969'; };
  var links = NAV.map(function (n) {
    return '<a href="' + n[0] + '"' + (n[0] === aqui ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
  }).join('');

  document.getElementById('topo').innerHTML =
    '<a class="pular" href="#conteudo">Pular para o conteúdo</a><header class="topo"><div class="faixa">' +
    '<a class="marca" href="index.html"><strong>Centro Cultural</strong><span>do Ministério Público de Santa Catarina</span></a>' +
    '<button class="menu-botao" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>' +
    '<nav id="menu" aria-label="Principal">' + links + '</nav></div></header>';

  document.getElementById('rodape').innerHTML =
    '<footer class="rodape"><div class="faixa rodape-grade">' +
    '<div><p class="rodape-titulo">Centro Cultural do MPSC</p><p>Rua Bocaiúva, 1750 · Centro<br>Florianópolis/SC · CEP 88015-904</p></div>' +
    '<div><p class="rotulo">Visitação</p><p>Segunda a sexta-feira, das 10h às 18h<br>Entrada gratuita</p></div>' +
    '<div><p class="rotulo">Agendamento</p><p><a href="mailto:ceaf@mpsc.mp.br">ceaf@mpsc.mp.br</a><br><a href="tel:+554832299200">(48) 3229-9200</a></p></div>' +
    '<div><p class="rotulo">Realização</p><div class="logos"><img src="marca/mpsc.png" alt="Ministério Público de Santa Catarina"><img src="marca/ceaf.png" alt="Centro de Estudos e Aperfeiçoamento Funcional"></div></div>' +
    '</div></footer>';

  var botao = document.querySelector('.menu-botao'), menu = document.getElementById('menu');
  function defineMenu(aberto) {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', aberto);
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }
  botao.addEventListener('click', function () { defineMenu(!menu.classList.contains('aberto')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) defineMenu(false); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.topo')) defineMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) { defineMenu(false); botao.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) defineMenu(false); });

  var agenda = document.getElementById('form-agenda');
  if (agenda) {
    var campo = function (n) { return agenda.elements[n]; };
    var aviso = document.getElementById('agenda-aviso'), textoPronto = '';
    var amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
    var doisDig = function (n) { return String(n).padStart(2, '0'); };
    campo('data').min = amanha.getFullYear() + '-' + doisDig(amanha.getMonth() + 1) + '-' + doisDig(amanha.getDate());
    var validaData = function () {
      var v = campo('data').value, msg = '';
      if (v) { var p = v.split('-'), d = new Date(+p[0], p[1] - 1, +p[2]).getDay(); if (d === 0 || d === 6) msg = 'O Centro Cultural abre de segunda a sexta-feira. Escolha um dia útil.'; }
      campo('data').setCustomValidity(msg);
    };
    campo('data').addEventListener('input', validaData);
    agenda.addEventListener('submit', function (e) {
      e.preventDefault(); validaData();
      if (!agenda.reportValidity()) return;
      var v = function (n) { return campo(n).value.trim(); };
      var p = v('data').split('-'), dataBR = p[2] + '/' + p[1] + '/' + p[0];
      var linhas = ['Olá,', '', 'Gostaria de solicitar o agendamento de uma visita ao Centro Cultural do MPSC.', '',
        'Nome: ' + v('nome'), 'E-mail: ' + v('email')];
      if (v('telefone')) linhas.push('Telefone: ' + v('telefone'));
      if (v('instituicao')) linhas.push('Escola ou instituição: ' + v('instituicao'));
      linhas.push('Tipo de visita: ' + v('tipo'), 'Data desejada: ' + dataBR, 'Horário desejado: ' + v('horario'), 'Número de pessoas: ' + v('pessoas'));
      if (v('acessibilidade')) linhas.push('Necessidades de acessibilidade: ' + v('acessibilidade'));
      if (v('mensagem')) linhas.push('', 'Mensagem:', v('mensagem'));
      linhas.push('', 'Aguardo a confirmação.', '', v('nome'));
      textoPronto = linhas.join('\r\n');
      var assunto = 'Agendamento de visita - ' + dataBR + ' - ' + v('nome');
      var link = document.createElement('a');
      link.href = 'mailto:ceaf@mpsc.mp.br?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(textoPronto);
      document.body.appendChild(link); link.click(); link.remove();
      aviso.hidden = false; aviso.focus();
    });
    document.getElementById('agenda-copiar').addEventListener('click', function () {
      var b = this;
      navigator.clipboard.writeText(textoPronto).then(function () { b.textContent = 'Mensagem copiada'; }, function () { b.textContent = 'Não foi possível copiar'; });
    });
  }

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
    Object.keys(TEMAS).forEach(function (t) {
      Object.keys(FOTOS).filter(function (k) { return FOTOS[k][2] === t; }).forEach(function (k) {
        var fig = criaFoto(k); fig.dataset.tema = t; grade.appendChild(fig);
      });
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
