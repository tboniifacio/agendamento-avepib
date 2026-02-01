/* ===============================
   CONSTANTES
=============================== */
const MODALIDADES = ["Futebol", "Peteca", "Maratona", "Truco", "Dominó", "Tiro ao alvo", "Salto à distância"];
const IDADE_MENOR_1_ANO = "Menor de 1 ano";
const ADMIN_SENHA = "admin123";
const IDADE_PAGANTE_MIN = 16;
const VALOR_POR_PAGANTE = 150;
const PIX_INFO = "38 999216747 (Lucivania da Silva Oliveira)";

/* ===============================
   TELAS (formulário / login / dashboard)
=============================== */
function mostrarFormulario() {
  document.querySelector('.container').style.display = 'block';
  var adminDashboard = document.getElementById('adminDashboard');
  var adminLogin = document.getElementById('adminLogin');
  if (adminDashboard) adminDashboard.classList.add('hidden');
  if (adminLogin) adminLogin.classList.add('hidden');
}

function mostrarDashboard() {
  document.querySelector('.container').style.display = 'none';
  var adminDashboard = document.getElementById('adminDashboard');
  var adminLogin = document.getElementById('adminLogin');
  if (adminDashboard) adminDashboard.classList.remove('hidden');
  if (adminLogin) adminLogin.classList.add('hidden');
  atualizarDashboard();
  adicionarBotaoPDF();
}

function mostrarLogin() {
  document.querySelector('.container').style.display = 'none';
  var adminDashboard = document.getElementById('adminDashboard');
  var adminLogin = document.getElementById('adminLogin');
  if (adminDashboard) adminDashboard.classList.add('hidden');
  if (adminLogin) adminLogin.classList.remove('hidden');
}

/* ===============================
   MENSAGENS (sem alert/prompt)
=============================== */
function mostrarMensagem(texto, tipo) {
  tipo = tipo || 'sucesso';
  var msg = document.getElementById('mensagemForm');
  if (!msg) return;
  msg.textContent = texto;
  msg.className = 'mensagem ' + tipo;
  msg.classList.remove('hidden');
  setTimeout(function() {
    msg.classList.add('hidden');
  }, 6000);
}

function mostrarPopupSucesso(totalPagar, infoPix) {
  var overlay = document.createElement('div');
  overlay.id = 'popupSucessoOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;';
  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;color:#111;padding:28px 32px;border-radius:12px;max-width:400px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);';
  box.innerHTML = '<h3 style="margin:0 0 16px 0;font-size:1.2rem;">Inscrição realizada com sucesso!</h3>' +
    '<p style="margin:8px 0;"><strong>Total a pagar:</strong> ' + formatarMoeda(totalPagar) + '</p>' +
    '<p style="margin:8px 0;"><strong>PIX:</strong> ' + (infoPix || PIX_INFO) + '</p>' +
    '<p style="margin:16px 0 0 0;font-size:0.9rem;color:#555;">Esta mensagem permanece até você atualizar a página.</p>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function mostrarConfirmacaoExclusao(id, callback, mensagem) {
  var texto = (mensagem && mensagem.length) ? mensagem : 'Tem certeza que deseja excluir esta inscrição?';
  var overlay = document.createElement('div');
  overlay.id = 'popupConfirmOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;';
  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;color:#111;padding:24px 28px;border-radius:12px;max-width:360px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);';
  box.innerHTML = '<p style="margin:0 0 20px 0;">' + texto + '</p>' +
    '<div style="display:flex;gap:12px;justify-content:center;">' +
    '<button type="button" id="btnConfirmarExcluirSim" class="btn-small">Sim</button>' +
    '<button type="button" id="btnConfirmarExcluirNao" class="btn-small">Não</button>' +
    '</div>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  function remover() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  document.getElementById('btnConfirmarExcluirSim').addEventListener('click', function() {
    remover();
    if (typeof callback === 'function') callback();
  });
  document.getElementById('btnConfirmarExcluirNao').addEventListener('click', remover);
}

/* ===============================
   INICIALIZAÇÃO
=============================== */
window.addEventListener('DOMContentLoaded', function() {
  mostrarFormulario();
  inicializarFormulario();
  inicializarLoginAdmin();
  adicionarLinkAdmin();
});

