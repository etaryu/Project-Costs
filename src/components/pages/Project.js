import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './Project.module.css'
import Loading from '../layout/Loading';
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import {parse, v4 as uuidv4} from 'uuid'
import ServiceCard from '../service/ServiceCard';

function Project() {
    const { id } = useParams();
    const [project, setProject] = useState(null); // Inicializar com null
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message,setMessage] = useState();
    const [type,setType] = useState();
    const [services, setServices] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setServices(data.services);
                setLoading(false); 
            })
            .catch((err) => {
                console.log(err);
                setLoading(false); 
            });
        }, 300);
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    function createService(project){
        const lastService = project.services[project.services.length - 1]
        lastService.id =uuidv4()
        const lastServiceCost = lastService.cost;

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        if(newCost>parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }
    
        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method:'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        }).then((resp)=>resp.json())
        .then((data)=>{
            console.log(data)
        })
        .catch(err => console.log(err))

    setMessage('Serviço Adicionado!')
    setType('success')
    project.services.pop()

    }

    function removeService(id, cost){
        const servicesUpdated = project.services.filter(
            (services) => services.id !==id
        )

        const projectUpdated = project
        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method:'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp)=> resp.json())
        .then((data)=>{
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')
            setType("success")
        })
        .catch(err=>console.log(err))
    }    


    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm);
    }

    function editPost(project){
       setMessage('')
        if(project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}` ,{
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp)=> resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado!')
            setType('success')
            //msg
        })
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message}/>}
                        <div className={styles.details_container} >
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? "Editar Projeto" : "Fechar"}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                <p>
                                    <span>Categoria: </span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento: </span>R$ {project.budget}
                                </p>
                                <p>
                                    <span>Total utilizado: </span> R${project.cost}
                                </p>
                                </div>
                            ): (
                                <div className={styles.project_info}>
                                    <ProjectForm 
                                        handleSubmit={editPost} btnText="Concluir edição" 
                                        projectData={project}/>
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                    {!showServiceForm ? "Adicionar serviço" : "Fechar"}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map(services => (
                                    <ServiceCard 
                                        id={services.id}
                                        name={services.name}
                                        cost={services.cost}
                                        description={services.description}
                                        key={services.key}
                                        handleRemove={removeService}
                                    
                                    />
                                ))

                            }
                            {services.length === 0 && <p>Não há serviços cadastrados.</p>}
                        </Container>
                    </Container>
                </div>
            ):(
                <Loading/>
            )}
        </>
    )
}

export default Project;
