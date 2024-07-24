import styles from './Company.module.css'
import imagem from '../../img/img_yellow.png'


function Company(){
    return (
        <div className={styles.empresa}>
            <img src={imagem} alt='sla' />
            
            <h1>Empresa</h1>
            <h2>Costs: Seu Aliado na Gestão e Controle de Gastos de Projetos</h2>
            <p>No ambiente dinâmico e competitivo de negócios atuais, a gestão eficaz dos recursos financeiros é essencial para o sucesso de qualquer projeto. O Costs surge como uma ferramenta inovadora e indispensável para empresas e profissionais que buscam um controle rigoroso e preciso dos seus orçamentos e despesas de projeto.</p>
            <h3>O que é o Costs?</h3>
            <p>O Costs é um site dedicado ao cálculo e controle do planejamento de gastos de projetos. Ele oferece uma plataforma intuitiva e robusta que auxilia na criação de orçamentos detalhados, no monitoramento contínuo das despesas e na análise de desempenho financeiro de projetos</p>
        </div>
    )
       
}

export default Company;