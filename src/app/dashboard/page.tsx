'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Dashboard() {
  const router = useRouter();

  // 📊 DADOS FALSOS (MOCKS) PARA PREENCHER O DASHBOARD
  const kpis = [
    { titulo: 'Atendimentos no Mês', valor: '580', variacao: '+ 8% desde o mês passado', cor: 'blue' },
    { titulo: 'Receitas Geradas', valor: '420', variacao: '+ 10% este mês', cor: 'green' },
    { titulo: 'Novos Pacientes', valor: '125', variacao: '+ 25% este mês', cor: 'orange' },
    { titulo: 'Medicamentos Entregues', valor: '3.250', variacao: '+ 12% este mês', cor: 'purple' },
  ];

  const topMedicamentos = [
    { nome: 'Omeprazol 20mg', qtd: 620, percentual: 100, cor: '#609dff' },
    { nome: 'Losartana 50mg', qtd: 580, percentual: 90, cor: '#4CAF50' },
    { dipirona: 'Dipirona 1g', qtd: 460, percentual: 75, cor: '#ff9800' },
    { nome: 'Amoxicilina 500mg', qtd: 380, percentual: 60, cor: '#f44336' },
  ];

  const estoqueBaixo = [
    { nome: 'Paracetamol 500mg', qtd: '8 un.' },
    { nome: 'Dipirona 1g', qtd: '5 un.' },
  ];

  return (
    <main className={styles.container}>
      
      {/* MENU LATERAL (SIDEBAR) - Baseado no seu design */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.avatar}>👨‍💼</div>
          <div>
            <h2 className={styles.logoTitle}>DASHBOARD</h2>
            <span className={styles.adminRole}>Admin</span>
          </div>
        </div>
        
        <nav className={styles.navMenu}>
          <button className={`${styles.navItem} ${styles.active}`}><span className={styles.icon}>👥</span> Usuários</button>
          <button className={styles.navItem}><span className={styles.icon}>🏥</span> UBSs</button>
          <button className={styles.navItem}><span className={styles.icon}>🩺</span> Médicos</button>
        </nav>

        <div className={styles.sidebarBottom}>
           <img src="https://placehold.co/200x200/ffffff/609dff?text=Suporte+Ilustracao" alt="Suporte" className={styles.sidebarImage} />
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <section className={styles.mainContent}>
        
        {/* CABEÇALHO COM NAVEGAÇÃO RÁPIDA */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Visão Geral do Sistema</h1>
            <p className={styles.dateSubtitle}>Atualizado hoje às 08:00</p>
          </div>
          <div className={styles.quickActions}>
            <button onClick={() => router.push('/frente-caixa')} className={styles.actionBtn}>Frente de Caixa</button>
            <button onClick={() => router.push('/lotes')} className={styles.actionBtn}>Ver Lotes</button>
            <button onClick={() => router.push('/receitas')} className={styles.actionBtn}>Receitas</button>
          </div>
        </header>

        {/* 1. CARDS DE KPI (Indicadores) */}
        <div className={styles.kpiGrid}>
          {kpis.map((kpi, index) => (
            <div key={index} className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>{kpi.titulo}</h3>
              <p className={styles.kpiValue}>{kpi.valor}</p>
              <span className={styles.kpiVariation}>{kpi.variacao}</span>
            </div>
          ))}
        </div>

        {/* ALERTA DINÂMICO DE LOTES */}
        <div className={styles.alertBanner}>
          <span className={styles.alertIcon}>⚠️</span>
          <strong>3 lotes próximos do vencimento</strong>
          <button onClick={() => router.push('/lotes')} className={styles.alertLink}>VER LOTES &gt;</button>
        </div>

        {/* 2. SESSÃO DE GRÁFICOS PRINCIPAIS */}
        <div className={styles.chartsGrid}>
          
          {/* Gráfico de Barras: Medicamentos Mais Entregues */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Medicamentos Mais Entregues</h3>
            <div className={styles.barChartContainer}>
              {topMedicamentos.map((item, index) => (
                <div key={index} className={styles.barRow}>
                  <div className={styles.barLabel}>{item.nome || item.dipirona}</div>
                  <div className={styles.barTrack}>
                    <div 
                      className={styles.barFill} 
                      style={{ width: `${item.percentual}%`, backgroundColor: item.cor }}
                    ></div>
                  </div>
                  <div className={styles.barValue}>{item.qtd}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Pizza (Feito com CSS Avançado!) */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Médicos Que Mais Receitaram</h3>
            <div className={styles.pieChartWrapper}>
              {/* A mágica do CSS Conic Gradient está na classe .pieCircle */}
              <div className={styles.pieCircle}>
                <div className={styles.pieHole}>
                  <span className={styles.pieTotal}>32%</span>
                </div>
              </div>
              <ul className={styles.pieLegend}>
                <li><span className={styles.dot} style={{background: '#609dff'}}></span> Dr. Roberto Oliveira <span>32%</span></li>
                <li><span className={styles.dot} style={{background: '#4CAF50'}}></span> Dra. Juliana Andrade <span>24%</span></li>
                <li><span className={styles.dot} style={{background: '#ffc107'}}></span> Dr. Fernando Costa <span>20%</span></li>
                <li><span className={styles.dot} style={{background: '#ff9800'}}></span> Dr. Ana Martins <span>14%</span></li>
                <li><span className={styles.dot} style={{background: '#f44336'}}></span> Dr. André Souza <span>10%</span></li>
              </ul>
            </div>
          </div>

        </div>

        {/* 3. SESSÃO INFERIOR (Mais Detalhes) */}
        <div className={styles.bottomGrid}>
          
          {/* Atendimentos por Funcionário */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Atendimentos por Funcionário</h3>
            <div className={styles.simpleList}>
              <div className={styles.listItem}><span>Mareto Silva</span> <strong>210</strong></div>
              <div className={styles.listItem}><span>Ana Melo</span> <strong>150</strong></div>
              <div className={styles.listItem}><span>Dr. Roberto</span> <strong>150</strong></div>
            </div>
          </div>

          {/* UBS com mais pedidos */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>UBSs com Mais Pedidos</h3>
            <div className={styles.simpleList}>
              <div className={styles.listItem}><span>UBS Centro</span> <strong style={{color: '#609dff'}}>320</strong></div>
              <div className={styles.listItem}><span>UBS São José</span> <strong style={{color: '#4CAF50'}}>275</strong></div>
              <div className={styles.listItem}><span>UBS Boa Vista</span> <strong style={{color: '#ff9800'}}>210</strong></div>
            </div>
          </div>

          {/* Aviso de Estoque Baixo */}
          <div className={`${styles.chartCard} ${styles.warningCard}`}>
            <h3 className={styles.chartTitle} style={{color: '#d32f2f'}}>⚠️ Aviso de Estoque Baixo</h3>
            <div className={styles.stockList}>
              {estoqueBaixo.map((item, idx) => (
                <div key={idx} className={styles.stockItem}>
                  <span>💊 {item.nome}</span>
                  <strong style={{color: '#d32f2f'}}>{item.qtd}</strong>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/lotes')} className={styles.warningBtn}>VER ESTOQUE</button>
          </div>

        </div>

      </section>
    </main>
  );
}