import React from 'react';

// --- Simple CSS Styles ---
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Light gray background
    textAlign: 'center',
    fontFamily: "'Arial', sans-serif",
    padding: '20px',
  },
  icon: {
    fontSize: '10em',
    color: '#007bff', // Primary blue color
    marginBottom: '20px',
  },
  title: {
    fontSize: '6em',
    color: '#343a40', // Dark text color
    marginBottom: '10px',
  },
  message: {
    fontSize: '1.2em',
    color: '#6c757d', // Muted text color
    maxWidth: '600px',
    marginBottom: '30px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  countdown: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: '#dc3545', // Red for emphasis
    marginTop: '15px',
  }
};

const ComingSoon = ({
  title = "We're Under Construction 🚧",
  subtitle = "This feature is being built! We appreciate your patience and will be available online shortly.",
  contactEmail,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>🛠️</div>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.message}>{subtitle}</p>

      {/* Optional Contact Link */}
      {contactEmail && (
        <p>
          Need to reach us urgently? Email us at: 
          <a href={`mailto:${contactEmail}`} style={styles.link}> {contactEmail}</a>
        </p>
      )}

      {/* Footer text */}
      <p style={{ marginTop: '50px', fontSize: '3em', color: '#adb5bd' }}>
        Thank you for visiting.
      </p>
    </div>
  );
};

export default ComingSoon;