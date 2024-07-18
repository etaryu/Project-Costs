import Message from "../layout/Message";
import {useLocation} from 'react-router-dom'
import { useState,useEffect} from 'react'
import styles from './Projects.module.css';
import Container from '../layout/Container';
import LinkButton from '../layout/LinkButton';
import ProjectCard from "../project/ProjectCard";
import Loading from "../layout/Loading";

function Projects(){
    
    const location = useLocation();
    let message =''
    if(location.state){
        message=location.state.message;
    }
    const [removeLoading, setRemoveLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectMessage,setProjectMessage] = useState('')

    useEffect(()=>{
        setTimeout(()=>{
            fetch(`http://localhost:5000/projects`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                },
            })
            .then(resp=>resp.json())
            .then((data)=>{
                setProjects(data)
                setRemoveLoading(true)
            })
            .catch((err)=>console.log(err))
    
        },500)
    },[])
    
    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`,{
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(resp => resp.json())
        .then(data => {
            setProjects(projects.filter((project)=> project.id !==id))
            setProjectMessage('Projeto removido com sucesso!')
        })
        .catch((err)=>console.log(err))
        }



    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" ></LinkButton>
            </div>
            {message && <Message msg={message} type="success" />}
            {projectMessage && <Message msg={projectMessage} type="success" />}
            <Container customCLass="start">
                {projects.length>0 &&
                    projects.map((project)=>(
                        <ProjectCard
                            name={project.name}
                            id={project.id}
                            budget={project.budget}
                            category={project.category.name}
                            key={project.id}
                            handleRemove={removeProject}
                            />
                            
                    ))
                }
                {!removeLoading && <Loading/>}
                {removeLoading && projects.length === 0 && (
                    <p>Não ha projetos registrados</p>
                )
                }
            </Container>
        </div>
    )
}

export default Projects;