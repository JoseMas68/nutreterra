import { useState, useEffect, useRef } from 'react';

interface EmailTemplate {
    id: string;
    slug: string;
    name: string;
    subject: string;
    body: string;
    design?: {
        primaryColor: string;
        logoUrl: string;
    };
}

export default function EmailBuilder({ apiUrl }: { apiUrl: string }) {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [selectedSlug, setSelectedSlug] = useState('order-confirmation');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);

    const previewRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        fetchTemplates();
    }, [apiUrl]);

    useEffect(() => {
        if (templates.length > 0) {
            const t = templates.find(t => t.slug === selectedSlug) || templates[0];
            setCurrentTemplate({ ...t });
        }
    }, [selectedSlug, templates]);

    useEffect(() => {
        updatePreview();
    }, [currentTemplate]);

    const fetchTemplates = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/admin/emails`);
            const data = await response.json();
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePreview = () => {
        if (!currentTemplate || !previewRef.current) return;
        const doc = previewRef.current.contentDocument;
        if (!doc) return;

        // Simple replacement of variables for preview
        let previewHtml = currentTemplate.body;
        const demoVars = {
            orderNumber: '12345',
            customerName: 'Jose García',
            totalPrice: '45.00',
            address: 'Calle Mayor 1, Madrid',
            orderUrl: '#',
            trackingUrl: '#',
            storeUrl: '#',
        };

        Object.entries(demoVars).forEach(([key, value]) => {
            previewHtml = previewHtml.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        });

        doc.open();
        doc.write(previewHtml);
        doc.close();
    };

    const handleSave = async () => {
        if (!currentTemplate) return;
        setSaving(true);
        try {
            const response = await fetch(`${apiUrl}/api/admin/emails`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentTemplate),
            });

            if (response.ok) {
                alert('Plantilla guardada con éxito');
                fetchTemplates();
            }
        } catch (error) {
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Cargando constructor...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)]">
            {/* Panel de Control */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">Editor de Emails</h2>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Seleccionar Plantilla</label>
                    <select
                        value={selectedSlug}
                        onChange={(e) => setSelectedSlug(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    >
                        {templates.map(t => (
                            <option key={t.slug} value={t.slug}>{t.name}</option>
                        ))}
                    </select>
                </div>

                {currentTemplate && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Asunto del Email</label>
                            <input
                                type="text"
                                value={currentTemplate.subject}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">HTML de la Plantilla</label>
                            <textarea
                                value={currentTemplate.body}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                                className="w-full h-80 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {saving ? 'Guardando...' : 'Guardar Plantilla'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Vista Previa */}
            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-md">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Vista Previa (Móvil/Desktop)</span>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>
                <div className="bg-gray-200 rounded-2xl flex-1 overflow-hidden shadow-inner border-[10px] border-gray-900/10">
                    <iframe
                        ref={previewRef}
                        className="w-full h-full bg-white shadow-2xl"
                        title="Email Preview"
                    />
                </div>
            </div>
        </div>
    );
}
