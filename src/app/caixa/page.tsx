'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import styles from './page.module.css';

// Tipagens
type Produto = { id: number; codigo: string; nome: string; preco: number; estoque: number };
type ItemCarrinho = Produto & { quantidade: number; subtotal: number };

// Simulando um banco de dados rápido para o PDV
const PRODUTOS_MOCK: Produto[] = [
  { id: 1, codigo: '1000001', nome: 'Paracetamol 500mg', preco: 12.50, estoque: 170 },
  { id: 2, codigo: '2000102', nome: 'Ibuprofeno 200mg', preco: 18.90, estoque: 120 },
  { id: 3, codigo: '1000003', nome: 'Omeprazol 20mg', preco: 25.00, estoque: 220 },
  { id: 4, codigo: '2000104', nome: 'Dipirona Sódica 500mg', preco: 8.50, estoque: 15 },
  { id: 5, codigo: '3000505', nome: 'Amoxicilina 500mg (Controlado)', preco: 45.00, estoque: 50 },
];

export default function FrenteCaixa() {
  const router = useRouter();

  // Estados do Carrinho e Venda
  const [termoBusca, setTermoBusca] = useState('');
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [metodoPagamento, setMetodoPagamento] = useState<string>('credito');
  const [cpf, setCpf] = useState('');
  const [codigoReceita, setCodigoReceita] = useState('');

  // Adicionar item ao carrinho (simulando o "bipar" do leitor de código de barras)
  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      if (itemExistente) {
        return prev.map(item => 
          item.id === produto.id 
            ? { ...item, quantidade: item.quantidade + 1, subtotal: (item.quantidade + 1) * item.preco }
            : item
        );
      }
      return [...prev, { ...produto, quantidade: 1, subtotal: produto.preco }];
    });
    setTermoBusca(''); // Limpa a busca após adicionar
  };

  // Remover ou diminuir item
  const alterarQuantidade = (id: number, delta: number) => {
    setCarrinho(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const novaQtd = Math.max(1, item.quantidade + delta);
          return { ...item, quantidade: novaQtd, subtotal: novaQtd * item.preco };
        }
        return item;
      });
    });
  };

  const removerDoCarrinho = (id: number) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  // Cálculos automáticos
  const totalVenda = useMemo(() => carrinho.reduce((acc, item) => acc + item.subtotal, 0), [carrinho]);
  const totalItens = useMemo(() => carrinho.reduce((acc, item) => acc + item.quantidade, 0), [carrinho]);

  // Filtro de busca de produtos para adicionar
  const resultadosBusca = useMemo(() => {
    if (termoBusca.length < 2) return [];
    return PRODUTOS_MOCK.filter(p => 
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) || p.codigo.includes(termoBusca)
    );
  }, [termoBusca]);

  const finalizarVenda = () => {
    if (carrinho.length === 0) return alert('O carrinho está vazio!');
    // Aqui no futuro você integraria com a API para dar baixa no estoque do Armazém!
    alert(`Venda finalizada com sucesso!\nTotal: R$ ${totalVenda.toFixed(2)}\nMétodo: ${metodoPagamento.toUpperCase()}`);
    setCarrinho([]);
    setCpf('');
    setCodigoReceita('');
  };

  return (
    <main className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Voltar ao Painel
        </button>
        <h1 className={styles.title}>FRENTE DE CAIXA (PDV)</h1>
        <div className={styles.operatorInfo}>
          <div className={styles.avatar}></div>
          <span>Caixa 01 - Operador Padrão</span>
        </div>
      </div>

      <div className={styles.pdvLayout}>
        
        {/* LADO ESQUERDO: BUSCA E CARRINHO */}
        <section className={styles.leftPanel}>
          
          {/* Barra de Busca Dinâmica */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"></path></svg>
              <input 
                type="text" 
                placeholder="Código de barras, SKU ou Nome do medicamento..." 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className={styles.searchInput}
                autoFocus
              />
            </div>
            
            {/* Dropdown de resultados da busca */}
            {resultadosBusca.length > 0 && (
              <div className={styles.searchResults}>
                {resultadosBusca.map(produto => (
                  <div key={produto.id} className={styles.searchItem} onClick={() => adicionarAoCarrinho(produto)}>
                    <div className={styles.searchItemInfo}>
                      <strong>{produto.nome}</strong>
                      <span>Código: {produto.codigo} | Estoque: {produto.estoque} un.</span>
                    </div>
                    <span className={styles.searchItemPrice}>R$ {produto.preco.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabela do Carrinho */}
          <div className={styles.cartSection}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'center' }}>Qtd.</th>
                  <th style={{ textAlign: 'right' }}>V. Unit</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {carrinho.length > 0 ? (
                  carrinho.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.itemName}>
                          <span className={styles.itemIndex}>{index + 1}</span>
                          <div>
                            <strong>{item.nome}</strong>
                            <small>SKU: {item.codigo}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.qtyControl}>
                          <button onClick={() => alterarQuantidade(item.id, -1)}>-</button>
                          <span>{item.quantidade}</span>
                          <button onClick={() => alterarQuantidade(item.id, 1)}>+</button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>R$ {item.preco.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}><strong>R$ {item.subtotal.toFixed(2)}</strong></td>
                      <td style={{ textAlign: 'center' }}>
                        <button className={styles.deleteBtn} onClick={() => removerDoCarrinho(item.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.emptyCart}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                      <p>O carrinho está vazio. Bipe um produto para iniciar a venda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* LADO DIREITO: RESUMO E PAGAMENTO */}
        <section className={styles.rightPanel}>
          
          {/* Dados do Cliente / Receita */}
          <div className={styles.checkoutBox}>
            <h3 className={styles.boxTitle}>Dados da Venda</h3>
            <div className={styles.inputGroup}>
              <label>CPF do Cliente na Nota (Opcional)</label>
              <input type="text" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} />
            </div>
            {/* O SEGREDO DA FARMÁCIA: Vínculo com Receita */}
            <div className={styles.inputGroup}>
              <label className={styles.receitaLabel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Vincular Receita Médica
              </label>
              <input type="text" placeholder="Código da Receita (Ex: REC-1234)" value={codigoReceita} onChange={e => setCodigoReceita(e.target.value)} />
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className={styles.checkoutBox}>
            <h3 className={styles.boxTitle}>Pagamento</h3>
            <div className={styles.paymentMethods}>
              <button className={`${styles.payBtn} ${metodoPagamento === 'dinheiro' ? styles.activePay : ''}`} onClick={() => setMetodoPagamento('dinheiro')}>💵 Dinheiro</button>
              <button className={`${styles.payBtn} ${metodoPagamento === 'debito' ? styles.activePay : ''}`} onClick={() => setMetodoPagamento('debito')}>💳 Débito</button>
              <button className={`${styles.payBtn} ${metodoPagamento === 'credito' ? styles.activePay : ''}`} onClick={() => setMetodoPagamento('credito')}>💳 Crédito</button>
              <button className={`${styles.payBtn} ${metodoPagamento === 'pix' ? styles.activePay : ''}`} onClick={() => setMetodoPagamento('pix')}>💠 PIX</button>
            </div>
          </div>

          {/* Totais */}
          <div className={styles.totalsBox}>
            <div className={styles.totalRow}>
              <span>Total de Itens:</span>
              <span>{totalItens} un.</span>
            </div>
            <div className={styles.totalRow}>
              <span>Subtotal:</span>
              <span>R$ {totalVenda.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Desconto:</span>
              <span>R$ 0.00</span>
            </div>
            <div className={styles.grandTotal}>
              <span>TOTAL A PAGAR</span>
              <span>R$ {totalVenda.toFixed(2)}</span>
            </div>
          </div>

          <button className={styles.finishButton} onClick={finalizarVenda} disabled={carrinho.length === 0}>
            FINALIZAR VENDA
          </button>
          
        </section>
      </div>
    </main>
  );
}