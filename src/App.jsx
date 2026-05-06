import React, { useState } from 'react';
import './index.css';

// --- MOCK DATA ---
const MOCK_TICKETS = [
  {
    id: 'TKT-001',
    title: 'Despido con justa causa - Empleado Juan Pérez',
    company: 'Distribuidora del Norte S.A.S',
    status: 'pending', // pending, progress, review, done
    date: '2026-05-05',
    messages: [
      { sender: 'Cliente (Distribuidora)', text: 'Hola, necesito hacer un despido para mañana. Adjunto soportes.', type: 'received' }
    ]
  },
  {
    id: 'TKT-002',
    title: 'Actualización de Reglamento Interno',
    company: 'Tech Solutions Ltda',
    status: 'progress',
    date: '2026-05-04',
    messages: [
      { sender: 'Cliente (Tech Solutions)', text: 'Necesitamos incluir la política de teletrabajo.', type: 'received' },
      { sender: 'Abogada Lider', text: 'Entendido. Ya estamos trabajando en el borrador.', type: 'sent' }
    ]
  },
  {
    id: 'TKT-003',
    title: 'Respuesta a Derecho de Petición',
    company: 'Inmobiliaria Central',
    status: 'review',
    date: '2026-05-02',
    messages: [
      { sender: 'Abogada Asignada', text: 'El borrador está listo para revisión del jefe.', type: 'sent' }
    ]
  }
];

const ROLES = ['Cliente', 'Abogada Líder', 'Abogada Asignada', 'Abogado Jefe'];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('Abogada Líder');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, ticketDetail
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [tickets, setTickets] = useState(MOCK_TICKETS);

  // Helper to get status text & class
  const getStatusInfo = (status) => {
    switch(status) {
      case 'pending': return { text: 'Pendiente', cls: 'status-pending' };
      case 'progress': return { text: 'En Progreso', cls: 'status-progress' };
      case 'review': return { text: 'Para Revisión', cls: 'status-review' };
      case 'done': return { text: 'Completado', cls: 'status-done' };
      default: return { text: 'Desconocido', cls: '' };
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulamos validación
    if(loginPassword.trim() !== '') {
      setIsLoggedIn(true);
    }
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('ticketDetail');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if(!chatInput.trim() || !selectedTicket) return;
    
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          messages: [...t.messages, { sender: role, text: chatInput, type: 'sent' }]
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id));
    setChatInput('');
  };

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '1rem'}}>
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <h1 style={{margin: '0 0 0.5rem 0', color: 'var(--primary-color)'}}>FirmaLegal Pro</h1>
          <p style={{margin: 0, color: 'var(--text-muted)'}}>Inicia sesión en tu cuenta</p>
          
          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <label>Simular acceso como:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            <div className="login-input-group">
              <label>Contraseña de prueba:</label>
              <input 
                type="password" 
                placeholder="Escribe cualquier cosa..." 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary login-btn">
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          FirmaLegal Pro
        </div>
        
        <div className="nav-link active" onClick={() => setCurrentView('dashboard')}>
          Bandeja de Tickets
        </div>
        <div className="nav-link">
          Directorio de Empresas
        </div>
        <div className="nav-link">
          Documentos Plantilla
        </div>
        
        <div style={{marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
          <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Simular Rol:</p>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)'}}
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar" style={{color: 'var(--text-muted)'}}>
            Gestión Centralizada - {role}
          </div>
          <div className="user-info">
            <span className="role-badge">{role}</span>
            <div style={{width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
              {role.charAt(0)}
            </div>
          </div>
        </header>

        <section className="content-area">
          {currentView === 'dashboard' && (
            <>
              <div className="view-header">
                <div>
                  <h1 style={{margin: 0, fontSize: '1.5rem'}}>Bandeja de Tickets</h1>
                  <p style={{margin: '0.25rem 0 0', color: 'var(--text-muted)'}}>Revisa y gestiona las solicitudes de tus empresas.</p>
                </div>
                {role === 'Cliente' && (
                  <button className="btn-primary">
                    + Nuevo Requerimiento
                  </button>
                )}
              </div>

              <div className="tickets-grid">
                {tickets.map(ticket => {
                  const status = getStatusInfo(ticket.status);
                  return (
                    <div className="ticket-card" key={ticket.id} onClick={() => handleOpenTicket(ticket)}>
                      <div className="ticket-header">
                        <span className="ticket-id" style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{ticket.id}</span>
                        <span className={`status-badge ${status.cls}`}>{status.text}</span>
                      </div>
                      <div>
                        <h3 className="ticket-title">{ticket.title}</h3>
                        <div className="ticket-company">{ticket.company}</div>
                      </div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                        Creado: {ticket.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {currentView === 'ticketDetail' && selectedTicket && (
            <>
              <div className="view-header">
                <div>
                  <button className="btn-secondary" onClick={() => setCurrentView('dashboard')} style={{marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
                    ← Volver
                  </button>
                  <h1 style={{margin: 0, fontSize: '1.5rem'}}>{selectedTicket.title}</h1>
                  <p style={{margin: '0.25rem 0 0', color: 'var(--text-muted)'}}>{selectedTicket.company} | Ref: {selectedTicket.id}</p>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  {role === 'Abogada Líder' && <button className="btn-secondary">Asignar a Abogada</button>}
                  {role.includes('Abogada') && <button className="btn-primary" style={{background: '#7c3aed'}}>Enviar a Revisión Jefe</button>}
                  {role === 'Abogado Jefe' && <button className="btn-primary" style={{background: '#10b981'}}>Aprobar y Entregar</button>}
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem'}}>
                <div className="chat-container">
                  <div style={{padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: '600'}}>
                    Hilo de Comunicación
                  </div>
                  <div className="chat-messages">
                    {selectedTicket.messages.map((msg, i) => (
                      <div key={i} className={`message ${msg.type}`}>
                        <div className="message-sender">{msg.sender}</div>
                        <div>{msg.text}</div>
                      </div>
                    ))}
                  </div>
                  <form className="chat-input" onSubmit={handleSendMessage}>
                    <input 
                      type="text" 
                      placeholder="Escribe un mensaje o nota interna..." 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Enviar</button>
                  </form>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div style={{background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)'}}>
                    <h3 style={{marginTop: 0}}>Archivos Adjuntos</h3>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '0.5rem', fontSize: '0.875rem'}}>
                      📄 soportes_despido.pdf
                    </div>
                    <button className="btn-secondary" style={{width: '100%', marginTop: '1rem', fontSize: '0.875rem'}}>+ Subir Archivo</button>
                  </div>

                  <div style={{background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)'}}>
                    <h3 style={{marginTop: 0}}>Información</h3>
                    <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0'}}><strong>Estado:</strong> {getStatusInfo(selectedTicket.status).text}</p>
                    <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0'}}><strong>Asignado a:</strong> Sin asignar</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
