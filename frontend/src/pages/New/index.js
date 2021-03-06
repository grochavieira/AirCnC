import React, { useState, useMemo } from "react";
import api from "../../services/api";

import "./styles.css";
import camera from "../../assets/camera.svg";

export default function New({ history }) {
  const [company, setCompany] = useState("");
  const [techs, setTechs] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function handleSubmit(event) {
    event.preventDefault();
    // É usado para criar um multpart form data para mandar os dados pro banco
    const data = new FormData();

    // Pega o user id do localStorage da pagina
    const user_id = localStorage.getItem("user");

    // Pega os dados digitados e manda eles pro data
    data.append("thumbnail", thumbnail);
    data.append("company", company);
    data.append("techs", techs);
    data.append("price", price);

    // Como os dados são mandados pro mongo através de um multpart form data
    // Ele é mandado de uma forma um pouco diferente
    const response = await api.post("/spots", data, {
      headers: { user_id }
    });

    console.log(response);
    history.push("/dashboard");
  }
  return (
    <form onSubmit={handleSubmit}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? "has-thumbnail" : ""}
      >
        <input
          type="file"
          onChange={event => setThumbnail(event.target.files[0])}
        />
        <img src={camera} alt="Select img" />
      </label>

      <label htmlFor="company">EMPRESA</label>
      <input
        id="company"
        placeholder="Sua empresa incrível"
        value={company}
        onChange={event => setCompany(event.target.value)}
      />

      <label htmlFor="techs">
        TECNOLOGIAS * <span>(separadas pro vírgula)</span>
      </label>
      <input
        id="techs"
        placeholder="Quais tecnologias usam"
        value={techs}
        onChange={event => setTechs(event.target.value)}
      />

      <label htmlFor="techs">
        VALOR DA DIÁRIA * <span>(em branco para GRATUITO)</span>
      </label>
      <input
        id="price"
        placeholder="Valor cobrado por dia"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />

      <button type="submit" className="btn">
        Cadastrar
      </button>
    </form>
  );
}
