'use client'; // 👈 Adicionamos isso para permitir funções de interatividade no Next.js

import { useRouter } from 'next/navigation'; // 👈 Importamos o roteador
import styles from './page.module.css';

export default function Login() {
  const router = useRouter(); // Inicializamos o roteador

  // 👈 Criamos a função que é disparada ao clicar no botão
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue (padrão de formulários)
    
    // Aqui no futuro você colocaria a sua validação de banco de dados (email/senha)
    // ...
    
    // Como deu tudo certo, mandamos o usuário para a tela de cargos!
    router.push('/cargos');
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        
        {/* Lado Esquerdo - Formulário */}
        <section className={styles.formSection}>
          <h2 className={styles.title}>INFORMAÇÕES DE LOGIN</h2>
          
          {/* 👇 Adicionamos o onSubmit no form para chamar a função */}
          <form className={styles.form} onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Nome" 
              className={styles.inputField} 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className={styles.inputField} 
            />
            
            <label className={styles.checkboxContainer}>
              <input type="checkbox" />
              <span className={styles.checkboxLabel}>Lembre-se de mim</span>
            </label>
            
            <button type="submit" className={styles.loginButton}>
              LOGIN
            </button>
          </form>
        </section>

        {/* Lado Direito - Ilustração */}
        <section className={styles.imageSection}>
          <img 
            src="https://placehold.co/400x500/ffffff/609dff?text=Ilustracao+Login" 
            alt="Ilustração de login pelo celular" 
            className={styles.illustration} 
          />
        </section>

      </div>
    </main>
  );
}