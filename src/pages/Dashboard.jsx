import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showValidationMessage, showMessage } from '../components/Message';
import { downloadComponentAsImage } from '../services/imageService.js';

function Dashboard({ setIsAuthenticated }) {
    const navigate = useNavigate();
    // const dashboardRef = useRef(null);
    const ticketRef = useRef(null);
    const numeros = Array.from({ length: 100 }, (_, i) => i);

    // Inicializamos el estado intentando leer de LocalStorage
    const [seleccionado, setSeleccionado] = useState(() => {
        const guardados = localStorage.getItem('numerosLote');
        return guardados ? JSON.parse(guardados) : [];
    });

    const [valor, setValor] = useState(() => {
        return localStorage.getItem('loteValor') || '';
    });

    const [premio, setPremio] = useState(() => {
        return localStorage.getItem('lotePremio') || '';
    });

    const [fecha, setFecha] = useState(() => {
        return localStorage.getItem('loteFecha') || '';
    });

    // useEffect para guardar automáticamente cuando 'seleccionado' cambie
    useEffect(() => {
        localStorage.setItem('numerosLote', JSON.stringify(seleccionado));
        localStorage.setItem('loteValor', valor);
        localStorage.setItem('lotePremio', premio);
        localStorage.setItem('loteFecha', fecha);
    }, [seleccionado, valor, premio, fecha]);

    const handleToggleNumero = (num) => {
        if (seleccionado.includes(num)) {
            setSeleccionado(seleccionado.filter(n => n !== num));
        } else {
            setSeleccionado([...seleccionado, num]);
        }
    }

    const handleClearAll = async () => {
        try {
            const result = await showValidationMessage({
                title: '¿Cuidado!!',
                text: '¿Desea desmarcar todos los números seleccionados?',
                icon: 'warning'
            });

            if (result && result.isConfirmed) {
                setSeleccionado([]); // Limpia el array
            }
        } catch (error) {
            console.error("Error al limpiar el tablero:", error);
        }
    };

    const handleGenerateImage = async () => {
        try {
            // Capturamos el TICKET oculto, no el dashboard de trabajo
            await downloadComponentAsImage(ticketRef, `loteria-${Date.now()}.png`);
            //console.log('Función de imagen desactivada temporalmente');
        } catch (err) {
            showMessage({
                title: 'Error',
                text: 'No se pudo generar la imagen para WhatsApp',
                icon: 'error'
            });
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/'); // Vuelve al login
    };

    const formatearFechaVisual = (fechaInput) => {
        if (!fechaInput) return 'DD/MM/AAAA';
        const [year, month, day] = fechaInput.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            {/* TABLERO OCULTO PARA IMAGEN */}
            <div style={{ position: 'absolute', left: '-9999px', top: '0' }} >
                <div ref={ticketRef} className="bg-amber-400 p-4 rounded-lg">
                    <div className="text-center">
                        <div className="text-xl font-bold">DINÁMICAS A&L</div>
                        <div className="text-lg">JUEGA Y GANA</div>
                        <div className="text-md">Premio: ${premio}</div>
                        <div className="text-md">Valor: ${valor}</div>
                        <div className="text-md">
                            Fecha: {formatearFechaVisual(fecha)}
                        </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1 mt-4">
                        {numeros.map((num) => (
                            <div
                                key={num}
                                className={`border p-1 text-center text-sm ${seleccionado.includes(num) ? 'bg-green-500 text-white' : 'bg-gray-100'
                                    }`}
                            >
                                {num.toString().padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* FIN TABLERO OCULTO PARA IMAGEN */}

            {/* CONTENIDO PRINCIPAL CENTRADO */}
            <div className="min-h-screen bg-green-950 text-white p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Título centrado */}
                    <h1 className="text-3xl mt-4 text-center mb-8">
                        Tablero de Lotería
                    </h1>

                    {/* Contenedor de dos columnas */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Columna izquierda - Grid de números (70% del ancho) */}
                        <section className="lg:w-7/12 xl:w-8/12">
                            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
                                {numeros.map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => handleToggleNumero(num)}
                                        className={`
                                            w-13 h-13
                                            aspect-square
                                            flex items-center justify-center
                                            text-sm
                                            font-bold
                                            rounded-sm
                                            transition-colors
                                            ${seleccionado.includes(num)
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }
                                        `}
                                    >
                                        {seleccionado.includes(num) ? 'X' : num.toString().padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Columna derecha - Panel de control (30% del ancho) */}
                        <section className="lg:w-5/12 xl:w-4/12 bg-green-800 p-6 rounded-lg h-fit">
                            <h2 className="text-2xl font-bold mb-4 text-center">Estatus</h2>
                            <hr className="border-green-600 mb-4" />

                            {/* Información de números */}
                            <p className="text-lg mb-4 text-center">
                                Números vendidos: <span className="font-bold text-yellow-300">{seleccionado.length}</span>
                                <br />
                                disponibles: <span className="font-bold text-green-300">{100 - seleccionado.length}</span>
                            </p>

                            {/* Inputs */}
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <label className="mb-1 font-semibold">Premio:</label>
                                    <input
                                        className="px-3 py-2 rounded-lg bg-green-700 border border-green-600 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        type="text"
                                        placeholder="Premio $$"
                                        value={premio}
                                        onChange={(e) => setPremio(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-semibold">Valor:</label>
                                    <input
                                        className="px-3 py-2 rounded-lg bg-green-700 border border-green-600 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        type="text"
                                        placeholder="Valor $$"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col mb-8">
                                    <label className="mb-1 font-semibold">Fecha del Sorteo:</label>
                                    <input
                                        type="date"
                                        className="px-3 py-2 rounded-lg bg-green-700 border border-green-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                    />
                                </div>
                            </div>


                            {/* Botones */}
                            <div className="space-y-4">
                                <button
                                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                                    onClick={handleLogout}
                                >
                                    Salir
                                </button>


                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold transition-colors"
                                        onClick={handleClearAll}
                                    >
                                        Desmarcar Todo
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors cursor-pointer"
                                        onClick={handleGenerateImage}
                                    >
                                        Imprimir
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;