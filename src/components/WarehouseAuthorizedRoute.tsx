import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ShieldAlert } from 'lucide-react';

export const WarehouseAuthorizedRoute = () => {
    const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized' | 'no-session'>('loading');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    setStatus('no-session');
                    return;
                }

                // Verificamos si el usuario tiene el valor 'Autorizado' en la columna 'bodeguero'
                const { data: colabs, error } = await supabase
                    .from('colaboradores_06')
                    .select('bodeguero')
                    .ilike('correo_colaborador', session.user.email || '')
                    .ilike('bodeguero', 'Autorizado');

                if (error || !colabs || colabs.length === 0) {
                    setStatus('unauthorized');
                } else {
                    setStatus('authorized');
                }
            } catch (error) {
                console.error('Error checking warehouse authorization:', error);
                setStatus('unauthorized');
            }
        };

        checkAuth();
    }, []);

    if (status === 'loading') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#000000]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-gray-400 font-medium">Verificando credenciales de Bodeguero...</p>
                </div>
            </div>
        );
    }

    if (status === 'no-session') {
        return <Navigate to="/login" replace />;
    }

    if (status === 'unauthorized') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#000000] p-6 text-center">
                <div className="max-w-md bg-[#0f111a]/95 p-10 rounded-[2.5rem] border border-rose-500/20 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/20 shadow-inner">
                        <ShieldAlert className="w-12 h-12 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tight italic">Acceso Denegado</h1>
                    <p className="text-rose-400 font-bold text-lg mb-8 leading-relaxed uppercase">
                        ESTA PÁGINA ES EXCLUSIVA PARA PERSONAL AUTORIZADO DE BODEGA
                    </p>
                    <div className="h-px bg-white/5 w-full mb-8"></div>
                    <p className="text-gray-500 text-sm mb-10 font-medium">
                        Se requiere que su perfil tenga el rol de **Bodeguero Autorizado** para acceder a la gestión de entregas.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 px-8 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 shadow-lg uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                    >
                        Volver al Panel Principal
                    </button>
                </div>
            </div>
        );
    }

    return <Outlet />;
};
