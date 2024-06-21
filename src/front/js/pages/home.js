import React, { useContext } from "react";
import responsive from "../../img/responsive.png"
import shirt from "../../img/tshirt.png"
import kitchen from "../../img/kitchen.png"
import customer from "../../img/customer-service.png"
import hands from "../../img/hands.png"
import bg from "../../img/bg.mp4"
import "../../styles/Home.css";

export const Home = () => {



	return (
		<div className="home__content-section">
			<div className="home__content"> 

				<article className="home__parrafos">
					<p className="home__title-presentation t-principal">Regala lo que no usas </p>
					<p className="home__title-presentation t-principal">Encuentra lo que necesitas</p>
					<p className="home__title-presentation t-principal"><span className="home__parrafo-presentation">Bienvenido a Second Chances! </span></p>
					<button className="home__button button-home">Ver más</button>
				</article>

				<video muted autoPlay loop>
					<source src={bg} type="video/mp4"></source>
				</video>

				<div className="blur"></div>
			</div>


			
			<div className="logos">
				<div className="logos-slide">
					<img src={responsive} alt="Responsive" />
					<img src={shirt} alt="Shirt" />
					<img src={kitchen} alt="Kitchen" />
					<img src={customer} alt="Customer" />
					<img src={responsive} alt="Responsive" />
					<img src={shirt} alt="Shirt" />
					<img src={kitchen} alt="Kitchen" />
					<img src={customer} alt="Customer" />
				</div>

				<div className="logos-slide">
					<img src={responsive} alt="Responsive" />
					<img src={shirt} alt="Shirt" />
					<img src={kitchen} alt="Kitchen" />
					<img src={customer} alt="Customer" />
					<img src={responsive} alt="Responsive" />
					<img src={shirt} alt="Shirt" />
					<img src={kitchen} alt="Kitchen" />
					<img src={customer} alt="Customer" />
				</div>
			</div>



			<section>
				{/*COMPONENTE DE PRODUCTOS DE HOME */}
			</section>


			<section className="home__content-msj part2">
			<div className="home__content content2">
				<figure className="home__figure-hands">
					<img className="home__img imgDos" src={hands} />
				</figure>

				<article className="home__parrafos">
					<p className="home__title-presentation parrafo-article">¿No lo usas o no lo quieres? </p>
					<p className="home__title-presentation parrafo-article"><span className="dos">Regala</span> lo que ya no uses y alegra el día de alguna persona.</p>

					<p className="home__title-presentation parrafo-article"><span className="home__parrafo-presentation">Todo tiene una segunda oportunidad!  </span></p>

					<button className="home__button button-dos">Publicar ahora</button>
				</article>

				
			</div>

			</section>






		</div>
	);
};
