// Tenta carregar os dados do LocalStorage, se não existir, inicia um array vazio
let estoque = JSON.parse(localStorage.getItem('estoqueData')) || [];

// Função principal para adicionar produtos
function adicionarProduto() {
    const nome = document.getElementById('nome').value.trim();
    const qtd = parseInt(document.getElementById('qtd').value);
    const categoria = document.getElementById('categoria').value.trim() || "Geral";

    // 1. Validação de campos vazios
    if (nome === '' || isNaN(qtd)) {
        alert("Preencha o nome e uma quantidade válida!");
        return;
    }

    // 2. Verificação de Duplicidade (Ignora maiúsculas/minúsculas)
    const itemExistente = estoque.some(item => item.nome.toLowerCase() === nome.toLowerCase());
    if (itemExistente) {
        alert(`O produto "${nome}" já está cadastrado!`);
        return;
    }

    // 3. Adiciona ao array
    estoque.push({ nome, qtd, categoria });
    salvarEAtualizar();
    
    // Limpa os campos após adicionar
    document.getElementById('nome').value = '';
    document.getElementById('qtd').value = '';
    document.getElementById('categoria').value = '';
}

// Função para desenhar a tabela na tela
function renderizarTabela() {
    const container = document.getElementById('tabelaEstoque');
    const termoBusca = document.getElementById('busca').value.toLowerCase();
    container.innerHTML = '';

    // Agrupar itens por categoria (Pastas)
    const categorias = {};
    estoque.forEach((item, index) => {
        const correspondeBusca = item.nome.toLowerCase().includes(termoBusca) || 
                                 item.categoria.toLowerCase().includes(termoBusca);

        if (correspondeBusca) {
            if (!categorias[item.categoria]) {
                categorias[item.categoria] = [];
            }
            categorias[item.categoria].push({ ...item, originalIndex: index });
        }
    });

    // Criar o HTML das pastas e tabelas
    for (let nomeCat in categorias) {
        const divCat = document.createElement('div');
        divCat.className = 'categoria-section';
        
        // Se estiver pesquisando, a pasta já nasce aberta (show)
        const classeAberta = termoBusca !== "" ? "show" : "";

        divCat.innerHTML = `
            <h2 class="folder-title" onclick="togglePasta(this)">
                <span>📂 ${nomeCat}</span>
                <i class="seta">▶</i>
            </h2>
            <div class="folder-content ${classeAberta}">
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Qtd</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${categorias[nomeCat].map(item => `
                            <tr>
                                <td>${item.nome}</td>
                                <td>
                                    <button class="btn-qtd" onclick="alterarQuantidade(${item.originalIndex}, -1)">-</button>
                                    <span class="qtd-click">${item.qtd}</span>
                                    <button class="btn-qtd" onclick="alterarQuantidade(${item.originalIndex}, 1)">+</button>
                                </td>
                                <td>
                                    <button class="btn-delete" onclick="removerItem(${item.originalIndex})">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`;
        container.appendChild(divCat);
    }
}

// Abre e fecha a pasta ao clicar
function togglePasta(elemento) {
    const conteudo = elemento.nextElementSibling;
    conteudo.classList.toggle('show');
    
    const seta = elemento.querySelector('.seta');
    seta.style.transform = conteudo.classList.contains('show') ? "rotate(90deg)" : "rotate(0deg)";
}

// Altera a quantidade (Soma ou Subtração com prompt)
function alterarQuantidade(index, operacao) {
    const acao = operacao === 1 ? "adicionar" : "subtrair";
    const input = prompt(`Quanto deseja ${acao}?`);

    if (input !== null && !isNaN(input) && input.trim() !== '') {
        const valor = parseInt(input);
        if (operacao === 1) {
            estoque[index].qtd += valor;
        } else {
            estoque[index].qtd -= valor;
            if (estoque[index].qtd < 0) estoque[index].qtd = 0;
        }
        salvarEAtualizar();
    }
}

// Remove o item do estoque
function removerItem(index) {
    if (confirm("Tem certeza que deseja excluir este item?")) {
        estoque.splice(index, 1);
        salvarEAtualizar();
    }
}

// Salva no LocalStorage e redesenha a tela
function salvarEAtualizar() {
    localStorage.setItem('estoqueData', JSON.stringify(estoque));
    renderizarTabela();
}

// Chama a função ao carregar a página pela primeira vez
renderizarTabela();