import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        
        {/* Lado Esquerdo - Textos e Botões */}
        <section className={styles.contentLeft}>
          <div className={styles.logo}>
            <span className={styles.logoDot}></span> Home
          </div>
          
          <h1 className={styles.title}>Farmácia</h1>
          
          <div className={styles.actionArea}>
            <p className={styles.subtitle}>JÁ TEM UMA CONTA?</p>
            <div className={styles.buttonGroup}>
              <Link href="/login" className={styles.btnPrimary}>LOGIN</Link>
              <Link href="/cadastro" className={styles.btnSecondary}>CADASTRO</Link>
            </div>
          </div>
        </section>

        {/* Lado Direito - Ilustração */}
        <section className={styles.contentRight}>
          {/* 👇 Só trocar esse src depois pela sua imagem, ex: src="/imagem-farmacia.png" */}
          <img 
            src="https://placehold.co/500x400/f8faff/609dff?text=Ilustracao+Farmacia" 
            alt="Ilustração de pessoas na farmácia" 
            className={styles.illustration} 
          />
        </section>

      </div>
    </main>
  );
}