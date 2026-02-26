'use client'; // Interatividade ativada

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Cargos() {
  const router = useRouter();
  const cargos = ['Funcionário', 'Gerente', 'Administrador', 'Farmacêutico'];

  // Função que pega o cargo clicado e manda para a próxima tela
  const handleSelectRole = (cargo: string) => {
    router.push(`/painel?cargo=${encodeURIComponent(cargo)}`);
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <section className={styles.rolesSection}>
          <div className={styles.buttonList}>
            {cargos.map((cargo, index) => (
              <button 
                key={index} 
                className={styles.roleButton}
                onClick={() => handleSelectRole(cargo)} // 👈 A mágica acontece aqui!
              >
                <svg className={styles.userIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {cargo}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.imageSection}>
          <div className={styles.imageBox}>
            <img src="https://placehold.co/400x400/f5f5f5/609dff?text=Icone+Equipe" alt="Ícone de equipe" className={styles.illustration} />
          </div>
        </section>
      </div>
    </main>
  );
}