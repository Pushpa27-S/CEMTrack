import React from "react";
import cement from "../assets/cement.jpeg";

function Home() {
  return (
    <div className="home">

      <div className="hero">

        <div className="hero-text">
          <h1>Welcome to CEMTrack</h1>

          <p>
            CEMTrack is a smart cement shop management system that helps
            owners manage products, customers, billing, stock, and reports
            easily.
          </p>

          <button className="btn">Get Started</button>
        </div>

        <div className="hero-image">
          <img src={cement} alt="Cement Bags" />
        </div>

      </div>

    </div>
  );
}

export default Home;