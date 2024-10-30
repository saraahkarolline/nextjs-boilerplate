import { useEffect, useState } from 'react';
import { getCadastro, getFinancas } from '../services/api';
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

  const downloadPDF = async () => {
    if (typeof window !== 'undefined') {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const element = document.getElementById('modal-content');
      if (element && element.innerHTML.trim() !== "") {
        element.style.color = "black";
        
        setTimeout(() => {
          html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            width: element.scrollWidth,
            height: element.scrollHeight
          }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('consulta.pdf');
          });
        }, 1000);
      } else {
        console.log("Element is empty or not found");
      }
    }
  };

  return (
    <div>
      <div className={showModal ? 'hide-button' : 'center-button'}>
        <button className="visualizar-button" onClick={() => setShowModal(true)}>Visualizar consulta</button>
      </div>
      {showModal && (
        <div id="modal-content" className={`${styles.modal} modal-content`}>
          <button onClick={() => setShowModal(false)}>Fechar</button>
          <button onClick={downloadPDF}>Download PDF</button>
          <div className={styles.cadastroSection}>
            <h2>Dados Individuais</h2>
            {cadastro.map((item) => (
              <div key={item.id}>
                <p>Nome: {item.name}</p>
                <p>Role: {item.role}</p>
              </div>
            ))}
          </div>
          <div className={styles.financasSection}>
            <h2>Dados de Envolvidos</h2>
            {financas.map((item) => (
              <div key={item.id}>
                <p>Nome: {item.name}</p>
                <p>Exposição Potencial: {item.potentialExposure}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