/* ===============================
   FORMULÁRIO
=============================== */
function inicializarFormulario() {
  var form = document.getElementById('formInscricao');
  var respHasModalidade = document.getElementById('respHasModalidade');
  var respModalidadesContainer = document.getElementById('respModalidadesContainer');
  var temConjuge = document.getElementById('temConjuge');
  var conjugeArea = document.getElementById('conjugeArea');
  var conjHasModalidade = document.getElementById('conjHasModalidade');
  var conjModalidadesContainer = document.getElementById('conjModalidadesContainer');
  var temFilhos = document.getElementById('temFilhos');
  var filhosArea = document.getElementById('filhosArea');
  var qtdFilhos = document.getElementById('qtdFilhos');
  var listaFilhos = document.getElementById('listaFilhos');

  if (!form) return;

  criarModalidades('respModalidadesContainer', MODALIDADES);

  respHasModalidade.addEventListener('change', function() {
    if (this.value === 'sim') {
      respModalidadesContainer.classList.remove('hidden');
      respModalidadesContainer.setAttribute('aria-hidden', 'false');
    } else {
      respModalidadesContainer.classList.add('hidden');
      respModalidadesContainer.setAttribute('aria-hidden', 'true');
    }
  });

  temConjuge.addEventListener('change', function() {
    if (this.value === 'sim') {
      conjugeArea.classList.remove('hidden');
      conjugeArea.setAttribute('aria-hidden', 'false');
      criarModalidades('conjModalidadesContainer', MODALIDADES);
    } else {
      conjugeArea.classList.add('hidden');
      conjugeArea.setAttribute('aria-hidden', 'true');
    }
  });

  conjHasModalidade.addEventListener('change', function() {
    if (this.value === 'sim') {
      conjModalidadesContainer.classList.remove('hidden');
      conjModalidadesContainer.setAttribute('aria-hidden', 'false');
    } else {
      conjModalidadesContainer.classList.add('hidden');
      conjModalidadesContainer.setAttribute('aria-hidden', 'true');
    }
  });

  temFilhos.addEventListener('change', function() {
    if (this.value === 'sim') {
      filhosArea.classList.remove('hidden');
      filhosArea.setAttribute('aria-hidden', 'false');
    } else {
      filhosArea.classList.add('hidden');
      filhosArea.setAttribute('aria-hidden', 'true');
      if (listaFilhos) listaFilhos.innerHTML = '';
    }
  });

  if (qtdFilhos && listaFilhos) {
    qtdFilhos.addEventListener('input', function() {
      var qtd = parseInt(this.value, 10) || 0;
      listaFilhos.innerHTML = '';
      for (var i = 0; i < qtd; i++) {
        var filhoDiv = document.createElement('div');
        filhoDiv.className = 'filho';
        filhoDiv.innerHTML = '<h4>Filho ' + (i + 1) + '</h4>' +
          '<label>Nome completo</label>' +
          '<input type="text" class="filho-nome" placeholder="Nome completo" required>' +
          '<label style="display:inline-flex;align-items:center;gap:6px;margin-right:8px;"><input type="checkbox" class="filho-menor-1-ano" name="filho-menor-1">Criança com menos de 1 ano</label>' +
          '<label>Idade (anos)</label>' +
          '<input type="number" class="filho-idade" placeholder="Idade" required min="0">' +
          '<label>Deseja se inscrever em alguma competição?</label>' +
          '<select class="filho-has-modalidade">' +
          '<option value="nao">Não</option><option value="sim">Sim</option>' +
          '</select>' +
          '<div class="fmodalidades-wrapper hidden">' +
          '<label>Modalidades</label>' +
          '<div class="modalidades filho-modalidades"></div></div>';
        listaFilhos.appendChild(filhoDiv);

        var filhoModalidadesDiv = filhoDiv.querySelector('.filho-modalidades');
        criarModalidadesCheckboxes(filhoModalidadesDiv, MODALIDADES);

        var filhoMenor1Ano = filhoDiv.querySelector('.filho-menor-1-ano');
        filhoMenor1Ano.addEventListener('change', function() {
          var idadeInput = this.closest('.filho').querySelector('.filho-idade');
          if (!idadeInput) return;
          if (this.checked) {
            idadeInput.removeAttribute('required');
            idadeInput.value = '';
            idadeInput.removeAttribute('readonly');
          } else {
            idadeInput.setAttribute('required', 'required');
            idadeInput.removeAttribute('readonly');
          }
        });

        var filhoHasModalidade = filhoDiv.querySelector('.filho-has-modalidade');
        var filhoModalidadesWrapper = filhoDiv.querySelector('.fmodalidades-wrapper');
        filhoHasModalidade.addEventListener('change', function() {
          if (this.value === 'sim') {
            filhoModalidadesWrapper.classList.remove('hidden');
          } else {
            filhoModalidadesWrapper.classList.add('hidden');
          }
        });
      }
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    salvarInscricao();
  });
}

function criarModalidades(containerId, modalidades) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var modalidadesDiv = container.querySelector('.modalidades');
  if (!modalidadesDiv) return;
  modalidadesDiv.innerHTML = '';
  criarModalidadesCheckboxes(modalidadesDiv, modalidades);
}

