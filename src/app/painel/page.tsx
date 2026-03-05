'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import styles from './page.module.css';

function PainelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const cargoAtual = searchParams.get('cargo') || 'Funcionário';

  // 👇 Adicionamos a propriedade "path" para indicar a rota de cada botão
  const menuFunctions = [
    { 
      name: 'Dashboard', 
      allowedRoles: ['Gerente', 'Administrador'],
      icon: '🎯',
      path: '/dashboard'
    },
    { 
      name: 'Armazém', 
      allowedRoles: ['Farmacêutico', 'Gerente', 'Administrador'],
      icon: '📦',
      path: '/armazem'
    },
    { 
      name: 'Frente de Caixa', 
      allowedRoles: ['Funcionário', 'Farmacêutico', 'Gerente', 'Administrador'],
      icon: '🏪',
      path: '/caixa'
    },
    { 
      name: 'Gestão de Lotes', 
      allowedRoles: ['Farmacêutico', 'Gerente', 'Administrador'],
      icon: '⌨️',
      path: '/lotes'
    },
    { 
      name: 'Receitas', 
      allowedRoles: ['Farmacêutico', 'Gerente', 'Administrador'],
      icon: '📖',
      path: '/receitas'
    },
    // 👇 AQUI ESTÁ A NOVIDADE: Tela de Admin restrita!
    { 
      name: 'Painel do Admin', 
      allowedRoles: ['Administrador'], // 👈 Apenas o cargo de Administrador pode ver
      icon: '⚙️',
      path: '/admin' 
    },
  ];

  const filteredMenu = menuFunctions.filter(item => item.allowedRoles.includes(cargoAtual));

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        
        <section className={styles.menuSection}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <p className={styles.cargoAviso}>Cargo atual: <strong>{cargoAtual}</strong></p>

          <div className={styles.buttonList}>
            {filteredMenu.map((item, index) => (
              <button 
                key={index} 
                className={styles.menuItemButton}
                onClick={() => router.push(item.path)} // 👈 A mágica do clique acontece aqui!
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.imageSection}>
          <img 
            src="https://placehold.co/400x400/ffffff/004b93?text=Balcao+Farmacia" 
            alt="Ilustração balcão de farmácia" 
            className={styles.illustration} 
          />
        </section>

      </div>
    </main>
  );
}

export default function Painel() {
  return (
    <Suspense fallback={<div className={styles.container}>Carregando...</div>}>
      <PainelContent />
    </Suspense>
  );
}

//comment de teste mudança