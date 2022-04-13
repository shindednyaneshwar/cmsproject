import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import {  Redirect } from "react-router-dom/cjs/react-router-dom.min"
import "../Assets/Css/pageNotFound.css"

export default function PageNotFound(){
	const[loginPage,setLoginPage]=useState(false)
	useEffect(()=>{



	},[loginPage])

	

	function setLogin(){
		window.href='./'
	}


    return(

<>
<section className="page_404 fl-center">
	<div className="container">
		<div className="row">	
		<div className="col-sm-12  fl-center">
		<div className="col-sm-10  text-center">
		<div className="four_zero_four_bg">
			<h1 className="text-center ">404</h1>
		
		
		</div>
		
		<div className="contant_box_404">
		<h3 className="h2">
		Look like you're lost
		</h3>
		
		<h4>the page you are looking for not avaible!</h4>

		{loginPage?<Redirect to="/"/>:""}
		
		<button className="link_404" onClick={setLogin}>Go to Login Page</button>
	
	</div>
		</div>
		</div>
		</div>
	</div>
</section>
</>

    )
}