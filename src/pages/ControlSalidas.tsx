import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
    Truck,
    Clock,
    CheckCircle,
    List,
    ArrowLeft,
    RefreshCw,
    Loader2,
    Check,
    AlertCircle,
    Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { PageHeader } from '../components/ui/PageHeader';

interface SalidaArticulo {
    id_salida: number;
    fecha_salida: string;
    autoriza: string;
    retira: string;
    entregada: boolean | null;
}

export default function ControlSalidas() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [entregas, setEntregas] = useState<SalidaArticulo[]>([]);
    const [colaboradores, setColaboradores] = useState<Record<string, string>>({});
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchDatos = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch pending deliveries
            const { data: salidas, error: salidasError } = await supabase
                .from('salida_articulo_08')
                .select('id_salida, fecha_salida, autoriza, retira, entregada')
                .or('entregada.eq.false,entregada.is.null')
                .order('id_salida', { ascending: false });

            if (salidasError) throw salidasError;

            const pendingSalidas = salidas || [];
            setEntregas(pendingSalidas);

            // 2. Resolve collaborator aliases
            const idsUnicos = [...new Set([
                ...pendingSalidas.map(s => s.autoriza),
                ...pendingSalidas.map(s => s.retira)
            ].filter(Boolean))];

            if (idsUnicos.length > 0) {
                const { data: cols, error: colsError } = await supabase
                    .from('colaboradores_06')
                    .select('identificacion, alias')
                    .in('identificacion', idsUnicos);

                if (!colsError && cols) {
                    const map = cols.reduce((acc, curr) => {
                        acc[curr.identificacion] = curr.alias;
                        return acc;
                    }, {} as Record<string, string>);
                    setColaboradores(map);
                }
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDatos();
    }, [fetchDatos]);

    const marcarEntregada = async (id: number) => {
        if (!confirm('¿Confirma que desea marcar esta entrega como completada?')) return;

        setProcessingId(id);
        try {
            const hoy = new Date().toISOString();
            const { error } = await supabase
                .from('salida_articulo_08')
                .update({ entregada: true, fecha_entregada: hoy })
                .eq('id_salida', id);

            if (error) throw error;

            setEntregas(prev => prev.filter(e => e.id_salida !== id));
        } catch (error) {
            console.error('Error al procesar entrega:', error);
            alert('Error al procesar la entrega');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] p-8 text-[#F5F5F7]">
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <PageHeader
                        title="Control de Salidas"
                        icon={Truck}
                        themeColor="emerald"
                    />

                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                            <Clock className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">
                                {entregas.length} Pendientes
                            </span>
                        </div>
                        <button
                            onClick={fetchDatos}
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw className={cn("w-5 h-5 text-gray-400", loading && "animate-spin")} />
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="glass-card overflow-hidden border border-white/10 bg-[#0f111a]/95 rounded-[2.5rem] shadow-2xl">
                    <div className="px-10 py-6 border-b border-white/10 bg-black/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <List className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em]">Lista de Entregas Pendientes</h3>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-white/5 bg-black/20 custom-scrollbar-premium">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-10 bg-[#121212] border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">ID Salida</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Fecha</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Autoriza</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Retira</th>
                                        <th className="px-6 py-5 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {loading && entregas.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
                                                <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Sincronizando entregas...</span>
                                            </td>
                                        </tr>
                                    ) : entregas.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center opacity-40">
                                                <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                                <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">No hay entregas pendientes</span>
                                            </td>
                                        </tr>
                                    ) : (
                                        entregas.map((entrega) => (
                                            <tr key={entrega.id_salida} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono font-black text-emerald-400 text-sm">{entrega.id_salida}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-white/80 text-xs font-medium">
                                                        {new Date(entrega.fecha_salida).toLocaleDateString('es-CR')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-400 text-xs uppercase font-black tracking-tight italic">
                                                        {colaboradores[entrega.autoriza] || 'N/D'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-400 text-xs uppercase font-black tracking-tight italic">
                                                        {colaboradores[entrega.retira] || 'N/D'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => marcarEntregada(entrega.id_salida)}
                                                        disabled={processingId === entrega.id_salida}
                                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-50"
                                                    >
                                                        {processingId === entrega.id_salida ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                        Entregar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="px-10 py-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 hover:-translate-x-1 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Regresar
                        </button>

                        <div className="hidden md:flex items-center gap-2 text-gray-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Confirme la entrega para archivar</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar-premium::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar-premium::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-premium::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar-premium::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.3);
                }
            `}</style>
        </div>
    );
}
