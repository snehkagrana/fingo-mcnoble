import React, { useRef, useState , useEffect} from "react";
import {useParams} from 'react-router-dom';
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import {Modal, Badge, Row, Form, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';
import Card from 'react-bootstrap/Card';

const AllInformation = () => {
    const {skill, category, subcategory} = useParams();
    const navigate = useNavigate();
	const [informationList, setInformationList] = useState([]);
	const [infoToDelete, setInfoToDelete] = useState(null);
	const role = useRef('');

	const [showWarning, setShowWarning] = useState(false);

		const handleCloseWarning = () => setShowWarning(false);
		const handleShowWarning = () => setShowWarning(true);

	const getAllInformation = () => {
        // console.log(skill, category, subcategory);
		Axios({
			method: "GET",
			withCredentials: true,
			url: `/server/allinformation/${skill}/${category}/${subcategory}`,
		}).then((res) => {
			// console.log("information data are:", res.data.data);
			setInformationList(res.data.data);
		});
	};

    const handleEdit = (editInfo) => {
        // console.log('edited skill', editInfo);
		navigate(`/editinformation/${skill}/${category}/${subcategory}/${editInfo._id}`);
    };

	const handleDeleteWarning = (deleteInfo) =>{
		handleShowWarning();
		setInfoToDelete(deleteInfo);
	};

    const handleDelete = (deleteInfo) => {
        // console.log('deleted info', deleteInfo);
		Axios({
			method: "POST",
			data: {
                skill: skill,
				category: category,
				subcategory: subcategory
            },
			withCredentials: true,
			url: `/server/deleteinformation/${deleteInfo._id}`,
		}).then((res) => {
			var updatedInformationList = informationList.filter((information) => information._id !== deleteInfo._id)
            setInformationList(updatedInformationList);
		});
    };

    useEffect ( () => {
		// console.log("in use effect");
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/login",
		}).then(function (response) {
			if (response.data.redirect == '/login') {
				// console.log("Please log in");
				navigate(`/auth/login`);
			} 
			else{
				getAllInformation();
				role.current = response.data.user.role;
			}
		}); 
		
	}, []);

    return ( 
        <>
		<Helmet><title>All Information</title></Helmet>
		<Navbar  proprole={role}/>
        <div className="skill-page">
			<br/>
			<h2 className="text-center"><Badge pill bg="light">Edit/Delete Information</Badge></h2>
			
			{(informationList)? ((informationList).map((information, i) =>
            <>
			<br/>
			<div key={i}>
			<Card >
				<Card.Header as="h5">{information.heading}</Card.Header>
				<Card.Body>
					{/* <Card.Title>{category}</Card.Title> */}
					<Card.Text>
					{/* {information.information} */}
					</Card.Text>
					<Button onClick={() => handleEdit(information)}>Edit</Button>{' '} 
					<Button onClick={() => handleDeleteWarning(information)}>Delete</Button> 
				</Card.Body>
			</Card>
			</div>
			{infoToDelete!=null && <Modal show={showWarning} onHide={handleCloseWarning}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deleting {infoToDelete.heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>You sure, you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>{ setInfoToDelete(null); handleCloseWarning(); }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {handleDelete(infoToDelete); setInfoToDelete(null); handleCloseWarning(); }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>}
			</>
            )):null}
           
		   <br></br>
        </div>
		
        </>
     );
}
 
export default AllInformation;

///TODO: change hard coded value 5