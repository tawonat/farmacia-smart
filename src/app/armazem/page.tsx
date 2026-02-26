'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import styles from './page.module.css';

// Estrutura de dados do Lote
type Lote = {
  id: number;
  numeroLote: string;
  validade: string;
  quantidade: number;
  status: 'normal' | 'vencendo' | 'vencido' | 'baixo_estoque';
  localizacao: string;
};

// Estrutura de dados do Medicamento
type MedicamentoTableData = {
  id: number;
  codigo: string;
  nome: string;
  laboratorio: string;
  totalEstoque: number;
  lotes: Lote[];
};

export default function Armazem() {
  const router = useRouter();

  // 1. ESTADOS (Dados e Interface)
  const [medicamentos, setMedicamentos] = useState<MedicamentoTableData[]>([
    { 
      id: 1, codigo: 'SKU12345', nome: 'Omeprazol 20mg', laboratorio: 'Laboratório A', totalEstoque: 170, 
      lotes: [
        { id: 101, numeroLote: 'L123456', validade: '15/03/2026', quantidade: 50, status: 'vencendo', localizacao: 'C-A/P2' },
        { id: 102, numeroLote: 'L789012', validade: '20/03/2026', quantidade: 120, status: 'vencendo', localizacao: 'C-B/P1' },
      ]
    },
    { 
      id: 2, codigo: 'SKU67890', nome: 'Paracetamol 500mg', laboratorio: 'Laboratório B', totalEstoque: 120,
      lotes: [
        { id: 201, numeroLote: 'P123456', validade: '10/06/2026', quantidade: 120, status: 'normal', localizacao: 'C-C/P4' },
      ]
    },
    { 
      id: 3, codigo: 'SKU54321', nome: 'Amoxicilina 500mg', laboratorio: 'Laboratório C', totalEstoque: 0,
      lotes: [
        { id: 301, numeroLote: 'A123456', validade: '10/01/2026', quantidade: 0, status: 'vencido', localizacao: 'C-D/P3' },
      ]
    },
    { 
      id: 4, codigo: 'SKU98765', nome: 'Losartana 50mg', laboratorio: 'Laboratório A', totalEstoque: 220,
      lotes: [
        { id: 401, numeroLote: 'LOS1234', validade: '05/12/2026', quantidade: 220, status: 'normal', localizacao: 'C-E/P2' },
      ]
    },
    { 
      id: 5, codigo: 'SKU11223', nome: 'Dipirona 1g', laboratorio: 'Laboratório B', totalEstoque: 15,
      lotes: [
        { id: 501, numeroLote: 'DIP1234', validade: '20/11/2026', quantidade: 15, status: 'baixo_estoque', localizacao: 'C-F/P1' },
      ]
    },
  ]);

  const [termoBusca, setTermoBusca] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  // 2. LÓGICAS INTELIGENTES
  
  // Filtro de Busca
  const medicamentosFiltrados = useMemo(() => {
    return medicamentos.filter(med =>med.nome.toLowerCase().includes(termoBusca.toLowerCase()) || med.codigo.includes(termoBusca));
  }, [medicamentos, termoBusca]);

  // Expandir/recolher linha
  const toggleRow = (medId: number) => {
    setExpandedRows(prev => ({...prev, [medId]: !prev[medId] }));
  };

  // Função para deletar um lote específico
  const handleDeletarLote = (medicamentoId: number, loteId: number) => {
    if (window.confirm("Atenção: Deseja realmente excluir este lote do sistema?")) {
      setMedicamentos(prevMedicamentos => 
        prevMedicamentos.map(med => {
          if (med.id === medicamentoId) {
            const novosLotes = med.lotes.filter(l => l.id !== loteId);
            const novoTotal = novosLotes.reduce((acc, lote) => acc + lote.quantidade, 0);
            return { ...med, lotes: novosLotes, totalEstoque: novoTotal };
          }
          return med;
        })
      );
    }
  };

  // Renderizar o Badge
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
            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <h1 className={styles.title}>ARMAZÉM & GESTÃO DE ESTOQUE</h1>
          </div>
          <button className={styles.newButton}>+ REGISTRAR ENTRADA/LOTE</button>
        </header>

        <div className={styles.mainContent}>
          
          <div className={styles.tableSection}>
            {/* CONTROLES DE BUSCA E FILTRO */}
            <div className={styles.searchBar}>
              <div className={styles.inputGroup}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Buscar medicamento ou código SKU..." 
                  className={styles.searchInput}
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <button className={styles.searchButton}>BUSCAR</button>
              </div>
              <button className={styles.filterButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                FILTRAR
              </button>
            </div>

            {/* TABELA DE MEDICAMENTOS EXPANSÍVEL */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Código/SKU</th>
                    <th>Nome do Medicamento</th>
                    <th>Laboratório</th>
                    {/* 👇 Correção de Design: Título centralizado */}
                    <th style={{ textAlign: 'center' }}>Total em Estoque</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {medicamentosFiltrados.length > 0 ? (
                    medicamentosFiltrados.map((med) => (
                      <React.Fragment key={med.id}>
                        <tr>
                          <td><strong>{med.codigo}</strong></td>
                          <td>
                            <div className={styles.medNameCell}>
                                <button onClick={() => toggleRow(med.id)} className={`${styles.expandButton} ${expandedRows[med.id] ? styles.expanded : ''}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                                <strong>{med.nome}</strong>
                            </div>
                          </td>
                          <td>{med.laboratorio}</td>
                          {/* 👇 Correção de Design: Valores centralizados */}
                          <td style={{ textAlign: 'center' }}><strong>{med.totalEstoque} un.</strong></td>
                          <td>
                            {/* Centralizei os botões também para acompanhar */}
                            <div className={styles.actionButtons} style={{ justifyContent: 'center' }}>
                              <button className={styles.viewBtn} title="Visualizar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                              <button className={styles.editBtn} title="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            </div>
                          </td>
                        </tr>
                        {/* SEÇÃO EXPANSÍVEL */}
                        {expandedRows[med.id] && med.lotes.length > 0 && (
                            <tr className={styles.expandedRow}>
                                <td colSpan={5}>
                                    <div className={styles.loteDetailsContainer}>
                                        <h3>Lotes Individuais de {med.nome}</h3>
                                        <table className={styles.loteTable}>
                                            <thead>
                                                <tr>
                                                    <th>Nº do Lote</th>
                                                    <th>Validade</th>
                                                    {/* 👇 Correção de Design: Título da sub-tabela centralizado */}
                                                    <th style={{ textAlign: 'center' }}>Quantidade</th>
                                                    <th>Status</th>
                                                    <th>Localização</th>
                                                    <th style={{ textAlign: 'center' }}>Ações de Lote</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {med.lotes.map(lote => (
                                                    <tr key={lote.id}>
                                                        <td>{lote.numeroLote}</td>
                                                        <td>{lote.validade}</td>
                                                        {/* 👇 Correção de Design: Valores da sub-tabela centralizados */}
                                                        <td style={{ textAlign: 'center' }}><strong>{lote.quantidade} un.</strong></td>
                                                        <td>{renderBadge(lote.status)}</td>
                                                        <td><strong>{lote.localizacao}</strong></td>
                                                        <td>
                                                            <div className={styles.actionButtons} style={{ justifyContent: 'center' }}>
                                                                <button className={styles.viewBtn} title="Visualizar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                                                                <button className={styles.editBtn} title="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                                                <button className={styles.transferBtn} title="Transferir Localização"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg></button>
                                                                <button className={styles.deleteBtn} title="Excluir do Lote" onClick={() => handleDeletarLote(med.id, lote.id)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                                                <button className={styles.printBtn} title="Imprimir Etiqueta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {expandedRows[med.id] && med.lotes.length === 0 && (
                            <tr className={styles.expandedRow}>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#888' }}>
                                    Nenhum lote individual cadastrado para {med.nome}.
                                </td>
                            </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum medicamento encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className={styles.paginationArea}>
              <span className={styles.paginationInfo}>Mostrando {medicamentosFiltrados.length} de {medicamentos.length} medicamentos</span>
              <div className={styles.paginationControls}>
                  <button className={styles.pageBtn}>Anterior</button>
                  <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
                  <button className={styles.pageBtn}>2</button>
                  <button className={styles.pageBtn}>Próximo</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}