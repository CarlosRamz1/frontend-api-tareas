import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm'

export default function Home() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            setLoading(false)
            return
        }
        fetchTasks()
    }, [token, navigate])

    const fetchTasks = () => {
        fetch('http://localhost:8000/api/tasks/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    navigate('/login')
                    throw new Error('Sesión expirada')
                }
                return res.json()
            })
            .then(data => {
                setTasks(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    const handleTaskCreated = (newTask) => {
        setTasks([newTask, ...tasks])
    }

    const handleDelete = async (taskId) => {
        if (!confirm('¿Estás seguro de querer borrar esta tarea?')) return

        try {
            const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== taskId))
            }
        } catch (error) {
            console.error('Error borrando tarea:', error)
        }
    }

    const handleToggleComplete = async (task) => {
        // Actualización optimista
        const updatedTasks = tasks.map(t =>
            t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
        )
        setTasks(updatedTasks)

        try {
            await fetch(`http://localhost:8000/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_completed: !task.is_completed })
            })
        } catch (error) {
            console.error('Error actualizando tarea:', error)
            fetchTasks()
        }
    }

    if (!token) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a tu Gestor de Tareas</h1>
                <p className="text-xl text-gray-600 mb-8">Organiza tu vida de forma sencilla y eficiente.</p>
                <div className="space-x-4">
                    <Link to="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                        Registrarse
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <TaskForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleTaskCreated}
            />

            <div className="flex justify-between items-center mb-8 mt-6">
                <h1 className="text-3xl font-bold text-gray-800">Mis Tareas</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition shadow"
                >
                    + Nueva Tarea
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Cargando tareas...</p>
            ) : tasks.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg mb-4">No tienes tareas pendientes</p>
                    <p className="text-gray-400">¡Crea una para empezar!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition flex justify-between items-center group">
                            <div
                                className="cursor-pointer flex-grow"
                                onClick={() => handleToggleComplete(task)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                        {task.is_completed && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold text-lg ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Botón Borrar */}
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="text-red-500 hover:text-red-700 font-medium text-sm p-2 hover:bg-red-50 rounded"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
