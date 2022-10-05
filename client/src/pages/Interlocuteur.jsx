import React, { useState, useRef ,useEffect} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthAction from "../services/Interlocuteur";
import AuthService from "../services/auth.service";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";
import axios from 'axios';
import fonction_inter from "../assets/JsonData/fonction_interlocuteur.json"
//table class

import Table from '@mui/material/Table';
import Multiselect from 'multiselect-react-dropdown';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const Action = (props) => {

  const [myJSON, setactive] = useState([]);

  const land =(e) => {
    setactive(Array.isArray(e)?e.map(x=>x.NOM):[])
  }

    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    const form = useRef();
    const checkBtn = useRef();
    const [ID_societe,setID_societe] = useState([]);
    useEffect(()=>{
      retrieveTutorials();
      const user = AuthService.getCurrentUser();
          if (user){
                 //afficher cemca
          UserService.getCemecaBoard().then(
              response => {
                  axios.get("http://localhost:8080/cemeca").then((response)=>{
                    setID_societe(response.data);
                  })
              },
            );
             //afficher cemca
          UserService.getSofitechBoard().then(
              response => {
                  axios.get("http://localhost:8080/sofitech").then((response)=>{
                    setID_societe(response.data);
                  })
              },
  
            );
            
          }
   },[]) 
// Get ID from URL
const params = useParams();
var nb=parseInt(params.id);
const actItem =ID_societe.filter(task=>task.siret===nb)
console.log(actItem)
//inntial user state
const user = AuthService.getCurrentUser()
//intitial Action 
    const initialState = {
    nom:"",
    prenom: "",
    email:"",
    adresse: "",
    code_postale: "",
    tel: "",
    activite: "", 
    id_soc: "",
    };

  const [Interlocuteur, setInterlocuteur] = useState({initialState});
  const [listeinter ,Setlisteinter] = useState([]);

  const retrieveTutorials = () => {
    AuthAction.findAll()
      .then((response) => {
        Setlisteinter(response.data);
       
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const filterInter =listeinter.filter(task=>task.id_soc===nb)
  console.log(filterInter)

  
  const saveAction = (e) => {
    const fonction = myJSON.join();
    var data = {
      nom:Interlocuteur.nom,
      prenom:Interlocuteur.prenom,
      email:Interlocuteur.email,
      adresse: Interlocuteur.adresse,
      code_postale:Interlocuteur.code_postale,
      tel:Interlocuteur.tel,
      fonction_inter:fonction,
      id_soc:nb,
    };
  
    e.preventDefault();
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      AuthAction.create(data)
        .then(response => {
        setInterlocuteur({
           nom:response.data.nom,
           prenom: response.data.prenom,
           email: response.data.email,
           adresse: response.data.adresse,
           code_postale: response.data.code_postale,
           tel: response.data.tel,
           fonction_inter: response.data.fonction_inter,
           id_soc: response.data.id_soc,
          }
          );
          setSuccessful(true);
          setMessage(response.data.message)
        },
        error => {
          const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
        }
        )
        .catch(e => {
          console.log(e);

        });
    }
};
const handleInputChange = event => {
  const { name, value } = event.target;
  setInterlocuteur({ ...Interlocuteur, [name]: value });

};

    return (
        <div className="col-md-12">
          <div className="row">
            <div className="col-6">
              {/* ajouter un user */}
              <div className="card card-container">
                <h1> Ajouter un interlocuteur</h1>
                    <Form onSubmit={saveAction} ref={form}>
                        {!successful && (
                            <div>
                              <div className="form-group">
                                <label htmlFor="username">nom</label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  name="nom"
                                  value={Interlocuteur.nom}
                                  onChange={handleInputChange}
                                  
                                />
                              </div>
            
                              <div className="form-group">
                                <label htmlFor="username">prenom</label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  name="prenom"
                                  value={Interlocuteur.prenom}
                                  onChange={handleInputChange}
                                  
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="username">email</label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  name="email"
                                  value={Interlocuteur.email}
                                  onChange={handleInputChange}
                                  
                                />
                              </div>
                  
              
                              <div className="form-group">
                                <label htmlFor="email">tel</label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  name="tel"
                                  value={Interlocuteur.tel}
                                  onChange={handleInputChange}
                                  
                                />
                              </div>        
                            
                              <div className="form-group">
                          
                                <label htmlFor="title">fonction</label>
                                <Multiselect
                                    displayValue="NOM"
                                    groupBy="TYPE"
                                    value="4"
                                    isObject={true}
                                    selectedValues={console.log}
                                    onChange={console.log}
                                    id={console.log}
                                    onNOMPressFn={function noRefCheck(){}}
                                    onRemove={function noRefCheck(){}}
                                    onSearch={function noRefCheck(){}}
                                    onSelect={land}
                                    options={fonction_inter}
                                    showCheckbox
                                  />
                                
                              </div>
                                  
                            

                            

                              <div className="form-group">
                                <button className="btn btn-primary btn-block">Valider l'action</button>
                              </div>
                            </div>
                          )}

                          {message && (
                            <div className="form-group">
                              <div
                                className={
                                  successful
                                    ? "alert alert-success"
                                    : "alert alert-danger"
                                }
                                role="alert"
                              >
                                {message}
                              </div>
                            </div>
                          )}
                            <CheckButton style={{ display: "none" }} ref={checkBtn} />
                    </Form>
              </div>
            </div>
            <div className="col-6">
              <div className="card card-container">
              <h1>liste des interlocuteurs</h1>
              <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                      <TableRow>
                          <TableCell>nom</TableCell>
                          <TableCell align="left">prenom</TableCell>
                          <TableCell align="left">fonction</TableCell>
                          <TableCell align="left">email</TableCell>
                          <TableCell align="left">telephone</TableCell>
                      </TableRow>
                      </TableHead>
                      <TableBody>
                        {filterInter.map((row) => (
                            <TableRow key={row.nom}>
                              <TableCell>{row.nom}</TableCell> 
                              <TableCell>{row.prenom}</TableCell> 
                              <TableCell>{row.fonction_inter}</TableCell> 
                              <TableCell>{row.email}</TableCell>        
                              <TableCell>{row.tel}</TableCell>    
                            </TableRow>
                        ))}
                      </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
           
          </div>
  
         
    
   
          </div>
      );
    }
    export default Action;
  
  