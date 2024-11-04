import styles from '../styles/Modal.module.css';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.centerButton}>
        <button className={styles.visualizarButton} onClick={() => router.push('/dados')}>
          Visualizar consulta
        </button>
      </div>
    </div>
  );
}
