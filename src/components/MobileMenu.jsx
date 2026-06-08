import { Link } from 'react-router-dom';
import { NAV, TEL } from '../data/site';
import { useAgenda } from '../context/AgendaContext';

export default function MobileMenu({ open, onClose }) {
  const { open: openAgenda } = useAgenda();

  return (
    <div className={'mmenu' + (open ? ' open' : '')}>
      <button className="mmenu__close" aria-label="Cerrar" onClick={onClose}>×</button>
      {NAV.map(({ label, href }) => (
        <Link key={href} to={href} onClick={onClose}>{label}</Link>
      ))}
      <a
        href="#agenda"
        onClick={(e) => { e.preventDefault(); onClose(); openAgenda(); }}
      >
        Agendar reunión
      </a>
      <div className="mmenu__foot">{TEL} · Luque, Paraguay</div>
    </div>
  );
}
