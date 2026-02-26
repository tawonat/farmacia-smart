import styles from './page.module.css';

export default function Cadastro() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        
        {/* Lado Esquerdo - Formulário */}
        <section className={styles.formSection}>
          <h2 className={styles.title}>CADASTRE-SE AQUI</h2>
          
          <form className={styles.form}>
            <input 
              type="text" 
              placeholder="Nome" 
              className={styles.inputField} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              className={styles.inputField} 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className={styles.inputField} 
            />
            <input 
              type="password" 
              placeholder="Confirmar senha" 
              className={styles.inputField} 
            />
            
            <button type="submit" className={styles.submitButton}>
              CADASTRAR
            </button>
          </form>
        </section>

        {/* Lado Direito - Ilustração */}
        <section className={styles.imageSection}>
          {/* 👇 Placeholder da imagem de documentos. Troque pelo seu SVG/PNG depois */}
          <img 
            src="https://placehold.co/400x400/ffffff/609dff?text=Ilustracao+Documentos" 
            alt="Ilustração de documentos de cadastro" 
            className={styles.illustration} 
          />
        </section>

      </div>
    </main>
  );
}