function criarModalidadesCheckboxes(container, modalidades) {
  if (!container) return;
  modalidades.forEach(function(modalidade) {
    var label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '6px';
    label.style.marginRight = '8px';
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = modalidade;
    checkbox.name = 'modalidade';
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(modalidade));
    container.appendChild(label);
  });
}

function ehPagante(idade) {
  return (idade | 0) >= IDADE_PAGANTE_MIN;
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterPessoasDaInscricao(inscricao) {
  var pessoas = [];
  if (inscricao && inscricao.responsavel) pessoas.push(inscricao.responsavel);
  if (inscricao && inscricao.conjuge) pessoas.push(inscricao.conjuge);
  if (inscricao && Array.isArray(inscricao.filhos)) {
    inscricao.filhos.forEach(function(filho) { pessoas.push(filho); });
  }
  return pessoas;
}

function obterModalidadesSelecionadas(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return [];
  var checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
  return Array.prototype.slice.call(checkboxes).map(function(cb) { return cb.value; });
}

function obterModalidadesSelecionadasFilho(filhoDiv) {
  if (!filhoDiv) return [];
  var modalidadesContainer = filhoDiv.querySelector('.filho-modalidades');
  if (!modalidadesContainer) return [];
  var checkboxes = modalidadesContainer.querySelectorAll('input[type="checkbox"]:checked');
  return Array.prototype.slice.call(checkboxes).map(function(cb) { return cb.value; });
}

/* ===============================
   SALVAR INSCRIÇÃO (Firestore)
=============================== */
function salvarInscricao() {
  var form = document.getElementById('formInscricao');
  if (!form) return;
  var filhosNodes = form.querySelectorAll('.filho');
  for (var i = 0; i < filhosNodes.length; i++) {
    var filhoDiv = filhosNodes[i];
    var menor1AnoCheck = filhoDiv.querySelector('.filho-menor-1-ano');
    var menor1Ano = menor1AnoCheck && menor1AnoCheck.checked;
    var idadeInput = filhoDiv.querySelector('.filho-idade');
    if (menor1Ano) {
      idadeInput.removeAttribute('required');
    } else {
      idadeInput.setAttribute('required', 'required');
      if (!idadeInput.value || isNaN(parseInt(idadeInput.value, 10))) {
        idadeInput.reportValidity();
        return;
      }
    }
  }
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  var responsavel = {
    nome: document.getElementById('respNome').value,
    idade: parseInt(document.getElementById('respIdade').value, 10),
    modalidades: obterModalidadesSelecionadas('respModalidadesContainer'),
    tipo: 'responsavel',
    pagante: ehPagante(parseInt(document.getElementById('respIdade').value, 10))
  };

  var inscricao = {
    data: new Date().toLocaleString('pt-BR'),
    responsavel: responsavel,
    endereco: {
      rua: document.getElementById('rua').value,
      numero: document.getElementById('numero').value,
      bairro: document.getElementById('bairro').value
    },
    conjuge: null,
    filhos: []
  };

  if (document.getElementById('temConjuge').value === 'sim') {
    var idadeConj = parseInt(document.getElementById('conjIdade').value, 10);
    inscricao.conjuge = {
      nome: document.getElementById('conjNome').value,
      idade: idadeConj,
      modalidades: obterModalidadesSelecionadas('conjModalidadesContainer'),
      tipo: 'conjuge',
      pagante: ehPagante(idadeConj)
    };
  }

  document.querySelectorAll('.filho').forEach(function(filhoDiv) {
    var menor1Ano = filhoDiv.querySelector('.filho-menor-1-ano') && filhoDiv.querySelector('.filho-menor-1-ano').checked;
    var idadeFilho;
    var paganteFilho;
    if (menor1Ano) {
      idadeFilho = IDADE_MENOR_1_ANO;
      paganteFilho = false;
    } else {
      idadeFilho = parseInt(filhoDiv.querySelector('.filho-idade').value, 10);
      paganteFilho = ehPagante(idadeFilho);
    }
    inscricao.filhos.push({
      nome: filhoDiv.querySelector('.filho-nome').value,
      idade: idadeFilho,
      modalidades: obterModalidadesSelecionadasFilho(filhoDiv),
      tipo: 'filho',
      pagante: paganteFilho
    });
  });

  var pessoas = obterPessoasDaInscricao(inscricao);
  var totalPagar = pessoas.filter(function(p) { return p.pagante; }).length * VALOR_POR_PAGANTE;

  db.collection("inscricoes").add(inscricao)
    .then(function() {
      mostrarPopupSucesso(totalPagar, PIX_INFO);
      form.reset();
      var respMod = document.getElementById('respModalidadesContainer');
      if (respMod) respMod.classList.add('hidden');
      if (document.getElementById('conjugeArea')) document.getElementById('conjugeArea').classList.add('hidden');
      if (document.getElementById('filhosArea')) document.getElementById('filhosArea').classList.add('hidden');
      if (document.getElementById('listaFilhos')) document.getElementById('listaFilhos').innerHTML = '';
    })
    .catch(function() {
      mostrarMensagem('Erro ao salvar inscrição.', 'erro');
    });
}

/* ===============================
   LOGIN ADMIN
=============================== */
function inicializarLoginAdmin() {
  var formLogin = document.getElementById('formLoginAdmin');
  var btnSair = document.getElementById('btnSairAdmin');
  if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();
      var senha = document.getElementById('adminSenha').value;
      if (senha === ADMIN_SENHA) {
        mostrarDashboard();
      } else {
        mostrarMensagem('Senha incorreta!', 'erro');
      }
    });
  }
  if (btnSair) {
    btnSair.addEventListener('click', function() {
      mostrarFormulario();
      adicionarLinkAdmin();
    });
  }
}

