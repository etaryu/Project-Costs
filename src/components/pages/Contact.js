import email from '../../img/email-svgrepo-com.svg'
import number from '../../img/phone-svgrepo-com.svg'
import styles from './Contact.module.css'


function Contact(){
    return (
        <div className={styles.contact}>
            <h1>Contato</h1>
            <h2>Quaisquer imprevistos ou problemas encontrados, por favor utilize as seguintes formas de contato:</h2>
            <div className={styles.contact_element}>
                <img className={styles.svg} src={email}/>
                <p>costs.brasil@gmail.com</p>
            </div>
            <div className={styles.contact_element}>
                <img className={styles.svg} src={number}   />
                <p>67 99920-8238</p>
            </div>
        </div>
    )
}

export default Contact;