function mostrarFormulario() {
  document.querySelector('.container').style.display = 'block';
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById('adminLogin').classList.add('hidden');
}

    // Modalidades disponíveis
    const MODALIDADES = ["Futebol", "Peteca", "Maratona", "Truco", "Dominó", "Tiro ao alvo"];
    
    // Senha do admin (em produção, usar autenticação adequada)
    const ADMIN_SENHA = "admin123";
    
    // Chave para localStorage
    const STORAGE_KEY = "avepib_inscricoes";
    const ADMIN_AUTH_KEY = "avepib_admin_auth";
    
    // Regras de pagamento
    const IDADE_PAGANTE_MIN = 16;
    const VALOR_POR_PAGANTE = 150;

    // Verificar se é admin ao carregar
window.addEventListener('DOMContentLoaded', function() {
  mostrarFormulario(); // 👈 SEMPRE começa no formulário
  inicializarFormulario();
  inicializarLoginAdmin();
  adicionarLinkAdmin();
});

    // Função para mostrar formulário
function mostrarDashboard() {
  document.querySelector('.container').style.display = 'none';
  document.getElementById('adminDashboard').classList.remove('hidden');
  document.getElementById('adminLogin').classList.add('hidden');

  atualizarDashboard();
  adicionarBotaoPDF(); // 👈 CHAMADA OBRIGATÓRIA
}


    // Função para mostrar login
    function mostrarLogin() {
      document.querySelector('.container').style.display = 'none';
      document.getElementById('adminDashboard').classList.add('hidden');
      document.getElementById('adminLogin').classList.remove('hidden');
    }

    // Inicializar formulário
    function inicializarFormulario() {
      const form = document.getElementById('formInscricao');
      const respHasModalidade = document.getElementById('respHasModalidade');
      const respModalidadesContainer = document.getElementById('respModalidadesContainer');
      const temConjuge = document.getElementById('temConjuge');
      const conjugeArea = document.getElementById('conjugeArea');
      const conjHasModalidade = document.getElementById('conjHasModalidade');
      const conjModalidadesContainer = document.getElementById('conjModalidadesContainer');
      const temFilhos = document.getElementById('temFilhos');
      const filhosArea = document.getElementById('filhosArea');
      const qtdFilhos = document.getElementById('qtdFilhos');
      const listaFilhos = document.getElementById('listaFilhos');

      // Criar checkboxes de modalidades para responsável
      criarModalidades('respModalidadesContainer', MODALIDADES);

      // Mostrar/ocultar modalidades do responsável
      respHasModalidade.addEventListener('change', function() {
        if (this.value === 'sim') {
          respModalidadesContainer.classList.remove('hidden');
          respModalidadesContainer.setAttribute('aria-hidden', 'false');
        } else {
          respModalidadesContainer.classList.add('hidden');
          respModalidadesContainer.setAttribute('aria-hidden', 'true');
        }
      });

      // Mostrar/ocultar área do cônjuge
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

      // Mostrar/ocultar modalidades do cônjuge
      conjHasModalidade.addEventListener('change', function() {
        if (this.value === 'sim') {
          conjModalidadesContainer.classList.remove('hidden');
          conjModalidadesContainer.setAttribute('aria-hidden', 'false');
        } else {
          conjModalidadesContainer.classList.add('hidden');
          conjModalidadesContainer.setAttribute('aria-hidden', 'true');
        }
      });

      // Mostrar/ocultar área de filhos
      temFilhos.addEventListener('change', function() {
        if (this.value === 'sim') {
          filhosArea.classList.remove('hidden');
          filhosArea.setAttribute('aria-hidden', 'false');
        } else {
          filhosArea.classList.add('hidden');
          filhosArea.setAttribute('aria-hidden', 'true');
          listaFilhos.innerHTML = '';
        }
      });

      // Gerar campos para filhos
      qtdFilhos.addEventListener('input', function() {
        const qtd = parseInt(this.value) || 0;
        listaFilhos.innerHTML = '';
        for (let i = 0; i < qtd; i++) {
          const filhoDiv = document.createElement('div');
          filhoDiv.className = 'filho';
          filhoDiv.innerHTML = `
            <h4>Filho ${i + 1}</h4>
            <label>Nome completo</label>
            <input type="text" class="filho-nome" placeholder="Nome completo" required>
            <label>Idade (anos)</label>
            <input type="number" class="filho-idade" placeholder="Idade" required min="0">
            <label>Deseja se inscrever em alguma modalidade?</label>
            <select class="filho-has-modalidade">
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
            <div class="fmodalidades-wrapper hidden">
              <label>Modalidades</label>
              <div class="modalidades filho-modalidades"></div>
            </div>
          `;
          listaFilhos.appendChild(filhoDiv);
          
          const filhoModalidadesDiv = filhoDiv.querySelector('.filho-modalidades');
          criarModalidadesCheckboxes(filhoModalidadesDiv, MODALIDADES);
          
          const filhoHasModalidade = filhoDiv.querySelector('.filho-has-modalidade');
          const filhoModalidadesWrapper = filhoDiv.querySelector('.fmodalidades-wrapper');
          
          filhoHasModalidade.addEventListener('change', function() {
            if (this.value === 'sim') {
              filhoModalidadesWrapper.classList.remove('hidden');
            } else {
              filhoModalidadesWrapper.classList.add('hidden');
            }
          });
        }
      });

      // Submissão do formulário
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        salvarInscricao();
      });
    }

    // Criar modalidades (checkboxes)
    function criarModalidades(containerId, modalidades) {
      const container = document.getElementById(containerId);
      const modalidadesDiv = container.querySelector('.modalidades');
      modalidadesDiv.innerHTML = '';
      criarModalidadesCheckboxes(modalidadesDiv, modalidades);
    }

    function criarModalidadesCheckboxes(container, modalidades) {
      modalidades.forEach(function(modalidade) {
        const label = document.createElement('label');
        label.style.display = 'inline-flex';
        label.style.alignItems = 'center';
        label.style.gap = '6px';
        label.style.marginRight = '8px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = modalidade;
        checkbox.name = 'modalidade';
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(modalidade));
        container.appendChild(label);
      });
    }

    // Verificar se é pagante (até 15 anos não paga; 16+ paga)
    function ehPagante(idade) {
      return idade >= IDADE_PAGANTE_MIN;
    }
    
    function formatarMoeda(valor) {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    
    function obterPessoasDaInscricao(inscricao) {
      const pessoas = [];
      if (inscricao && inscricao.responsavel) pessoas.push(inscricao.responsavel);
      if (inscricao && inscricao.conjuge) pessoas.push(inscricao.conjuge);
      if (inscricao && Array.isArray(inscricao.filhos)) {
        inscricao.filhos.forEach(function(filho) { pessoas.push(filho); });
      }
      return pessoas;
    }

    // Salvar inscrição
    function salvarInscricao() {
      const form = document.getElementById('formInscricao');
      
      // Validar campos obrigatórios
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      
      // Validar cônjuge se selecionado
      if (document.getElementById('temConjuge').value === 'sim') {
        const conjNome = document.getElementById('conjNome').value.trim();
        const conjIdade = document.getElementById('conjIdade').value;
        if (!conjNome || !conjIdade) {
          alert('Por favor, preencha todos os dados do cônjuge.');
          return;
        }
      }
      
      // Validar filhos se selecionado
      if (document.getElementById('temFilhos').value === 'sim') {
        const qtdFilhos = parseInt(document.getElementById('qtdFilhos').value) || 0;
        const filhosDivs = document.querySelectorAll('.filho');
        if (qtdFilhos === 0 || filhosDivs.length === 0) {
          alert('Por favor, informe a quantidade de filhos e preencha os dados.');
          return;
        }
        for (let i = 0; i < filhosDivs.length; i++) {
          const filhoNome = filhosDivs[i].querySelector('.filho-nome').value.trim();
          const filhoIdade = filhosDivs[i].querySelector('.filho-idade').value;
          if (!filhoNome || !filhoIdade) {
            alert(`Por favor, preencha todos os dados do filho ${i + 1}.`);
            return;
          }
        }
      }
      
      // Dados do responsável
      const responsavel = {
        nome: document.getElementById('respNome').value,
        idade: parseInt(document.getElementById('respIdade').value),
        modalidades: obterModalidadesSelecionadas('respModalidadesContainer'),
        tipo: 'responsavel',
        pagante: ehPagante(parseInt(document.getElementById('respIdade').value))
      };

      const inscricao = {
        id: Date.now(),
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

      // Dados do cônjuge
      if (document.getElementById('temConjuge').value === 'sim') {
        const conjIdade = parseInt(document.getElementById('conjIdade').value);
        inscricao.conjuge = {
          nome: document.getElementById('conjNome').value,
          idade: conjIdade,
          modalidades: obterModalidadesSelecionadas('conjModalidadesContainer'),
          tipo: 'conjuge',
          pagante: ehPagante(conjIdade)
        };
      }

      // Dados dos filhos
      const filhosDivs = document.querySelectorAll('.filho');
      filhosDivs.forEach(function(filhoDiv) {
        const filhoIdade = parseInt(filhoDiv.querySelector('.filho-idade').value);
        const filho = {
          nome: filhoDiv.querySelector('.filho-nome').value,
          idade: filhoIdade,
          modalidades: obterModalidadesSelecionadasFilho(filhoDiv),
          tipo: 'filho',
          pagante: ehPagante(filhoIdade)
        };
        inscricao.filhos.push(filho);
      });

      // Salvar no localStorage
      let inscricoes = db.collection("inscricoes").get().then(snapshot => {
  snapshot.forEach(doc => {
    const inscricao = { id: doc.id, ...doc.data() };
  });
});
      inscricoes.push(inscricao);
    db.collection("inscricoes").add(inscricao);


      // Limpar formulário
      form.reset();
      document.getElementById('respModalidadesContainer').classList.add('hidden');
      document.getElementById('conjugeArea').classList.add('hidden');
      document.getElementById('filhosArea').classList.add('hidden');
      document.getElementById('listaFilhos').innerHTML = '';

      // Mensagem final com valores e PIX
      const pessoasInscricao = obterPessoasDaInscricao(inscricao);
      const qtdPagantes = pessoasInscricao.filter(function(p) { return ehPagante(p.idade); }).length;
      const totalPagar = qtdPagantes * VALOR_POR_PAGANTE;
      
      alert(
        'Inscrição realizada com sucesso!\n\n' +
        'Valor por pagante: ' + formatarMoeda(VALOR_POR_PAGANTE) + '\n' +
        'Total a pagar: ' + formatarMoeda(totalPagar) + '\n\n' +
        'Pagamento via PIX:\n' +
        'Chave pix: 38 999216747\n' +
        'Nome: Lucivania da Silva Oliveira\n'
      );
    }

    // Obter modalidades selecionadas
    function obterModalidadesSelecionadas(containerId) {
      const container = document.getElementById(containerId);
      const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

    function obterModalidadesSelecionadasFilho(filhoDiv) {
      const checkboxes = filhoDiv.querySelectorAll('input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

    // Inicializar login admin
    function inicializarLoginAdmin() {
      const formLogin = document.getElementById('formLoginAdmin');
      const btnSair = document.getElementById('btnSairAdmin');

      formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        const senha = document.getElementById('adminSenha').value;
        if (senha === ADMIN_SENHA) {
          mostrarDashboard();
        } else {
          alert('Senha incorreta!');
        }
      });

     btnSair.addEventListener('click', function() {
  mostrarFormulario();
  adicionarLinkAdmin();
});

    }

    // Atualizar dashboard
    function atualizarDashboard() {
      const inscricoes = db.collection("inscricoes").get().then(snapshot => {
  snapshot.forEach(doc => {
    const inscricao = { id: doc.id, ...doc.data() };
  });
});
      const listaInscricoes = document.getElementById('listaInscricoes');
      const listaPagantesOrganizada = document.getElementById('listaPagantesOrganizada');
      const listaNaoPagantesOrganizada = document.getElementById('listaNaoPagantesOrganizada');
      const listasPorModalidade = document.getElementById('listasPorModalidade');
      
      let totalPagantes = 0;
      let totalNaoPagantes = 0;
      
      const nomesPagantes = [];
      const nomesNaoPagantes = [];
      const pessoasPorModalidade = {};
      MODALIDADES.forEach(function(m) { pessoasPorModalidade[m] = []; });

      listaInscricoes.innerHTML = '';
      if (listaPagantesOrganizada) listaPagantesOrganizada.innerHTML = '';
      if (listaNaoPagantesOrganizada) listaNaoPagantesOrganizada.innerHTML = '';
      if (listasPorModalidade) listasPorModalidade.innerHTML = '';

      if (inscricoes.length === 0) {
        listaInscricoes.innerHTML = '<p style="color: #fff;">Nenhuma inscrição cadastrada ainda.</p>';
      } else {
        inscricoes.forEach(function(inscricao) {
          const item = document.createElement('div');
          item.className = 'inscricao-item';
          
          let pessoasHTML = '';
          
          // Responsável
          const respPagante = ehPagante(inscricao.responsavel.idade);
          pessoasHTML += `
            <div class="pessoa-info">
              <p><strong>Responsável:</strong> ${inscricao.responsavel.nome}</p>
              <p><strong>Idade:</strong> ${inscricao.responsavel.idade} anos</p>
              <p><strong>Status:</strong> ${respPagante ? 'Pagante' : 'Não Pagante'}</p>
              <p><strong>Modalidades:</strong> ${inscricao.responsavel.modalidades.length > 0 ? inscricao.responsavel.modalidades.join(', ') : 'Nenhuma'}</p>
            </div>
          `;
          if (respPagante) { totalPagantes++; nomesPagantes.push(inscricao.responsavel.nome); }
          else { totalNaoPagantes++; nomesNaoPagantes.push(inscricao.responsavel.nome); }
          if (Array.isArray(inscricao.responsavel.modalidades)) {
            inscricao.responsavel.modalidades.forEach(function(mod) {
              if (!pessoasPorModalidade[mod]) pessoasPorModalidade[mod] = [];
              pessoasPorModalidade[mod].push({ nome: inscricao.responsavel.nome, pagante: respPagante });
            });
          }
          
          // Cônjuge
          if (inscricao.conjuge) {
            const conjPagante = ehPagante(inscricao.conjuge.idade);
            pessoasHTML += `
              <div class="pessoa-info">
                <p><strong>Cônjuge:</strong> ${inscricao.conjuge.nome}</p>
                <p><strong>Idade:</strong> ${inscricao.conjuge.idade} anos</p>
                <p><strong>Status:</strong> ${conjPagante ? 'Pagante' : 'Não Pagante'}</p>
                <p><strong>Modalidades:</strong> ${inscricao.conjuge.modalidades.length > 0 ? inscricao.conjuge.modalidades.join(', ') : 'Nenhuma'}</p>
              </div>
            `;
            if (conjPagante) { totalPagantes++; nomesPagantes.push(inscricao.conjuge.nome); }
            else { totalNaoPagantes++; nomesNaoPagantes.push(inscricao.conjuge.nome); }
            if (Array.isArray(inscricao.conjuge.modalidades)) {
              inscricao.conjuge.modalidades.forEach(function(mod) {
                if (!pessoasPorModalidade[mod]) pessoasPorModalidade[mod] = [];
                pessoasPorModalidade[mod].push({ nome: inscricao.conjuge.nome, pagante: conjPagante });
              });
            }
          }
          
          // Filhos
          if (inscricao.filhos.length > 0) {
            inscricao.filhos.forEach(function(filho) {
              const filhoPagante = ehPagante(filho.idade);
              pessoasHTML += `
                <div class="pessoa-info filho-detalhe">
                  <p><strong>Filho:</strong> ${filho.nome}</p>
                  <p><strong>Idade:</strong> ${filho.idade} anos</p>
                  <p><strong>Status:</strong> ${filhoPagante ? 'Pagante' : 'Não Pagante'}</p>
                  <p><strong>Modalidades:</strong> ${filho.modalidades.length > 0 ? filho.modalidades.join(', ') : 'Nenhuma'}</p>
                </div>
              `;
              if (filhoPagante) { totalPagantes++; nomesPagantes.push(filho.nome); }
              else { totalNaoPagantes++; nomesNaoPagantes.push(filho.nome); }
              if (Array.isArray(filho.modalidades)) {
                filho.modalidades.forEach(function(mod) {
                  if (!pessoasPorModalidade[mod]) pessoasPorModalidade[mod] = [];
                  pessoasPorModalidade[mod].push({ nome: filho.nome, pagante: filhoPagante });
                });
              }
            });
          }
          
item.innerHTML = `
  <h3>Inscrição #${inscricao.id}</h3>
  ${pessoasHTML}

  <div class="endereco-info">
    <p><strong>Endereço:</strong> ${inscricao.endereco.rua}, ${inscricao.endereco.numero} - ${inscricao.endereco.bairro}</p>
  </div>

  <div class="data-info">
    <p>Cadastrado em: ${inscricao.data}</p>
  </div>

  <button class="btn-small btn-excluir" data-id="${inscricao.id}">
    Excluir inscrição
  </button>
`;

          
        

          listaInscricoes.appendChild(item);

item.querySelector('.btn-excluir')
  .addEventListener('click', function () {
    excluirInscricao(inscricao.id);
  });

        });
      }

      // Atualizar estatísticas
      document.getElementById('totalPagantes').textContent = totalPagantes;
      document.getElementById('totalNaoPagantes').textContent = totalNaoPagantes;
      document.getElementById('totalInscricoes').textContent = inscricoes.length;
      
      // Renderizar listas organizadas
      if (listaPagantesOrganizada) {
        listaPagantesOrganizada.innerHTML = '';
        if (nomesPagantes.length === 0) {
          const li = document.createElement('li');
          li.style.color = '#fff';
          li.textContent = 'Nenhum pagante cadastrado.';
          listaPagantesOrganizada.appendChild(li);
        } else {
          nomesPagantes.forEach(function(nome) {
            const li = document.createElement('li');
            li.textContent = nome;
            listaPagantesOrganizada.appendChild(li);
          });
        }
      }
      
      if (listaNaoPagantesOrganizada) {
        listaNaoPagantesOrganizada.innerHTML = '';
        if (nomesNaoPagantes.length === 0) {
          const li = document.createElement('li');
          li.style.color = '#fff';
          li.textContent = 'Nenhum não pagante cadastrado.';
          listaNaoPagantesOrganizada.appendChild(li);
        } else {
          nomesNaoPagantes.forEach(function(nome) {
            const li = document.createElement('li');
            li.textContent = nome;
            listaNaoPagantesOrganizada.appendChild(li);
          });
        }
      }
      
      if (listasPorModalidade) {
        listasPorModalidade.innerHTML = '';
        
        MODALIDADES.forEach(function(modalidade) {
          const bloco = document.createElement('div');
          bloco.style.marginTop = '12px';
          
          const titulo = document.createElement('h3');
          titulo.style.color = '#fff';
          titulo.style.margin = '10px 0';
          titulo.textContent = 'Modalidade: ' + modalidade;
          
          const ol = document.createElement('ol');
          const itens = pessoasPorModalidade[modalidade] || [];
          
          if (itens.length === 0) {
            const li = document.createElement('li');
            li.style.color = '#fff';
            li.textContent = 'Nenhum inscrito nesta modalidade.';
            ol.appendChild(li);
          } else {
            itens.forEach(function(p) {
              const li = document.createElement('li');
              li.textContent = p.nome + ' – ' + (p.pagante ? 'Pagante' : 'Não Pagante');
              ol.appendChild(li);
            });
          }
          
          bloco.appendChild(titulo);
          bloco.appendChild(ol);
          listasPorModalidade.appendChild(bloco);
        });
      }
    }

    // Adicionar link de acesso admin ao formulário
function adicionarLinkAdmin() {
  const form = document.getElementById('formInscricao');

  if (form && !document.getElementById('linkAdmin')) {
    const adminLink = document.createElement('a');
    adminLink.id = 'linkAdmin';
    adminLink.href = '#';
    adminLink.textContent = 'Acesso Admin';
    adminLink.style.cssText = `
      display: block;
      text-align: center;
      margin-top: 20px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      font-size: 0.85rem;
    `;

    adminLink.addEventListener('click', function(e) {
      e.preventDefault();
      mostrarLogin();
    });

    form.appendChild(adminLink);
  }
}


    /* ===============================
   PDF – RELATÓRIO DASHBOARD
=============================== */

function salvarDashboardPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const inscricoes = db.collection("inscricoes").get().then(snapshot => {
  snapshot.forEach(doc => {
    const inscricao = { id: doc.id, ...doc.data() };
  });
});
  let y = 15;

  /* TÍTULO */
  doc.setFontSize(16);
  doc.text('Relatório de Inscrições – AVEPIB', 10, y);
  y += 12;

  if (inscricoes.length === 0) {
    doc.setFontSize(11);
    doc.text('Nenhuma inscrição cadastrada.', 10, y);
    doc.save('relatorio-inscricoes-avepib.pdf');
    return;
  }

  /* ===============================
     1) DETALHAMENTO DAS INSCRIÇÕES
  =============================== */
  inscricoes.forEach((inscricao, index) => {
    doc.setFontSize(14);
    doc.text(`Inscrição #${index + 1}`, 10, y);
    y += 8;

    doc.setFontSize(11);

    // Responsável
    doc.text(
      `Responsável: ${inscricao.responsavel.nome} (${inscricao.responsavel.idade} anos) – ${inscricao.responsavel.pagante ? 'Pagante' : 'Não Pagante'}`,
      10,
      y
    );
    y += 6;

    if (inscricao.responsavel.modalidades.length > 0) {
      doc.text(
        `Modalidades: ${inscricao.responsavel.modalidades.join(', ')}`,
        12,
        y
      );
      y += 6;
    }

    // Cônjuge
    if (inscricao.conjuge) {
      doc.text(
        `Cônjuge: ${inscricao.conjuge.nome} (${inscricao.conjuge.idade} anos) – ${inscricao.conjuge.pagante ? 'Pagante' : 'Não Pagante'}`,
        10,
        y
      );
      y += 6;

      if (inscricao.conjuge.modalidades.length > 0) {
        doc.text(
          `Modalidades: ${inscricao.conjuge.modalidades.join(', ')}`,
          12,
          y
        );
        y += 6;
      }
    }

    // Filhos
    if (inscricao.filhos.length > 0) {
      inscricao.filhos.forEach(filho => {
        doc.text(
          `Filho: ${filho.nome} (${filho.idade} anos) – ${filho.pagante ? 'Pagante' : 'Não Pagante'}`,
          10,
          y
        );
        y += 6;

        if (filho.modalidades.length > 0) {
          doc.text(
            `Modalidades: ${filho.modalidades.join(', ')}`,
            12,
            y
          );
          y += 6;
        }
      });
    }

    // Endereço
    doc.text(
      `Endereço: ${inscricao.endereco.rua}, ${inscricao.endereco.numero} – ${inscricao.endereco.bairro}`,
      10,
      y
    );
    y += 6;

    // Data
    doc.text(`Data da inscrição: ${inscricao.data}`, 10, y);
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  });

  /* ===============================
     2) RESUMO GERAL (IGUAL DASHBOARD)
  =============================== */
  doc.addPage();
  y = 15;

  doc.setFontSize(16);
  doc.text('Resumo Geral', 10, y);
  y += 12;

  const nomesPagantes = [];
  const nomesNaoPagantes = [];
  const pessoasPorModalidade = {};
  MODALIDADES.forEach(m => pessoasPorModalidade[m] = []);

  inscricoes.forEach(inscricao => {
    const pessoas = obterPessoasDaInscricao(inscricao);
    pessoas.forEach(pessoa => {
      pessoa.pagante
        ? nomesPagantes.push(pessoa.nome)
        : nomesNaoPagantes.push(pessoa.nome);

      if (Array.isArray(pessoa.modalidades)) {
        pessoa.modalidades.forEach(mod => {
          pessoasPorModalidade[mod].push({
            nome: pessoa.nome,
            pagante: pessoa.pagante
          });
        });
      }
    });
  });

  /* Pagantes */
  doc.setFontSize(14);
  doc.text('Lista numerada de Pagantes', 10, y);
  y += 8;
  doc.setFontSize(11);

  if (nomesPagantes.length === 0) {
    doc.text('Nenhum pagante cadastrado.', 10, y);
  } else {
    nomesPagantes.forEach((nome, i) => {
      doc.text(`${i + 1}. ${nome}`, 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 15; }
    });
  }

  y += 10;

  /* Não pagantes */
  doc.setFontSize(14);
  doc.text('Lista numerada de Não Pagantes', 10, y);
  y += 8;
  doc.setFontSize(11);

  if (nomesNaoPagantes.length === 0) {
    doc.text('Nenhum não pagante cadastrado.', 10, y);
  } else {
    nomesNaoPagantes.forEach((nome, i) => {
      doc.text(`${i + 1}. ${nome}`, 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 15; }
    });
  }

  y += 10;

  /* Modalidades */
  doc.setFontSize(14);
  doc.text('Listas por Modalidade', 10, y);
  y += 8;

  MODALIDADES.forEach(modalidade => {
    doc.setFontSize(12);
    doc.text(`Modalidade: ${modalidade}`, 10, y);
    y += 6;

    doc.setFontSize(11);
    const lista = pessoasPorModalidade[modalidade];

    if (lista.length === 0) {
      doc.text('Nenhum inscrito nesta modalidade.', 12, y);
      y += 6;
    } else {
      lista.forEach(pessoa => {
        doc.text(
          `${pessoa.nome} – ${pessoa.pagante ? 'Pagante' : 'Não Pagante'}`,
          12,
          y
        );
        y += 6;
        if (y > 270) { doc.addPage(); y = 15; }
      });
    }

    y += 8;
    if (y > 270) { doc.addPage(); y = 15; }
  });

  /* SALVAR */
  doc.save('relatorio-inscricoes-avepib.pdf');
}

/* ===============================
   BOTÃO PDF NO DASHBOARD
=============================== */
function adicionarBotaoPDF() {
  const adminHeader = document.querySelector('#adminDashboard .admin-header');
  if (!adminHeader || document.getElementById('btnSalvarPDF')) return;

  const btn = document.createElement('button');
  btn.id = 'btnSalvarPDF';
  btn.textContent = 'Salvar PDF';
  btn.className = 'btn-small';
  btn.style.marginLeft = '10px';

  btn.addEventListener('click', salvarDashboardPDF);
  adminHeader.appendChild(btn);
}
function excluirInscricao(id) {
  if (!confirm('Tem certeza que deseja excluir esta inscrição?')) return;

  let inscricoes = db.collection("inscricoes").get().then(snapshot => {
  snapshot.forEach(doc => {
    const inscricao = { id: doc.id, ...doc.data() };
  });
});

  inscricoes = inscricoes.filter(inscricao => inscricao.id !== id);

db.collection("inscricoes").doc(id).delete();


  atualizarDashboard();
}