/* ===============================
   LINK ACESSO ADMIN (único, no final do formulário)
=============================== */
function adicionarLinkAdmin() {
  var form = document.getElementById('formInscricao');
  if (!form) return;
  if (document.getElementById('linkAdmin')) return;

  var adminLink = document.createElement('a');
  adminLink.id = 'linkAdmin';
  adminLink.href = '#';
  adminLink.textContent = 'Acesso Admin';
  adminLink.style.cssText = 'display:block;text-align:center;margin-top:20px;color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.85rem;';
  adminLink.addEventListener('click', function(e) {
    e.preventDefault();
    mostrarLogin();
  });
  form.appendChild(adminLink);
}

/* ===============================
   DASHBOARD: buscar dados (Firestore)
=============================== */
function atualizarDashboard() {
  db.collection("inscricoes").get()
    .then(function(snapshot) {
      var inscricoes = [];
      snapshot.forEach(function(doc) {
        inscricoes.push({ id: doc.id, ...doc.data() });
      });
      renderizarDashboard(inscricoes);
    })
    .catch(function() {
      renderizarDashboard([]);
    });
}

/* ===============================
   DASHBOARD: renderizar (apenas UI)
=============================== */
function renderizarDashboard(inscricoes) {
  var listaInscricoes = document.getElementById('listaInscricoes');
  var listaPagantesOrganizada = document.getElementById('listaPagantesOrganizada');
  var listaNaoPagantesOrganizada = document.getElementById('listaNaoPagantesOrganizada');
  var listasPorModalidade = document.getElementById('listasPorModalidade');

  var totalPagantes = 0;
  var totalNaoPagantes = 0;
  var nomesPagantes = [];
  var nomesNaoPagantes = [];
  var pessoasPorModalidade = {};
  MODALIDADES.forEach(function(m) { pessoasPorModalidade[m] = []; });

  if (listaInscricoes) listaInscricoes.innerHTML = '';
  if (listaPagantesOrganizada) listaPagantesOrganizada.innerHTML = '';
  if (listaNaoPagantesOrganizada) listaNaoPagantesOrganizada.innerHTML = '';
  if (listasPorModalidade) listasPorModalidade.innerHTML = '';

  var glass = document.querySelector('#adminDashboard .glass');
  if (glass && listaInscricoes && listaInscricoes.closest) {
    var sec = listaInscricoes.closest('.lista-inscricoes');
    if (sec) glass.appendChild(sec);
  }

  inscricoes.forEach(function(inscricao) {
    var pessoas = obterPessoasDaInscricao(inscricao);
    pessoas.forEach(function(p) {
      var nomeExibicao = p.nome + (p.idade === IDADE_MENOR_1_ANO ? ' (Menor de 1 ano)' : '');
      if (p.pagante) {
        totalPagantes++;
        nomesPagantes.push(nomeExibicao);
      } else {
        totalNaoPagantes++;
        nomesNaoPagantes.push(nomeExibicao);
      }
      if (Array.isArray(p.modalidades)) {
        p.modalidades.forEach(function(mod) {
          if (pessoasPorModalidade[mod]) {
            pessoasPorModalidade[mod].push({ nome: nomeExibicao, pagante: p.pagante });
          }
        });
      }
    });
  });

  if (inscricoes.length === 0) {
    if (listaInscricoes) {
      listaInscricoes.innerHTML = '<p style="color:#fff;">Nenhuma inscrição cadastrada ainda.</p>';
    }
    document.getElementById('totalPagantes').textContent = '0';
    document.getElementById('totalNaoPagantes').textContent = '0';
    document.getElementById('totalInscricoes').textContent = '0';
    if (listaPagantesOrganizada) {
      var li = document.createElement('li');
      li.style.color = '#fff';
      li.textContent = 'Nenhum pagante cadastrado.';
      listaPagantesOrganizada.appendChild(li);
    }
    if (listaNaoPagantesOrganizada) {
      var li2 = document.createElement('li');
      li2.style.color = '#fff';
      li2.textContent = 'Nenhum não pagante cadastrado.';
      listaNaoPagantesOrganizada.appendChild(li2);
    }
    if (listasPorModalidade) {
      MODALIDADES.forEach(function(modalidade) {
        var bloco = document.createElement('div');
        bloco.style.marginTop = '12px';
        var titulo = document.createElement('h3');
        titulo.style.color = '#fff';
        titulo.style.margin = '10px 0';
        titulo.textContent = 'Modalidade: ' + modalidade;
        var ol = document.createElement('ol');
        var li3 = document.createElement('li');
        li3.style.color = '#fff';
        li3.textContent = 'Nenhum inscrito nesta modalidade.';
        ol.appendChild(li3);
        bloco.appendChild(titulo);
        bloco.appendChild(ol);
        listasPorModalidade.appendChild(bloco);
      });
    }
    return;
  }

  inscricoes.forEach(function(inscricao, index) {
    var inscricaoId = inscricao.id || '';
    var pessoasHTML = '';
    var r = inscricao.responsavel;
    if (r) {
      pessoasHTML += '<p><strong>Responsável:</strong> ' + (r.nome || '') + ' (' + (r.idade || '') + ' anos) – ' + (r.pagante ? 'Pagante' : 'Não Pagante') + ' <button type="button" class="btn-small btn-excluir-pessoa" data-inscricao-id="' + inscricaoId + '" data-tipo="responsavel">Excluir</button></p>';
      if (r.modalidades && r.modalidades.length > 0) {
        pessoasHTML += '<p><strong>Modalidades:</strong> ' + r.modalidades.join(', ') + '</p>';
      }
    }
    if (inscricao.conjuge) {
      var c = inscricao.conjuge;
      pessoasHTML += '<p><strong>Cônjuge:</strong> ' + (c.nome || '') + ' (' + (c.idade || '') + ' anos) – ' + (c.pagante ? 'Pagante' : 'Não Pagante') + ' <button type="button" class="btn-small btn-excluir-pessoa" data-inscricao-id="' + inscricaoId + '" data-tipo="conjuge">Excluir</button></p>';
      if (c.modalidades && c.modalidades.length > 0) {
        pessoasHTML += '<p><strong>Modalidades:</strong> ' + c.modalidades.join(', ') + '</p>';
      }
    }
    if (inscricao.filhos && inscricao.filhos.length > 0) {
      inscricao.filhos.forEach(function(filho, idx) {
        var idadeTexto = filho.idade === IDADE_MENOR_1_ANO ? IDADE_MENOR_1_ANO : (filho.idade || '') + ' anos';
        pessoasHTML += '<p><strong>Filho:</strong> ' + (filho.nome || '') + ' – Idade: ' + idadeTexto + ' – ' + (filho.pagante ? 'Pagante' : 'Não Pagante') + ' <button type="button" class="btn-small btn-excluir-pessoa" data-inscricao-id="' + inscricaoId + '" data-tipo="filho" data-indice-filho="' + idx + '">Excluir</button></p>';
        if (filho.modalidades && filho.modalidades.length > 0) {
          pessoasHTML += '<p><strong>Modalidades:</strong> ' + filho.modalidades.join(', ') + '</p>';
        }
      });
    }
    if (inscricao.endereco) {
      pessoasHTML += '<p><strong>Endereço:</strong> ' + (inscricao.endereco.rua || '') + ', ' + (inscricao.endereco.numero || '') + ' – ' + (inscricao.endereco.bairro || '') + '</p>';
    }
    pessoasHTML += '<p><strong>Data:</strong> ' + (inscricao.data || '') + '</p>';

    var item = document.createElement('div');
    item.className = 'inscricao-item';
    item.innerHTML = '<h3>Inscrição #' + (inscricao.id || (index + 1)) + '</h3>' + pessoasHTML;
    listaInscricoes.appendChild(item);

    item.querySelectorAll('.btn-excluir-pessoa').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-inscricao-id');
        var tipo = btn.getAttribute('data-tipo');
        var indiceFilho = btn.getAttribute('data-indice-filho');
        var idxFilho = indiceFilho !== null && indiceFilho !== '' ? parseInt(indiceFilho, 10) : undefined;
        excluirPessoa(id, tipo, idxFilho);
      });
    });
  });

  var totalInscritosEl = document.getElementById('totalInscricoes');
  var totalPagantesEl = document.getElementById('totalPagantes');
  var totalNaoPagantesEl = document.getElementById('totalNaoPagantes');
  if (totalInscritosEl) totalInscritosEl.textContent = inscricoes.length;
  if (totalPagantesEl) totalPagantesEl.textContent = totalPagantes;
  if (totalNaoPagantesEl) totalNaoPagantesEl.textContent = totalNaoPagantes;

  if (listaPagantesOrganizada) {
    if (nomesPagantes.length === 0) {
      var li = document.createElement('li');
      li.style.color = '#fff';
      li.textContent = 'Nenhum pagante cadastrado.';
      listaPagantesOrganizada.appendChild(li);
    } else {
      nomesPagantes.forEach(function(nome) {
        var li = document.createElement('li');
        li.textContent = nome;
        listaPagantesOrganizada.appendChild(li);
      });
    }
  }

  if (listaNaoPagantesOrganizada) {
    if (nomesNaoPagantes.length === 0) {
      var li = document.createElement('li');
      li.style.color = '#fff';
      li.textContent = 'Nenhum não pagante cadastrado.';
      listaNaoPagantesOrganizada.appendChild(li);
    } else {
      nomesNaoPagantes.forEach(function(nome) {
        var li = document.createElement('li');
        li.textContent = nome;
        listaNaoPagantesOrganizada.appendChild(li);
      });
    }
  }

  if (listasPorModalidade) {
    MODALIDADES.forEach(function(modalidade) {
      var bloco = document.createElement('div');
      bloco.style.marginTop = '12px';
      var titulo = document.createElement('h3');
      titulo.style.color = '#fff';
      titulo.style.margin = '10px 0';
      titulo.textContent = 'Modalidade: ' + modalidade;
      var ol = document.createElement('ol');
      var itens = pessoasPorModalidade[modalidade] || [];
      if (itens.length === 0) {
        var li = document.createElement('li');
        li.style.color = '#fff';
        li.textContent = 'Nenhum inscrito nesta modalidade.';
        ol.appendChild(li);
      } else {
        itens.forEach(function(p) {
          var li = document.createElement('li');
          li.textContent = (p.nome || '') + ' – ' + (p.pagante ? 'Pagante' : 'Não Pagante');
          ol.appendChild(li);
        });
      }
      bloco.appendChild(titulo);
      bloco.appendChild(ol);
      listasPorModalidade.appendChild(bloco);
    });
  }
}

