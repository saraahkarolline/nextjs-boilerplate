import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faClose, faFileLines, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { getCadastro, getFinancas } from '../services/api';
import styles from '../styles/Modal.module.css';
import { useRouter } from 'next/router';

export default function Dados() {
    const router = useRouter();
    const [cadastro, setCadastro] = useState([]);
    const [financas, setFinancas] = useState([]);
    const [showModal] = useState(true);
    const roundToTwo = (num) => Math.round(num * 100) / 100
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
        <div className={styles.pageContainerData}>
            {showModal && (
                <div>
                    <div className={styles.titulo}>
                        <h1><FontAwesomeIcon icon={faFileLines} /> Consultas de crédito</h1>
                        <a className={styles.dataCorte}>Data de corte dos dados: <strong>00/00/00</strong></a>
                        <div className={styles.buttonContainer}>
                            <button className={styles.buttonBaixar} onClick={downloadPDF}>
                                <FontAwesomeIcon icon={faArrowAltCircleDown} /> Download PDF
                            </button>
                            <button className={styles.buttonFechar}  onClick={() => router.push('/')}>
                                <FontAwesomeIcon icon={faClose} /> Fechar
                            </button>
                        </div>
                    </div>
                    <div id="modal-content" className={styles.modalData}>
                        <div className={styles.cadastroSection}>
                            <div className={styles.sectionHeaderContainer}>
                                <h2 className={styles.sectionHeader}>
                                    <FontAwesomeIcon icon={faUser} /> Dados individuais
                                </h2>
                            </div>
                            {cadastro.map((cadastroItem) => {
                                const formatDate = (dateString) => {
                                    const date = new Date(dateString);
                                    if (isNaN(date)) {
                                        return "Data Inválida";
                                    }
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}/${month}/${year}`;
                                };
                                const roundToTwo = (num) => Math.round(num * 100) / 100;

                                return (
                                    <div key={cadastroItem.id} className={styles.sectionContent}>
                                        <div className={styles.itemInfo}>
                                            <h1>{cadastroItem.name}</h1>
                                            <p>{cadastroItem.role}</p>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docList}>
                                                <li><a>{cadastroItem.docPF}</a></li>
                                                <li><a>{cadastroItem.tier}</a></li>
                                                <li><a>Status <strong>{cadastroItem.status}</strong></a></li>
                                                <li><a>ISA <strong>{cadastroItem.isa}</strong></a></li>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docListLast}>
                                                <li><a>MC <strong>R${roundToTwo(cadastroItem.mc)}</strong></a></li>
                                                <li><a>Principalidade <strong>{cadastroItem.preferenceRating}</strong></a></li>
                                                <li><a><strong>{cadastroItem.risk}</strong> risco</a></li>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docResumo}>
                                                <a>Renda mensal: <strong>R${roundToTwo(cadastroItem.monthlyIncome)}</strong></a>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docResumo}>
                                                <a>Email: <strong>{cadastroItem.email}</strong></a>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docResumo}>
                                                <a>Endereço: <strong>{cadastroItem.fullAddress}</strong></a>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docResumo}>
                                                <a>Atualização cadastral: <strong>{formatDate(cadastroItem.lastUpdate)}</strong></a>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docResumo}>
                                                <a>Data de associação: <strong>{formatDate(cadastroItem.associatedSince)}</strong></a>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docResumo}>
                                                <a>SCR mensal: <strong>R${roundToTwo(cadastroItem.monthlyScr)}</strong> | SCR anual: <strong>R${roundToTwo(cadastroItem.monthlyScr * 12)}</strong></a>
                                            </ul>
                                        </div>
                                        <div className={styles.doc}>
                                            <ul className={styles.docResumo}>
                                                <a>Restritivo interno: <strong>{cadastroItem.internalStrikes}</strong> | Restritivo externo: <strong>{cadastroItem.externalStrikes}</strong></a>
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={styles.financasSection}>
                            <div className={styles.sectionHeaderContainer}>
                                <p className={styles.sectionHeader}>
                                    <FontAwesomeIcon icon={faUser} /> Dados de envolvidos
                                </p>
                            </div>
                            <div className={styles.sectionHeaderContainer}>
                                <h2 className={styles.sectionHeaderTitulo}>
                                    Endividamento
                                </h2>
                            </div>
                            <div className={styles.sectionContentTabela}>
                                <table className={styles.sectionContentTabela}>
                                    <thead>
                                        <tr>
                                            <th className={styles.sectionContentTabelath}>Nome</th>
                                            <th className={styles.sectionContentTabelath}>SCR anual</th>
                                            <th className={styles.sectionContentTabelath}>SCR mensal</th>
                                            <th className={styles.sectionContentTabelath}>Exposição potencial</th>
                                            <th className={styles.sectionContentTabelath}>Comprometimento mensal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {financas.map((financaItem) => {
                                            const cadastroItem = cadastro.find(c => c.id === financaItem.id);
                                            return (
                                                <tr key={financaItem.id}>
                                                    <td className={styles.sectionContentTabelaLinha}>{cadastroItem ? cadastroItem.name : 'N/A'}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${cadastroItem ? roundToTwo(cadastroItem.monthlyScr * 12) : 'N/A'}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${cadastroItem ? roundToTwo(cadastroItem.monthlyScr) : 'N/A'}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.potentialExposure)}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.monthlyDebt)}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <td className={styles.sectionContentTabelaLinha}><strong>TOTAL</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${roundToTwo(cadastro.reduce((total, item) => total + (item.monthlyScr * 12), 0))}</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${cadastro.reduce((total, item) => total + parseFloat(item.monthlyScr), 0)}</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${financas.reduce((total, item) => total + parseFloat(item.potentialExposure), 0)}</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${roundToTwo(financas.reduce((total, item) => total + parseFloat(item.monthlyDebt), 0))}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.sectionHeaderContainer}>
                                <h2 className={styles.sectionHeaderTitulo}>
                                    Patrimônio
                                </h2>
                            </div>
                            <div className={styles.sectionContentTabela}>
                                <table className={styles.sectionContentTabela}>
                                    <thead>
                                        <tr>
                                            <th className={styles.sectionContentTabelath}>Nome</th>
                                            <th className={styles.sectionContentTabelath}>Imóveis</th>
                                            <th className={styles.sectionContentTabelath}>Veículos</th>
                                            <th className={styles.sectionContentTabelath}>Investimentos</th>
                                            <th className={styles.sectionContentTabelath}>Todos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {financas.map((financaItem) => {
                                            const cadastroItem = cadastro.find(c => c.id === financaItem.id);
                                            return (
                                                <tr key={financaItem.id}>
                                                    <td className={styles.sectionContentTabelaLinha}>{cadastroItem ? cadastroItem.name : 'N/A'}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.realStateNetWorth)}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.vehiclesNetWorth)}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.investmentsNetWorth)}</td>
                                                    <td className={styles.sectionContentTabelaLinha}> R${roundToTwo(parseFloat(financaItem.realStateNetWorth) + parseFloat(financaItem.vehiclesNetWorth) + parseFloat(financaItem.investmentsNetWorth) )} </td>

                                                    </tr>
                                            );
                                        })}
                                        <tr>
                                            <td className={styles.sectionContentTabelaLinha}><strong>TOTAL</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${financas.reduce((total, item) => total + parseFloat(item.realStateNetWorth), 0)}</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${financas.reduce((total, item) => total + parseFloat(item.vehiclesNetWorth), 0)}</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${financas.reduce((total, item) => total + parseFloat(item.investmentsNetWorth), 0)}</strong></td>
                                            <td className={styles.sectionContentTabelaLinha} colSpan="1"><strong>R${roundToTwo(financas.reduce((total, item) => total + (parseFloat(item.realStateNetWorth)+parseFloat(item.vehiclesNetWorth)+parseFloat(item.investmentsNetWorth)), 0))}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.sectionHeaderContainer}>
                                <h2 className={styles.sectionHeaderTitulo}>
                                    Investimentos
                                </h2>
                            </div>
                            <div className={styles.sectionContentTabela}>
                                <table className={styles.sectionContentTabela}>
                                    <thead>
                                        <tr>
                                            <th className={styles.sectionContentTabelath}>Nome</th>
                                            <th className={styles.sectionContentTabelath}>Fundos</th>
                                            <th className={styles.sectionContentTabelath}>Depósito a prazo</th>
                                            <th className={styles.sectionContentTabelath}>Depósito a vista</th>
                                            <th className={styles.sectionContentTabelath}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {financas.map((financaItem) => {
                                            const cadastroItem = cadastro.find(c => c.id === financaItem.id);
                                            return (
                                                <tr key={financaItem.id}>
                                                    <td className={styles.sectionContentTabelaLinha}>{cadastroItem ? cadastroItem.name : 'N/A'}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.fundsInvestments)}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.termDepositsInvestments)}</td>
                                                    <td className={styles.sectionContentTabelaLinha}>R${roundToTwo(financaItem.imediateDepositsInvestments)}</td>
                                                    <td className={styles.sectionContentTabelaLinha}> R${roundToTwo(parseFloat(financaItem.imediateDepositsInvestments) + parseFloat(financaItem.termDepositsInvestments) + parseFloat(financaItem.fundsInvestments) )} </td>
                                                </tr>
                                            );
                                        })}
                                       
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}  