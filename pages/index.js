import { useEffect, useState } from 'react';
import { getCadastro, getFinancas } from '../services/api';
import html2pdf from 'html2pdf.js';
import styles from '../styles/Modal.module.css';

export default function Home() {
  const [cadastro, setCadastro] = useState([]);
  const [financas, setFinancas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const cadastroData = await getCadastro();
      const financasData = await getFinancas();
      setCadastro(cadastroData);
      setFinancas(financasData);
    }
    fetchData();
  }, []);

  const downloadPDF = () => {
    const element = document.getElementById('modal-content');
    html2pdf().from(element).save('consulta.pdf');
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Visualizar consulta</button>
      {showModal && (
        <div id="modal-content" className={styles.modal}>
          <button onClick={() => setShowModal(false)}>Fechar</button>
          <button onClick={downloadPDF}>Download PDF</button>
          <div className={styles.cadastroSection}>
            <h2>Dados Individuais</h2>
            {cadastro.map(item => (
              <div key={item.id}>
                <p>Nome: {item.name}</p>
                <p>Role: {item.role}</p>
                {/* Adicionar outros campos */}
              </div>
            ))}
          </div>
          <div className={styles.financasSection}>
            <h2>Dados de Envolvidos</h2>
            {financas.map(item => (
              <div key={item.id}>
                <p>Nome: {item.name}</p>
                <p>Exposição Potencial: {item.potentialExposure}</p>
                {/* Adicionar outros campos */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
