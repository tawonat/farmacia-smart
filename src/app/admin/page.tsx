'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from './page.module.css';

// Tipagens
type Usuario = { id: number; nome: string; email: string; tipo: string };
type UBS = { id: number; nome: string; endereco: string };
type Medico = { id: number; nome: string; especialidade: string; ubs: string };

// Dados Fictícios (Mock)
const USUARIOS_MOCK: Usuario[] = [
  { id: 1, nome: 'Marcelo Silva', email: 'marcelo.silva@gmail.com', tipo: 'Admin' },
  { id: 2, nome: 'Ana Melo', email: 'ana.melo@gmail.com', tipo: 'Secretária' },
  { id: 3, nome: 'André Oliveira', email: 'andre.oliveira@seudominio.com', tipo: 'Médico' },
  { id: 4, nome: 'Lúcia Souza', email: 'lucia.souza@seudominio.com', tipo: 'Médica' },
];

const UBSS_MOCK: UBS[] = [
  { id: 1, nome: 'UBS Centro', endereco: 'Rua Principal, 123' },
  { id: 2, nome: 'UBS São José', endereco: 'Av. das Flores, 450' },
];

const MEDICOS_MOCK: Medico[] = [
  { id: 1, nome: 'Dr. Roberto Oliveira', especialidade: 'Clinico Geral', ubs: 'Centro' },
  { id: 2, nome: 'Dra. Juliana Andrade', especialidade: 'Ginecologista', ubs: 'UBS São José' },
  { id: 3, nome: 'Dr. Fernando Costa', especialidade: 'Cardiologista', ubs: 'Centro' },
];

export default function AdminPanel() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState('Usuarios');

  return (
    <main className={styles.container}>
      <div className={styles.adminCard}>
        
        {/* BARRA LATERAL (SIDEBAR) */}
        <aside className={styles.sidebar}>
          <div className={styles.profileSection}>
            <div className={styles.avatar}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h2 className={styles.sidebarTitle}>Painel do Administrador</h2>
          </div>
          
          <nav className={styles.menu}>
            <button className={`${styles.menuItem} ${abaAtiva === 'Usuarios' ? styles.active : ''}`} onClick={() => setAbaAtiva('Usuarios')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Usuários
            </button>
            <button className={`${styles.menuItem} ${abaAtiva === 'UBSs' ? styles.active : ''}`} onClick={() => setAbaAtiva('UBSs')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              UBSs
            </button>
            <button className={`${styles.menuItem} ${abaAtiva === 'Medicos' ? styles.active : ''}`} onClick={() => setAbaAtiva('Medicos')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              Médicos
            </button>
          </nav>
          
          <button className={styles.backBtn} onClick={() => router.push('/dashboard')}>
            Voltar ao Sistema
          </button>
        </aside>

        {/* CONTEÚDO PRINCIPAL (DIREITA) */}
        <section className={styles.mainContent}>
          
          {/* TOPO: TABELA DE USUÁRIOS */}
          <div className={styles.topSection}>
            <header className={styles.sectionHeader}>
              <div className={styles.tabs}>
                <button className={`${styles.tab} ${abaAtiva === 'Usuarios' ? styles.activeTab : ''}`}>Usuários</button>
                <button className={styles.tab}>UBSs</button>
                <button className={styles.tab}>Médicos</button>
              </div>
              <button className={styles.primaryBtn}>+ NOVO USUÁRIO</button>
            </header>
            
            <div className={styles.searchArea}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Buscar usuários..." className={styles.searchInput} />
              <button className={styles.searchBtn}>BUSCAR</button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Tipo</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {USUARIOS_MOCK.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.nome}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.tipo}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.viewBtn} title="Visualizar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                        <button className={styles.editBtn} title="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button className={styles.deleteBtn} title="Excluir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PARTE INFERIOR: UBSs E MÉDICOS */}
          <div className={styles.bottomGrid}>
            
            {/* QUADRO: UBSs */}
            <div className={styles.subCard}>
              <header className={styles.subCardHeader}>
                <div className={styles.subCardTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#609dff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  <h3>UBSs</h3>
                </div>
                <button className={styles.primaryBtnSmall}>+ NOVA UBS</button>
              </header>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {UBSS_MOCK.map(ubs => (
                    <tr key={ubs.id}>
                      <td><strong>{ubs.nome}</strong></td>
                      <td style={{ fontSize: '0.85rem' }}>{ubs.endereco}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.viewBtn}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg></button>
                          <button className={styles.editBtn}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg></button>
                          <button className={styles.deleteBtn}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline></svg></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* QUADRO: MÉDICOS */}
            <div className={styles.subCard}>
              <header className={styles.subCardHeader}>
                <div className={styles.subCardTitle}>
                  <h3>Médicos</h3>
                  <div className={styles.miniSearch}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar..." />
                  </div>
                </div>
                <button className={styles.primaryBtnSmall}>+ BUSCAR</button>
              </header>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Médico</th>
                    <th>UBS</th>
                  </tr>
                </thead>
                <tbody>
                  {MEDICOS_MOCK.map(medico => (
                    <tr key={medico.id}>
                      <td>
                        <div className={styles.medicoInfo}>
                          <strong>{medico.nome}</strong>
                          <span>{medico.especialidade}</span>
                        </div>
                      </td>
                      <td style={{ color: '#609dff', fontWeight: 500 }}>{medico.ubs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}