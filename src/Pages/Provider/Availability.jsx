import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    MapPin,
    Plus,
    Trash2,
    Save,
    Clock,
    Zap,
    CheckCircle2,
    XCircle,
    Calendar,
    AlertCircle,
    Info,
    ToggleLeft,
    ToggleRight,
    Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Availability = () => {
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State mirrors the DB
    const [isAvailable, setIsAvailable] = useState(true);
    const [serviceAreas, setServiceAreas] = useState([]); // [{ pincode, areaName }]
    const [workingDays, setWorkingDays] = useState([]);
    const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
    const [emergencyAvailability, setEmergencyAvailability] = useState(false);

    // For new pincode input
    const [newPincode, setNewPincode] = useState('');
    const [newAreaName, setNewAreaName] = useState('');
    const [pincodeError, setPincodeError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

    // Main registered pincode from provider (shown as locked base)
    const [basePincode, setBasePincode] = useState('');
    const [baseArea, setBaseArea] = useState('');
    const [baseCity, setBaseCity] = useState('');

    // Premium Feature: Lookup Pincode
    useEffect(() => {
        const lookupPincode = async () => {
            if (newPincode.length === 6) {
                setFetchingSuggestions(true);
                try {
                    // Using a public API for Indian pincodes (highly likely based on context)
                    const res = await axios.get(`https://api.postalpincode.in/pincode/${newPincode}`);
                    if (res.data[0]?.Status === "Success") {
                        const posts = res.data[0].PostOffice;
                        // Extract unique names
                        const names = [...new Set(posts.map(p => p.Name))];
                        setSuggestions(names);
                        // Auto-fill first name if area name is empty
                        if (!newAreaName && names.length > 0) {
                            setNewAreaName(names[0]);
                        }
                    } else {
                        setSuggestions([]);
                    }
                } catch (err) {
                    console.error("Pincode lookup failed", err);
                    setSuggestions([]);
                } finally {
                    setFetchingSuggestions(false);
                }
            } else {
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(lookupPincode, 500);
        return () => clearTimeout(timeoutId);
    }, [newPincode]);

    const fetchAvailability = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/api/providers/my/availability`, {
                withCredentials: true,
            });
            if (res.data.success) {
                const d = res.data.data;
                setIsAvailable(d.isAvailable !== false);
                setServiceAreas(d.serviceAreas || []);
                setWorkingDays(d.workingDays || []);
                setWorkingHours(d.workingHours || { start: '09:00', end: '18:00' });
                setEmergencyAvailability(d.emergencyAvailability || false);
                setBasePincode(String(d.pincode || ''));
                setBaseArea(d.area || '');
                setBaseCity(d.city || '');
            }
        } catch (err) {
            toast.error('Failed to load availability settings');
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Add new service area pincode
    const handleAddPincode = () => {
        const cleaned = newPincode.trim().replace(/\D/g, '');
        if (!/^\d{6}$/.test(cleaned)) {
            setPincodeError('Please enter a valid 6-digit pincode');
            return;
        }
        // Check if pincode already exists (including base pincode)
        const allExisting = [basePincode, ...serviceAreas.map(a => a.pincode)];
        if (allExisting.includes(cleaned)) {
            setPincodeError('This pincode is already in your service area');
            return;
        }
        setPincodeError('');
        setServiceAreas(prev => [
            ...prev,
            { pincode: cleaned, areaName: newAreaName.trim() },
        ]);
        setNewPincode('');
        setNewAreaName('');
        setSuggestions([]);
    };

    const handleRemovePincode = (index) => {
        setServiceAreas(prev => prev.filter((_, i) => i !== index));
    };

    const toggleDay = (day) => {
        setWorkingDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                serviceAreas,
                workingDays,
                workingHours,
                emergencyAvailability,
                isAvailable,
            };
            const res = await axios.patch(`${apiUrl}/api/providers/my/availability`, payload, {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success('Availability settings saved!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleAvailability = async () => {
        const newVal = !isAvailable;
        setIsAvailable(newVal);
        try {
            await axios.patch(`${apiUrl}/api/providers/my/availability`, { isAvailable: newVal }, {
                withCredentials: true,
            });
            toast.success(newVal ? '🟢 You are now Online' : '🔴 You are now Offline');
        } catch {
            setIsAvailable(!newVal); // revert
            toast.error('Failed to update status');
        }
    };

    // All pincodes (base + additional) for display count
    const totalAreas = 1 + serviceAreas.length;// base + extras

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">
                        Availability <span className="text-orange-600">Manager</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Control which areas you serve and when you're available.
                    </p>
                </div>

                {/* Online / Offline Toggle */}
                <button
                    onClick={handleToggleAvailability}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 shadow-lg ${
                        isAvailable
                            ? 'bg-green-500 text-white shadow-green-200 hover:bg-green-600'
                            : 'bg-slate-700 text-white shadow-slate-300 hover:bg-slate-800'
                    }`}
                >
                    {isAvailable ? (
                        <><ToggleRight size={22} /> ONLINE — Accepting Orders</>
                    ) : (
                        <><ToggleLeft size={22} /> OFFLINE — Not Accepting</>
                    )}
                </button>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-sm text-orange-800">
                <Info size={18} className="flex-shrink-0 mt-0.5 text-orange-500" />
                <span>
                    Only bookings from your <strong>service area pincodes</strong> will appear in your <strong>Open Orders</strong>.
                    Your base registration pincode is always included automatically.
                </span>
            </div>

            {/* ─── SERVICE AREAS ─── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <MapPin className="text-orange-500" size={22} />
                            Service Areas
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            You currently cover <span className="font-bold text-slate-700">{totalAreas}</span> pincode{totalAreas !== 1 ? 's' : ''}.
                        </p>
                    </div>
                </div>

                {/* Base Pincode (locked) */}
                <div className="mb-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                        📌 Base Pincode (from enrollment — always active)
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                        <div className="p-2.5 bg-orange-500 text-white rounded-xl">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-lg">{basePincode || '—'}</p>
                            <p className="text-xs text-slate-500 font-medium">
                                {baseArea}{baseArea && baseCity ? ', ' : ''}{baseCity}
                            </p>
                        </div>
                        <span className="ml-auto text-xs bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full">
                            Base
                        </span>
                    </div>
                </div>

                {/* Additional Pincodes */}
                {serviceAreas.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                            ➕ Additional Areas
                        </p>
                        <div className="space-y-3">
                            {serviceAreas.map((area, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-orange-200 transition-all group"
                                >
                                    <div className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl group-hover:border-orange-200 group-hover:text-orange-500 transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900">{area.pincode}</p>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {area.areaName || 'No area name set'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemovePincode(index)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Remove this area"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Pincode */}
                <div className="border-t border-slate-100 pt-6">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                        Add New Service Area
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 relative">
                        <div className="flex-1 space-y-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="6-digit Pincode"
                                    value={newPincode}
                                    onChange={e => {
                                        setNewPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        setPincodeError('');
                                    }}
                                    onKeyDown={e => e.key === 'Enter' && handleAddPincode()}
                                    className={`w-full px-4 py-3.5 rounded-xl border font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                                        pincodeError ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                                    }`}
                                />
                                {fetchingSuggestions && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 size={18} className="animate-spin text-orange-500" />
                                    </div>
                                )}
                            </div>
                            {pincodeError && (
                                <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                                    <AlertCircle size={12} /> {pincodeError}
                                </p>
                            )}
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Area name (e.g. Bopal)"
                                value={newAreaName}
                                onChange={e => setNewAreaName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddPincode()}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            />
                            
                            {/* PREMIUM SUGGESTIONS DROPDOWN */}
                            {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nearby Areas Found</p>
                                        <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto">
                                        {suggestions.map((name, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setNewAreaName(name);
                                                    setSuggestions([]);
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition flex items-center gap-2 border-b border-slate-50 last:border-0"
                                            >
                                                <MapPin size={14} className="text-slate-300 group-hover:text-orange-400" />
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleAddPincode}
                            className="flex items-center gap-2 px-6 py-3.5 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 active:scale-95 transition shadow-lg shadow-orange-200 whitespace-nowrap"
                        >
                            <Plus size={18} /> Add Area
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── WORKING DAYS ─── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                    <Calendar className="text-orange-500" size={22} />
                    Working Days
                </h2>
                <div className="flex flex-wrap gap-3">
                    {DAYS.map(day => {
                        const active = workingDays.includes(day);
                        return (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
                                    active
                                        ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                                }`}
                            >
                                {active && <CheckCircle2 size={14} className="inline mr-1.5 mb-0.5" />}
                                {day.slice(0, 3)}
                            </button>
                        );
                    })}
                </div>
                {workingDays.length === 0 && (
                    <p className="text-xs text-slate-400 mt-4 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> No working days selected. Select the days you work.
                    </p>
                )}
            </div>

            {/* ─── WORKING HOURS ─── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                    <Clock className="text-orange-500" size={22} />
                    Working Hours
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            Start Time
                        </label>
                        <input
                            type="time"
                            value={workingHours.start || '09:00'}
                            onChange={e => setWorkingHours(h => ({ ...h, start: e.target.value }))}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </div>
                    <div className="text-slate-300 font-black text-xl mt-4 sm:mt-6">→</div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            End Time
                        </label>
                        <input
                            type="time"
                            value={workingHours.end || '18:00'}
                            onChange={e => setWorkingHours(h => ({ ...h, end: e.target.value }))}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </div>
                </div>
            </div>

            {/* ─── EMERGENCY AVAILABILITY ─── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Zap className="text-yellow-500" size={22} />
                            Emergency Availability
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Allow customers to book you for urgent same-day service requests outside your normal hours.
                        </p>
                    </div>
                    <button
                        onClick={() => setEmergencyAvailability(v => !v)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                            emergencyAvailability ? 'bg-yellow-400' : 'bg-slate-200'
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                emergencyAvailability ? 'translate-x-7' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
                {emergencyAvailability && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-700 font-medium flex items-center gap-2">
                        <Zap size={14} className="text-yellow-500" />
                        Emergency mode is ON. Customers can request urgent service from you.
                    </div>
                )}
            </div>

            {/* ─── SUMMARY CARD ─── */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white">
                <h3 className="font-black text-white mb-4 text-lg">📋 Your Coverage Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                        <p className="text-3xl font-black text-orange-400">{totalAreas}</p>
                        <p className="text-xs text-white/60 font-bold mt-1">Pincodes</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                        <p className="text-3xl font-black text-green-400">{workingDays.length}</p>
                        <p className="text-xs text-white/60 font-bold mt-1">Work Days</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                        <p className="text-lg font-black text-blue-400">
                            {workingHours.start || '—'} – {workingHours.end || '—'}
                        </p>
                        <p className="text-xs text-white/60 font-bold mt-1">Hours</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                        {emergencyAvailability
                            ? <CheckCircle2 className="text-yellow-400 mx-auto" size={28} />
                            : <XCircle className="text-slate-500 mx-auto" size={28} />
                        }
                        <p className="text-xs text-white/60 font-bold mt-1">Emergency</p>
                    </div>
                </div>
            </div>

            {/* ─── SAVE BUTTON ─── */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-10 py-4 bg-orange-600 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {saving
                        ? <><Loader2 size={20} className="animate-spin" /> Saving…</>
                        : <><Save size={20} /> Save All Settings</>
                    }
                </button>
            </div>
        </div>
    );
};

export default Availability;
