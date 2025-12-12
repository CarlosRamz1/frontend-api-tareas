import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem('token')

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const isActive = (path) => {
        return location.pathname === path
            ? "text-green-500 border-b-4 border-green-500"
            : "text-gray-500 hover:text-green-500"
    }

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            {/* Logotipo */}
                            <Link to="/" className="flex items-center py-4 px-2">
                                <span className="font-semibold text-gray-500 text-lg">
                                    Gestor de Tareas
                                </span>
                            </Link>
                        </div>
                        {/* Items del menú primario */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/" className={`py-4 px-2 font-semibold transition duration-300 ${isActive('/')}`}>
                                Inicio
                            </Link>
                        </div>
                    </div>
                    {/* Botones secundarios (derecha) */}
                    <div className="hidden md:flex items-center space-x-3 ">
                        {!token ? (
                            <>
                                <Link to="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Entrar</Link>
                                <Link to="/register" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Registrarse</Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="py-2 px-2 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300"
                            >
                                Salir
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