/* ===============================
   EXCLUIR POR PESSOA (Firestore)
=============================== */
function filhoMaisVelho(filhos) {
  if (!filhos || filhos.length === 0) return null;
  var ordenado = filhos.slice().sort(function(a, b) {
    if (a.idade === IDADE_MENOR_1_ANO && b.idade === IDADE_MENOR_1_ANO) return 0;
    if (a.idade === IDADE_MENOR_1_ANO) return 1;
    if (b.idade === IDADE_MENOR_1_ANO) return -1;
    return (b.idade | 0) - (a.idade | 0);
  });
  return ordenado[0];
}

function excluirPessoa(inscricaoId, tipo, indiceFilho) {
  if (!inscricaoId) return;
  var msg = tipo === 'responsavel' || tipo === 'conjuge' || tipo === 'filho' ? 'Tem certeza que deseja excluir esta pessoa?' : 'Tem certeza que deseja excluir esta inscrição?';
  mostrarConfirmacaoExclusao(inscricaoId, function() {
    var ref = db.collection("inscricoes").doc(inscricaoId);
    ref.get().then(function(docSnap) {
      if (!docSnap.exists) {
        mostrarMensagem('Inscrição não encontrada.', 'erro');
        return;
      }
      var dados = docSnap.data();
      var responsavel = dados.responsavel;
      var conjuge = dados.conjuge || null;
      var filhos = Array.isArray(dados.filhos) ? dados.filhos.slice() : [];
      var endereco = dados.endereco || {};
      var data = dados.data;

      if (tipo === 'filho') {
        if (indiceFilho >= 0 && indiceFilho < filhos.length) {
          filhos.splice(indiceFilho, 1);
          ref.update({ filhos: filhos }).then(function() { atualizarDashboard(); }).catch(function() { mostrarMensagem('Erro ao excluir.', 'erro'); });
        }
        return;
      }

      if (tipo === 'conjuge') {
        ref.update({ conjuge: null }).then(function() { atualizarDashboard(); }).catch(function() { mostrarMensagem('Erro ao excluir.', 'erro'); });
        return;
      }

      if (tipo === 'responsavel') {
        var temConjuge = conjuge && typeof conjuge === 'object';
        var temFilhos = filhos.length > 0;
        if (!temConjuge && !temFilhos) {
          ref.delete().then(function() { atualizarDashboard(); }).catch(function() { mostrarMensagem('Erro ao excluir.', 'erro'); });
          return;
        }
        var novoResponsavel;
        if (temConjuge) {
          novoResponsavel = { nome: conjuge.nome, idade: conjuge.idade, modalidades: conjuge.modalidades || [], tipo: 'responsavel', pagante: conjuge.pagante };
          ref.update({ responsavel: novoResponsavel, conjuge: null }).then(function() { atualizarDashboard(); }).catch(function() { mostrarMensagem('Erro ao excluir.', 'erro'); });
        } else {
          var maisVelho = filhoMaisVelho(filhos);
          if (!maisVelho) {
            ref.delete().then(function() { atualizarDashboard(); }).catch(function() { mostrarMensagem('Erro ao excluir.', 'erro'); });
            return;
          }
          novoResponsavel = { nome: maisVelho.nome, idade: maisVelho.idade, modalidades: maisVelho.modalidades || [], tipo: 'responsavel', pagante: maisVelho.pagante };
          var idx = filhos.indexOf(maisVelho);
          if (idx !== -1) filhos.splice(idx, 1);
          ref.update({ responsavel: novoResponsavel, filhos: filhos }).then(function() { atualizarDashboard(); }).catch(function() { mostrarMensagem('Erro ao excluir.', 'erro'); });
        }
      }
    }).catch(function() {
      mostrarMensagem('Erro ao excluir.', 'erro');
    });
  }, msg);
}

