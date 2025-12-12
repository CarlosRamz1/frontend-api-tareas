export default function Navbar() {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            {/* Logotipo */}
                            <a href="#" className="flex items-center py-4 px-2">
                                <span className="font-semibold text-gray-500 text-lg">
                                    Gestor de Tareas
                                </span>
                            </a>
                        </div>
                        {/* Items del menú primario */}
                        <div className="hidden md:flex items-center space-x-1">
                            <a href="#" className="py-4 px-2 text-green-500 border-b-4 border-green-500 font-semibold ">Inicio</a>
                            <a href="#" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Mis Tareas</a>
                        </div>
                    </div>
                    {/* Botones secundarios (derecha) */}
                    <div className="hidden md:flex items-center space-x-3 ">
                        <a href="" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Entrar</a>
                        <a href="" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Registrarse</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}
