import React from "react";

function Stats() {
  const stats = [
    {
      number: "1500+",
      title: "Students",
      color: "#2563EB",
    },
    {
      number: "120+",
      title: "Teachers",
      color: "#7C3AED",
    },
    {
      number: "98%",
      title: "Success Rate",
      color: "#10B981",
    },
    {
      number: "30+",
      title: "Years of Excellence",
      color: "#F59E0B",
    },
  ];

  const styles = {
    section: {
      background: "#F8FAFC",
      padding: "80px 60px",
    },

    heading: {
      textAlign: "center",
      fontSize: "40px",
      fontWeight: "700",
      marginBottom: "15px",
      color: "#1E293B",
    },

    subHeading: {
      textAlign: "center",
      color: "#64748B",
      fontSize: "18px",
      marginBottom: "60px",
    },

    container: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "30px",
    },

    card: {
      background: "#fff",
      padding: "40px",
      borderRadius: "20px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,.08)",
      transition: ".3s",
      cursor: "pointer",
    },

    number: {
      fontSize: "55px",
      fontWeight: "800",
      marginBottom: "15px",
    },

    title: {
      fontSize: "20px",
      color: "#475569",
      fontWeight: "600",
    },
  };

  return (
    <section style={styles.section}>
      <h1 style={styles.heading}>Smriti School At A Glance</h1>

      <p style={styles.subHeading}>
        Empowering students through quality education and innovation.
      </p>

      <div style={styles.container}>
        {stats.map((item, index) => (
          <div key={index} style={styles.card}>
            <h1
              style={{
                ...styles.number,
                color: item.color,
              }}
            >
              {item.number}
            </h1>

            <p style={styles.title}>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
