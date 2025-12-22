import './App.css'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '60px 40px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#10b981', fontSize: '2.5em', margin: '0 0 20px 0' }}>
          ✅ React Works!
        </h1>
        <p style={{ color: '#666', fontSize: '1.1em', margin: '0 0 30px 0' }}>
          Your Flowva app is loading correctly.
        </p>
        <p style={{ color: '#999', fontSize: '0.95em', margin: 0 }}>
          If you see this green background and white card, Vite and React are working properly.
        </p>
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: '600',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}
