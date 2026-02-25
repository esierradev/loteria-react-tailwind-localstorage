import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { showMessage } from '../components/Message';
import { ImgEyeOpen, ImgEyeClose, ImgHelp } from '../components/Icons';

function Login({ setIsAuthenticated }) {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        if (!user.trim() || !password.trim()) {
            showMessage({
                title: 'Error',
                text: 'Por favor ingrese sus credenciales',
                icon: 'error'
            });
            return;
        }

        if (user === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            navigate('/Dashboard');
        } else {
            showMessage({
                title: 'Error',
                text: 'Credenciales incorrectas. Inténtalo de nuevo.',
                icon: 'error'
            });
        }
    }

    const handleHelp = () => {
        showMessage({
            title: 'Ayuda',
            text: 'Aplicación de control de números vendidos de loteria, la información se guarda de forma local, para acceder ingrese Usuario: admin y Contraseña: admin',
            icon: 'question'
        });
        return;
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className='bg-green-600 px-8 py-12 rounded-2xl flex flex-col items-center gap-6 w-full max-w-md'>
                    <img src="/public/lotery.png" className='w-15' alt="" />

                    <h1 className="text-center text-2xl mb-3">Ingrese sus Datos de Acceso</h1>

                    <form onSubmit={handleLogin} className="">
                        <input
                            className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 bg-green-400 my-2"
                            type="text"
                            placeholder="Usuario"
                            value={user}
                            onChange={(e) => setUser(e.target.value.toLocaleLowerCase())}
                        />

                        <div>
                            <input
                                className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 bg-green-400 my-2"
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value.toLocaleLowerCase())}
                            />
                            <button
                                type="button"
                                className="relative bottom-11 left-57 cursor-pointer text-black"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <ImgEyeOpen /> : <ImgEyeClose />}
                            </button>
                        </div>

                        <button className="w-full bg-red-500 text-white px-2 py-2 rounded-2xl cursor-pointer hover:bg-red-400 hover:text-black mb-6" type="submit" >Iniciar Sesión</button>



                        <span className='text-gray-700 text-sm text-center'><p>@ Desarrollado por Emmanuel Sierra 2026</p></span>

                        <div className="flex justify-center pt-4">
                            <button className="p-1 bg-white/20 rounded-full hover:bg-white/40 transition-all hover:scale-110" type="button" onClick={handleHelp}>
                                <ImgHelp />
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </>
    )
}

export default Login