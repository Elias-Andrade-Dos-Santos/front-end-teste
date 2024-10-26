import { Link } from 'react-router-dom';
import '../styles/Header.scss';  // Estilos para o layout fixo

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-buttons">
          <li>
            <Link to="/patients">Gerenciar Pacientes</Link>
          </li>
          <li>
            <Link to="/appointments">Gerenciar Atendimentos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
