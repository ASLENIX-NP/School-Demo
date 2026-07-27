import React from "react";
import Stats from "./Stats";

function Hero() {
  const styles = {
    hero: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "80px",
      background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#2563eb 100%)",
      color: "#fff",
      overflow: "hidden",
      flexWrap: "wrap",
    },

    left: {
      flex: 1,
      minWidth: "350px",
      paddingRight: "40px",
    },

    badge: {
      display: "inline-block",
      background: "#ffffff20",
      padding: "8px 18px",
      borderRadius: "30px",
      fontSize: "14px",
      marginBottom: "20px",
      backdropFilter: "blur(10px)",
    },

    title: {
      fontSize: "60px",
      fontWeight: "800",
      lineHeight: "1.2",
      marginBottom: "20px",
    },

    highlight: {
      color: "#60A5FA",
    },

    subtitle: {
      fontSize: "20px",
      color: "#dbeafe",
      marginBottom: "15px",
      lineHeight: "1.6",
    },

    email: {
      fontSize: "18px",
      color: "#bfdbfe",
      marginBottom: "35px",
    },

    buttonContainer: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },

    primaryBtn: {
      padding: "15px 35px",
      background: "#2563EB",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "17px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },

    secondaryBtn: {
      padding: "15px 35px",
      background: "transparent",
      color: "#fff",
      border: "2px solid white",
      borderRadius: "10px",
      fontSize: "17px",
      cursor: "pointer",
      fontWeight: "bold",
    },

    right: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minWidth: "350px",
      marginTop: "40px",
    },

    imageBox: {
      width: "480px",
      height: "480px",
      background: "#ffffff15",
      borderRadius: "30px",
      backdropFilter: "blur(15px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 20px 40px rgba(0,0,0,.3)",
    },

    image: {
      width: "90%",
      borderRadius: "20px",
    },
  };

    return (
      <>
    <section style={styles.hero}>
      <div style={styles.left}>
        <div style={styles.badge}>📚 Welcome to Smriti School</div>

        <h1 style={styles.title}>
          Learn.
          <br />
          Grow.
          <br />
          <span style={styles.highlight}>Lead.</span>
        </h1>

        <p style={styles.subtitle}>
          Smriti School is committed to providing quality education, innovative
          learning, and holistic development for every student.
        </p>

        <p style={styles.email}>📧 smritismriti@gmail.com</p>

        <div style={styles.buttonContainer}>
          <button style={styles.primaryBtn}>Explore School</button>

          <button style={styles.secondaryBtn}>Contact Us</button>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.imageBox}>
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900"
            alt="School"
            style={styles.image}
          />
        </div>
      </div>
            </section>
            <Stats />
            </>
  );
}

export default Hero;
