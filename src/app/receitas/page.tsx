'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import styles from './page.module.css';

// Tipo de dado para ajudar o TypeScript
type Receita = {
  id: number;
  paciente: string;
  data: string;
  medico: string;
};

export default function Receitas() {
  const router = useRouter();

  // 1. ESTADOS (Memória da tela)
  const [receitas, setReceitas] = useState<Receita[]>([
    { id: 1, paciente: 'Maria Silva', data: '20/04/2024', medico: 'Dr. Roberto Oliveira' },
    { id: 2, paciente: 'José Souza', data: '18/04/2024', medico: 'Dr. Ana Martins' },
    { id: 3, paciente: 'Paula Menezes', data: '15/04/2024', medico: 'Dr. Fernando Costa' },
    { id: 4, paciente: 'Antônio Pereira', data: '10/04/2024', medico: 'Dr. Juliana Andrade' },
  ]);

  const [termoBusca, setTermoBusca] = useState('');
  
  // Controle dos Modais
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState<Receita | null>(null);

  // Estados para o formulário de Nova Receita
  const [novoPaciente, setNovoPaciente] = useState('');
  const [novoMedico, setNovoMedico] = useState('');
  const [novaData, setNovaData] = useState('');

  // 2. FUNÇÕES DE AÇÃO

  // Função para Deletar
  const handleDeletar = (id: number) => {
    const confirmar = window.confirm("Tem certeza que deseja deletar esta receita?");
    if (confirmar) {
      setReceitas(receitas.filter(r => r.id !== id));
    }
  };

  // Função para Abrir Modal de Visualização
  const handleVisualizar = (receita: Receita) => {
    setReceitaSelecionada(receita);
    setModalVerOpen(true);
  };

  // Função para Adicionar Nova Receita
  const handleAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPaciente || !novoMedico || !novaData) return alert("Preencha todos os campos!");

    const novaReceita = {
      id: Date.now(), // Gera um ID único baseado no tempo
      paciente: novoPaciente,
      medico: novoMedico,
      // Converte data YYYY-MM-DD para DD/MM/YYYY
      data: novaData.split('-').reverse().join('/'), 
    };

    setReceitas([...receitas, novaReceita]); // Adiciona na lista
    setModalNovoOpen(false); // Fecha o modal
    setNovoPaciente(''); setNovoMedico(''); setNovaData(''); // Limpa os campos
  };

  // 3. LÓGICA DE BUSCA
  // O useMemo faz com que a lista só seja filtrada quando o texto da busca ou a lista principal mudar
  const receitasFiltradas = useMemo(() => {
    return receitas.filter(r => 
      r.paciente.toLowerCase().includes(termoBusca.toLowerCase()) || 
      r.medico.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }, [receitas, termoBusca]);


  return (
    <main className={styles.container}>
      <div className={styles.card}>
        
        {/* CABEÇALHO */}
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <button onClick={() => router.back()} className={styles.backButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1 className={styles.title}>GESTÃO DE RECEITAS</h1>
          </div>
          <button onClick={() => setModalNovoOpen(true)} className={styles.newButton}>
            + NOVA RECEITA
          </button>
        </header>

        <div className={styles.mainContent}>
          
          <div className={styles.tableSection}>
            {/* BARRA DE BUSCA (Agora funcional) */}
            <div className={styles.searchBar}>
              <div className={styles.inputGroup}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Buscar por paciente ou médico..." 
                  className={styles.searchInput}
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)} // Atualiza a busca ao digitar
                />
              </div>
            </div>

            {/* TABELA DE DADOS */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Data</th>
                  <th>Médico</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {receitasFiltradas.length > 0 ? (
                  receitasFiltradas.map((receita) => (
                    <tr key={receita.id}>
                      <td><strong>{receita.paciente}</strong></td>
                      <td>{receita.data}</td>
                      <td>{receita.medico}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          {/* Botão Visualizar */}
                          <button onClick={() => handleVisualizar(receita)} className={styles.viewBtn}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          {/* Botão Deletar */}
                          <button onClick={() => handleDeletar(receita.id)} className={styles.deleteBtn}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma receita encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* STATUS E PAGINAÇÃO */}
            <div className={styles.paginationArea}>
              <span className={styles.paginationInfo}>
                Mostrando {receitasFiltradas.length} de {receitas.length} registros
              </span>
            </div>
          </div>

          <div className={styles.imageSection}>
            <img 
              src="https://placehold.co/300x300/ffffff/609dff?text=Ilustracao+Receita" 
              alt="Médico analisando receita" 
              className={styles.illustration} 
            />
          </div>

        </div>
      </div>

      {/* MODAL: ADICIONAR NOVA RECEITA */}
      {modalNovoOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Nova Receita</h2>
            <form onSubmit={handleAdicionar} className={styles.modalForm}>
              <input 
                type="text" 
                placeholder="Nome do Paciente" 
                value={novoPaciente}
                onChange={e => setNovoPaciente(e.target.value)}
                className={styles.modalInput}
                required
              />
              <input 
                type="text" 
                placeholder="Nome do Médico" 
                value={novoMedico}
                onChange={e => setNovoMedico(e.target.value)}
                className={styles.modalInput}
                required
              />
              <input 
                type="date" 
                value={novaData}
                onChange={e => setNovaData(e.target.value)}
                className={styles.modalInput}
                required
              />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setModalNovoOpen(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.saveBtn}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VISUALIZAR RECEITA */}
      {modalVerOpen && receitaSelecionada && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Detalhes da Receita</h2>
            <div className={styles.modalDetails}>
              <p><strong>Paciente:</strong> {receitaSelecionada.paciente}</p>
              <p><strong>Médico:</strong> {receitaSelecionada.medico}</p>
              <p><strong>Data da Prescrição:</strong> {receitaSelecionada.data}</p>
              <p><strong>Status:</strong> Ativa no sistema</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setModalVerOpen(false)} className={styles.saveBtn}>Fechar</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}