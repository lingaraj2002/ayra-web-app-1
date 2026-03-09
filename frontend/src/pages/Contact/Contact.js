import "./Conact.scss";

export default function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>

      {/* Address */}
      <section className="contact-section">
        <h3>Location</h3>
        <p>
          Ayra Web App <br />
          Bhubaneswar, Odisha, India
        </p>

        <iframe
          title="location-map"
          src="https://www.google.com/maps?q=Bhubaneswar%20Odisha&output=embed"
          width="100%"
          height="250"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </section>

      {/* Contact details */}
      <section className="contact-section">
        <h3>Get in Touch</h3>

        <p>
          📧 Email:{" "}
          <a href="mailto:yourmail@example.com">yourmail@example.com</a>
        </p>

        <p>
          📞 Phone: <a href="tel:+919999999999">+91 99999 99999</a>
        </p>

        <p>
          💬 WhatsApp:{" "}
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
            Chat on WhatsApp
          </a>
        </p>

        <p>
          📸 Instagram:{" "}
          <a
            href="https://instagram.com/your_instagram_id"
            target="_blank"
            rel="noreferrer"
          >
            Send Message
          </a>
        </p>
      </section>
    </div>
  );
}
