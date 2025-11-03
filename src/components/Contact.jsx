import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    const API_KEY = import.meta.env.VITE_BREVO_API_KEY;
    const SENDER = import.meta.env.VITE_BREVO_SENDER_EMAIL;
    const RECEIVER = import.meta.env.VITE_BREVO_RECEIVER_EMAIL;

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: SENDER, name: "E-Automatize" },
          to: [{ email: RECEIVER, name: "Equipe E-Automatize" }],
          subject: `Novo contato de ${form.name}`,
          htmlContent: `
            <h3>Novo contato recebido pelo site</h3>
            <p><strong>Nome:</strong> ${form.name}</p>
            <p><strong>Email:</strong> ${form.email}</p>
            <p><strong>Mensagem:</strong> ${form.message}</p>
          `,
        }),
      });

      if (response.ok) {
        setStatus("Mensagem enviada com sucesso! ✅");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Erro ao enviar");
      }
    } catch (error) {
      console.error(error);
      setStatus("Erro ao enviar. Verifique a chave da API.");
    }
  };

  return (
    <section id="contact" className="contact">
      <h2>Fale Conosco</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Seu nome"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Seu e-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Mensagem"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Enviar</button>
      </form>
      <p>{status}</p>
    </section>
  );
}
