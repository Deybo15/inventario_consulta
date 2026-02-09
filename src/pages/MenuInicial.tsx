import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    QrCode,
    ArrowUpRight,
    History,
    LayoutGrid,
    ChevronRight,
    Search,
    Truck
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { supabase } from '../lib/supabase';

export default function MenuInicial() {
    const navigate = useNavigate();
    const [isWarehouseAuthorized, setIsWarehouseAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkWarehouseRole = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                // BROAD DEBUG CHECK
                const { data: allData } = await supabase
                    .from('colaboradores_06')
                    .select('*')
                    .ilike('correo_colaborador', `%${session.user.email?.split('@')[0]}%`);

                console.log('DEBUG - MenuInicial User Data Found:', allData);

                const { data: colabs, error: colabError } = await supabase
                    .from('colaboradores_06')
                    .select('Bodeguero')
                    .ilike('correo_colaborador', session.user.email || '')
                    .ilike('Bodeguero', 'Autorizado');

                console.log('DEBUG - MenuInicial Auth Check:', {
                    email: session.user.email,
                    found: !!colabs && colabs.length > 0,
                    data: colabs,
                    error: colabError
                });

                setIsWarehouseAuthorized(!!colabs && colabs.length > 0);
            } catch (error) {
                console.error('Error checking warehouse role:', error);
                setIsWarehouseAuthorized(false);
            }
        };

        checkWarehouseRole();
    }, []);

    const modules = [
        {
            title: 'Consultar Inventario',
            icon: <ClipboardList className="w-8 h-8" />,
            path: '/articulos/consultar-inventario',
            description: 'Ver y gestionar el stock completo de artículos en tiempo real.'
        },
        {
            title: 'Escáner QR',
            icon: <QrCode className="w-8 h-8" />,
            path: '/articulos/escaner-qr',
            description: 'Identificar y consultar productos rápidamente mediante códigos QR.'
        },
        {
            title: 'Historial de Salidas',
            icon: <ArrowUpRight className="w-8 h-8" />,
            path: '/articulos/consultar-salidas',
            description: 'Consulta avanzada de movimientos por número de solicitud.'
        },
        {
            title: 'Historial de Artículo',
            icon: <History className="w-8 h-8" />,
            path: '/articulos/historial-articulo',
            description: 'Análisis cronológico de consumos y trazabilidad completa.'
        },
        // Módulo condicional
        ...(isWarehouseAuthorized ? [{
            title: 'Control de Salidas',
            icon: <Truck className="w-8 h-8" />,
            path: '/articulos/control-salidas',
            description: 'Garantizar la entrega física de los artículos y archivar registros.'
        }] : [])
    ];

    return (
        <div className="min-h-screen bg-[#000000] p-8 text-[#F5F5F7]">
            <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <PageHeader
                        title="Gestión Operativa"
                        icon={LayoutGrid}
                        themeColor="blue"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {modules.map((module, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(module.path)}
                            className="glass-card group relative p-10 flex flex-col h-80 text-left hover:border-[#0071E3]/50 transition-all duration-300"
                        >
                            {/* Icon Container */}
                            <div className="mb-8 p-6 bg-[#0071E3]/10 rounded-[12px] w-fit group-hover:scale-110 transition-all duration-300 text-[#0071E3] border border-[#0071E3]/20">
                                {module.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <h3 className="text-3xl font-bold text-[#F5F5F7] leading-tight tracking-tight uppercase group-hover:text-[#0071E3] transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-[#86868B] text-sm font-medium leading-relaxed max-w-md">
                                    {module.description}
                                </p>
                            </div>

                            {/* Footer Interaction */}
                            <div className="mt-6 flex items-center gap-2 text-[#0071E3] opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[12px] font-black uppercase tracking-widest text-[#0071E3]">Acceder al módulo</span>
                                <ChevronRight className="w-5 h-5" />
                            </div>

                            {/* Apple Accent Indicator */}
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0071E3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
