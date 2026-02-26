'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import styles from './page.module.css';

// Estrutura de dados do Lote
type Lote = {
  id: number;
  medicamento: string;
  numeroLote: string;
  validade: string;
  quantidade: number;
  status: 'normal' | 'vencendo' | 'vencido' | 'baixo_estoque';
};

export default function Lotes() {
  const router = useRouter();

  // Função inteligente para calcular o status real baseado na data de hoje
  const calcularStatusLote = (dataValidade: string, quantidade: number): Lote['status'] => {
    // Transforma a data "DD/MM/YYYY" do Brasil para o padrão que o JS entende
    const [dia, mes, ano] = dataValidade.split('/');
    const dataVal = new Date(Number(ano), Number(mes) - 1, Number(dia));
    
    // Pega a data exata de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar só o dia
    dataVal.setHours(0, 0, 0, 0);

    // Calcula a diferença de dias entre hoje e a validade
    const diferencaTempo = dataVal.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

    // REGRA 1: Validade tem prioridade máxima
    if (diferencaDias < 0) return 'vencido';          // Já passou de hoje
    if (diferencaDias <= 30) return 'vencendo';       // Vence em 30 dias ou menos
    
    // REGRA 2: Se a validade tá ok, checa o estoque
    if (quantidade === 0) return 'baixo_estoque';     // Sem estoque
    if (quantidade < 20) return 'baixo_estoque';      // Menos de 20 unidades acende o alerta

    // REGRA 3: Tudo certo!
    return 'normal';
  };

  // 1. ESTADOS (Dados e Interface)
  // Coloquei datas estratégicas para você ver os diferentes status em ação!
  const [lotes, setLotes] = useState<Lote[]>([
    { id: 1, medicamento: 'Omeprazol 20mg', numeroLote: '123456', validade: '15/03/2026', quantidade: 50, status: 'vencendo' },
    { id: 2, medicamento: 'Paracetamol 500mg', numeroLote: '789012', validade: '20/03/2026', quantidade: 120, status: 'vencendo' },
    { id: 3, medicamento: 'Amoxicilina 500mg', numeroLote: '345678', validade: '10/01/2026', quantidade: 0, status: 'vencido' },
    { id: 4, medicamento: 'Losartana 50mg', numeroLote: '901234', validade: '05/12/2026', quantidade: 220, status: 'normal' },
    { id: 5, medicamento: 'Dipirona 1g', numeroLote: '567890', validade: '20/11/2026', quantidade: 15, status: 'baixo_estoque' },
  ]);

  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modais
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [novoMed, setNovoMed] = useState('');
  const [novoNum, setNovoNum] = useState('');
  const [novaVal, setNovaVal] = useState('');
  const [novaQtd, setNovaQtd] = useState('');

  // 2. LÓGICAS INTELIGENTES
  
  // Conta quantos estão próximos do vencimento dinamicamente
  const qtdVencendo = lotes.filter(l => l.status === 'vencendo').length;

  // Filtro combinado: Busca por texto + Filtro por Status
  const lotesFiltrados = useMemo(() => {
    return lotes.filter(l => {
      const matchBusca = l.medicamento.toLowerCase().includes(termoBusca.toLowerCase()) || l.numeroLote.includes(termoBusca);
      const matchFiltro = filtroStatus === 'todos' || l.status === filtroStatus;
      return matchBusca && matchFiltro;
    });
  }, [lotes, termoBusca, filtroStatus]);

  // Função para Deletar
  const handleDeletar = (id: number) => {
    if (window.confirm("Atenção: Deseja excluir este lote do sistema?")) {
      setLotes(lotes.filter(l => l.id !== id));
    }
  };

  // Função para Adicionar (Calcula status automaticamente)
  const handleAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMed || !novoNum || !novaVal || !novaQtd) return alert("Preencha tudo!");

    const qtd = parseInt(novaQtd);
    const dataFormatada = novaVal.split('-').reverse().join('/'); // Converte YYYY-MM-DD para DD/MM/YYYY
    
    // Calcula o status real com a nossa função
    const statusCalculado = calcularStatusLote(dataFormatada, qtd);

    const novoLote: Lote = {
      id: Date.now(),
      medicamento: novoMed,
      numeroLote: novoNum,
      quantidade: qtd,
      validade: dataFormatada,
      status: statusCalculado,
    };

    setLotes([novoLote, ...lotes]); // Adiciona no topo da lista
    setModalNovoOpen(false);
    
    // Limpa os campos após salvar
    setNovoMed(''); setNovoNum(''); setNovaVal(''); setNovaQtd('');
  };

  // Função auxiliar para renderizar a etiqueta (Badge) correta
  const renderBadge = (status: Lote['status']) => {
    switch(status) {
      case 'vencendo': return <span className={`${styles.badge} ${styles.badgeWarning}`}>⚠️ Próximo do vencimento</span>;
      case 'vencido': return <span className={`${styles.badge} ${styles.badgeDanger}`}>❌ Vencido</span>;
      case 'baixo_estoque': return <span className={`${styles.badge} ${styles.badgeWarning}`}>📉 Estoque baixo</span>;
      case 'normal': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>✅ Normal</span>;
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        
        {/* CABEÇALHO */}
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <button onClick={() => router.back()} className={styles.backButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <h1 className={styles.title}>GESTÃO DE LOTES DE MEDICAMENTOS</h1>
          </div>
          <button onClick={() => setModalNovoOpen(true)} className={styles.newButton}>
            + NOVO LOTE
          </button>
        </header>

        {/* ALERTA DINÂMICO DE VENCIMENTO */}
        {qtdVencendo > 0 && (
          <div className={styles.alertBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <strong>{qtdVencendo} {qtdVencendo === 1 ? 'lote próximo' : 'lotes próximos'} do vencimento</strong>
            <button className={styles.alertArrow}>&gt;</button>
          </div>
        )}

        <div className={styles.mainContent}>
          
          <div className={styles.tableSection}>
            {/* CONTROLES DE BUSCA E FILTRO */}
            <div className={styles.searchBar}>
              <div className={styles.inputGroup}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Buscar medicamento ou lote..." 
                  className={styles.searchInput}
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>

              {/* Dropdown de Filtro Inovador */}
              <div className={styles.filterWrapper}>
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={styles.filterButton}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  FILTRAR
                </button>
                
                {isFilterOpen && (
                  <div className={styles.dropdownMenu}>
                    <button onClick={() => {setFiltroStatus('todos'); setIsFilterOpen(false)}} className={filtroStatus === 'todos' ? styles.activeFilter : ''}>🟣 Todos os lotes</button>
                    <button onClick={() => {setFiltroStatus('vencendo'); setIsFilterOpen(false)}} className={filtroStatus === 'vencendo' ? styles.activeFilter : ''}>⚠️ Próximos do vencimento</button>
                    <button onClick={() => {setFiltroStatus('vencido'); setIsFilterOpen(false)}} className={filtroStatus === 'vencido' ? styles.activeFilter : ''}>❌ Vencidos</button>
                    <button onClick={() => {setFiltroStatus('baixo_estoque'); setIsFilterOpen(false)}} className={filtroStatus === 'baixo_estoque' ? styles.activeFilter : ''}>📉 Estoque baixo</button>
                  </div>
                )}
              </div>
            </div>

            {/* TABELA DE LOTES */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Medicamento</th>
                    <th>Nº do Lote</th>
                    <th>Validade</th>
                    <th>Quantidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesFiltrados.length > 0 ? (
                    lotesFiltrados.map((lote) => (
                      <tr key={lote.id}>
                        <td><strong>{lote.medicamento}</strong></td>
                        <td>{lote.numeroLote}</td>
                        <td>{lote.validade}</td>
                        <td>{lote.quantidade}</td>
                        <td>{renderBadge(lote.status)}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.viewBtn} title="Visualizar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                            <button className={styles.editBtn} title="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            <button onClick={() => handleDeletar(lote.id)} className={styles.deleteBtn} title="Excluir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum lote encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className={styles.paginationArea}>
              <span className={styles.paginationInfo}>Mostrando {lotesFiltrados.length} de {lotes.length} lotes</span>
            </div>
          </div>
          
          <div className={styles.imageSection}>
             {/* Ilustração mantida do seu design */}
             <img src="https://placehold.co/300x300/ffffff/609dff?text=Farmacia+Ilustracao" alt="Ilustração farmácia" className={styles.illustration} />
          </div>

        </div>
      </div>

      {/* MODAL NOVO LOTE */}
      {modalNovoOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Registrar Novo Lote</h2>
            <form onSubmit={handleAdicionar} className={styles.modalForm}>
              <input type="text" placeholder="Nome do Medicamento (ex: Dipirona)" value={novoMed} onChange={e => setNovoMed(e.target.value)} className={styles.modalInput} required />
              <div className={styles.inputRow}>
                <input type="text" placeholder="Nº do Lote" value={novoNum} onChange={e => setNovoNum(e.target.value)} className={styles.modalInput} required />
                <input type="number" placeholder="Quantidade" value={novaQtd} onChange={e => setNovaQtd(e.target.value)} className={styles.modalInput} required />
              </div>
              <label className={styles.inputLabel}>Data de Validade:</label>
              <input type="date" value={novaVal} onChange={e => setNovaVal(e.target.value)} className={styles.modalInput} required />
              
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setModalNovoOpen(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.saveBtn}>Salvar Lote</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}