/* ===============================
   PDF (busca Firestore, depois gera PDF)
=============================== */
function salvarDashboardPDF() {
  db.collection("inscricoes").get()
    .then(function(snapshot) {
      var inscricoes = [];
      snapshot.forEach(function(doc) {
        inscricoes.push({ id: doc.id, ...doc.data() });
      });
      gerarPDFComInscricoes(inscricoes);
    })
    .catch(function() {
      gerarPDFComInscricoes([]);
    });
}

function gerarPDFComInscricoes(inscricoes) {
  var jsPDF = window.jspdf;
  if (!jsPDF || !jsPDF.jsPDF) return;
  var doc = new jsPDF.jsPDF();
  var y = 15;

  doc.setFontSize(16);
  doc.text('RELATÓRIO AVEPIB', 10, y);
  y += 12;

  var nomesPagantes = [];
  var nomesNaoPagantes = [];
  var pessoasPorModalidade = {};
  MODALIDADES.forEach(function(m) { pessoasPorModalidade[m] = []; });

  inscricoes.forEach(function(inscricao) {
    var pessoas = obterPessoasDaInscricao(inscricao);
    pessoas.forEach(function(p) {
      var nomeExibicao = p.nome + (p.idade === IDADE_MENOR_1_ANO ? ' (Menor de 1 ano)' : '');
      if (p.pagante) {
        nomesPagantes.push(nomeExibicao);
      } else {
        nomesNaoPagantes.push(nomeExibicao);
      }
      if (Array.isArray(p.modalidades)) {
        p.modalidades.forEach(function(mod) {
          if (pessoasPorModalidade[mod]) {
            pessoasPorModalidade[mod].push({ nome: nomeExibicao, pagante: p.pagante });
          }
        });
      }
    });
  });

  doc.setFontSize(14);
  doc.text('Lista de Pagantes', 10, y);
  y += 8;
  doc.setFontSize(11);
  if (nomesPagantes.length === 0) {
    doc.text('Nenhum pagante cadastrado.', 10, y);
    y += 6;
  } else {
    nomesPagantes.forEach(function(nome, i) {
      doc.text((i + 1) + '. ' + nome + ' – Pagante', 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 15; }
    });
  }
  y += 10;

  doc.setFontSize(14);
  doc.text('Lista de Não Pagantes', 10, y);
  y += 8;
  doc.setFontSize(11);
  if (nomesNaoPagantes.length === 0) {
    doc.text('Nenhum não pagante cadastrado.', 10, y);
    y += 6;
  } else {
    nomesNaoPagantes.forEach(function(nome, i) {
      doc.text((i + 1) + '. ' + nome + ' – Não Pagante', 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 15; }
    });
  }
  y += 10;

  doc.setFontSize(14);
  doc.text('Listas por Modalidade', 10, y);
  y += 8;
  MODALIDADES.forEach(function(modalidade) {
    doc.setFontSize(12);
    doc.text('Modalidade: ' + modalidade, 10, y);
    y += 6;
    doc.setFontSize(11);
    var lista = pessoasPorModalidade[modalidade] || [];
    if (lista.length === 0) {
      doc.text('Nenhum inscrito nesta modalidade.', 12, y);
      y += 6;
    } else {
      lista.forEach(function(p) {
        doc.text((p.nome || '') + ' – ' + (p.pagante ? 'Pagante' : 'Não Pagante'), 12, y);
        y += 6;
        if (y > 270) { doc.addPage(); y = 15; }
      });
    }
    y += 8;
    if (y > 270) { doc.addPage(); y = 15; }
  });

  doc.save('relatorio-inscricoes-avepib.pdf');
}

function adicionarBotaoPDF() {
  var adminHeader = document.querySelector('#adminDashboard .admin-header');
  if (!adminHeader || document.getElementById('btnSalvarPDF')) return;
  var btn = document.createElement('button');
  btn.id = 'btnSalvarPDF';
  btn.textContent = 'Salvar PDF';
  btn.className = 'btn-small';
  btn.style.marginLeft = '10px';
  btn.addEventListener('click', salvarDashboardPDF);
  adminHeader.appendChild(btn);
}
