import React, { useState } from 'react';
import { motion } from 'framer-motion';
import contactHeroBg from '../assets/contact_hero.png';
import {
    Phone, Mail, MessageSquare, Clock, MapPin, ChevronDown, ChevronUp,
    Hammer, Wrench, ShieldCheck, HeadphonesIcon, Users, Zap,
    CheckCircle2, ArrowRight, Send, AlertCircle
} from 'lucide-react';

/* ─── Animation Variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } }),
};

/* ─── Data ─── */
const HOW_IT_WORKS = [
    {
        step: '01',
        icon: <Wrench className="w-7 h-7" />,
        title: 'Choose a Service',
        desc: 'Browse our curated catalog of home services — from plumbing and electrical work to deep cleaning and full house renovation.',
        color: 'from-blue-500 to-blue-600',
        glow: 'shadow-blue-200',
    },
    {
        step: '02',
        icon: <Users className="w-7 h-7" />,
        title: 'Get Matched Instantly',
        desc: 'Our platform connects you with verified, background-checked local professionals in your area within minutes.',
        color: 'from-violet-500 to-violet-600',
        glow: 'shadow-violet-200',
    },
    {
        step: '03',
        icon: <Zap className="w-7 h-7" />,
        title: 'Book & Confirm',
        desc: 'Pick your preferred time slot, confirm the booking, and receive a real-time tracking update when your pro is on the way.',
        color: 'from-cyan-500 to-cyan-600',
        glow: 'shadow-cyan-200',
    },
    {
        step: '04',
        icon: <ShieldCheck className="w-7 h-7" />,
        title: 'Pay Safely & Review',
        desc: 'Pay securely after the job is done. Rate your experience and help the community find the best local professionals.',
        color: 'from-emerald-500 to-emerald-600',
        glow: 'shadow-emerald-200',
    },
];

const HELPLINES = [
    {
        icon: <Phone className="w-6 h-6" />,
        label: 'Customer Helpline',
        value: '+91 98765 43210',
        sub: 'Mon – Sat, 8 AM – 10 PM IST',
        href: 'tel:+919876543210',
        color: 'bg-blue-50 border-blue-100 text-blue-600',
        badge: 'Call Now',
    },
    {
        icon: <Phone className="w-6 h-6" />,
        label: 'Provider Support',
        value: '+91 87654 32109',
        sub: 'Mon – Sat, 9 AM – 8 PM IST',
        href: 'tel:+918765432109',
        color: 'bg-violet-50 border-violet-100 text-violet-600',
        badge: 'Partners Only',
    },
    {
        icon: <Phone className="w-6 h-6" />,
        label: 'Emergency Helpline',
        value: '+91 76543 21098',
        sub: '24 × 7 — Urgent situations only',
        href: 'tel:+917654321098',
        color: 'bg-red-50 border-red-100 text-red-600',
        badge: '24/7',
    },
    {
        icon: <Mail className="w-6 h-6" />,
        label: 'Email Support',
        value: 'support@localfix.in',
        sub: 'We reply within 24 hours',
        href: 'mailto:support@localfix.in',
        color: 'bg-emerald-50 border-emerald-100 text-emerald-600',
        badge: 'Email',
    },
    {
        icon: <MessageSquare className="w-6 h-6" />,
        label: 'Live Chat',
        value: 'Chat with us instantly',
        sub: 'Available inside the app',
        href: '#',
        color: 'bg-orange-50 border-orange-100 text-orange-600',
        badge: 'Online',
    },
    {
        icon: <MapPin className="w-6 h-6" />,
        label: 'Head Office',
        value: 'Chandigarh, Punjab, India',
        sub: 'Visit by appointment only',
        href: 'https://maps.google.com',
        color: 'bg-slate-50 border-slate-200 text-slate-600',
        badge: 'Office',
    },
];

const FAQS = [
    {
        q: 'How do I book a service on LocalFix?',
        a: 'Simply browse the Services page, choose your category (e.g., Plumbing, Electrical, Cleaning), select a provider near you, pick a time slot, and confirm. You\'ll receive a booking confirmation instantly.',
    },
    {
        q: 'Are all service providers verified?',
        a: 'Yes. Every provider on LocalFix goes through a strict background verification, identity check, and skill assessment before being approved on the platform.',
    },
    {
        q: 'What if I\'m not satisfied with the service?',
        a: 'Your satisfaction is guaranteed. If you\'re not happy, raise a complaint within 24 hours of service completion and we will re-assign a professional at no extra cost or issue a full refund.',
    },
    {
        q: 'How do I track my service professional?',
        a: 'After booking confirmation, you\'ll receive real-time updates when your professional is assigned, on the way, and when work begins — all from your profile dashboard.',
    },
    {
        q: 'Can I reschedule or cancel a booking?',
        a: 'Yes. You can reschedule or cancel from your profile up to 2 hours before the appointment without any charge. Cancellations made less than 2 hours before may incur a small convenience fee.',
    },
    {
        q: 'How do I become a service provider on LocalFix?',
        a: 'Click "Become a Partner" in the navigation bar and fill out the enrollment form. Our team reviews your application within 48 hours and contacts you with the next steps.',
    },
];

/* ─── Sub-components ─── */
const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-white'}`}
        >
            <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(!open)}
            >
                <span className="font-bold text-slate-800 text-sm md:text-base">{q}</span>
                {open
                    ? <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
            </button>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 pb-5 text-slate-600 text-sm leading-relaxed"
                >
                    {a}
                </motion.div>
            )}
        </div>
    );
};

/* ─── Main Page ─── */
const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate a submit — wire to your API when ready
        setTimeout(() => {
            setSending(false);
            setSent(true);
            setForm({ name: '', email: '', phone: '', message: '' });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ─── Hero Banner ─── */}
            <section className="relative bg-slate-900 overflow-hidden pt-24 pb-24">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={contactHeroBg} 
                        alt="Contact Hero Background" 
                        className="w-full h-full object-cover opacity-30 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-50" />
                </div>

                {/* Decorative glows */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none z-10" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none z-10" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp}
                        className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6"
                    >
                        <HeadphonesIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">24/7 Support Available</span>
                    </motion.div>

                    <motion.h1
                        custom={1} initial="hidden" animate="visible" variants={fadeUp}
                        className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-5"
                    >
                        We're Here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Help You</span>
                    </motion.h1>

                    <motion.p
                        custom={2} initial="hidden" animate="visible" variants={fadeUp}
                        className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        Got a question, complaint, or just want to know how LocalFix works? We've got you covered around the clock.
                    </motion.p>

                    <motion.div
                        custom={3} initial="hidden" animate="visible" variants={fadeUp}
                        className="mt-10 flex flex-wrap justify-center gap-6"
                    >
                        {[
                            { icon: <Clock className="w-4 h-4" />, label: 'Avg. Response: < 2 hrs' },
                            { icon: <ShieldCheck className="w-4 h-4" />, label: 'Satisfaction Guaranteed' },
                            { icon: <Users className="w-4 h-4" />, label: '50,000+ Customers Served' },
                        ].map(({ icon, label }) => (
                            <div key={label} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <span className="text-blue-400">{icon}</span>
                                {label}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} className="text-center mb-14"
                >
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Platform Overview</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        How <span className="text-blue-600">LocalFix</span> Works
                    </h2>
                    <p className="mt-4 text-slate-500 max-w-xl mx-auto text-lg">
                        From booking to completion — a seamless, fully managed home service experience in 4 simple steps.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {HOW_IT_WORKS.map((item, i) => (
                        <motion.div
                            key={item.step}
                            custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                            variants={fadeUp}
                            className="relative bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="text-6xl font-black text-slate-100 absolute top-5 right-6 select-none group-hover:text-blue-50 transition-colors">
                                {item.step}
                            </div>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ${item.glow} flex items-center justify-center text-white mb-5`}>
                                {item.icon}
                            </div>
                            <h3 className="font-black text-slate-900 text-lg mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── Support Helplines ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={fadeUp} className="text-center mb-14"
                    >
                        <span className="inline-block text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Get in Touch</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Customer <span className="text-blue-600">Support</span> Channels
                        </h2>
                        <p className="mt-4 text-slate-500 max-w-xl mx-auto text-lg">
                            Reach us through your preferred channel — phone, email, or live chat. We're always on.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {HELPLINES.map((h, i) => (
                            <motion.a
                                key={h.label}
                                href={h.href}
                                target={h.href.startsWith('http') ? '_blank' : '_self'}
                                rel="noreferrer"
                                custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                variants={fadeUp}
                                className={`flex items-start gap-4 p-6 rounded-2xl border ${h.color} hover:scale-[1.02] transition-all duration-300 group`}
                            >
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                    {h.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-black uppercase tracking-widest opacity-70">{h.label}</p>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/60">{h.badge}</span>
                                    </div>
                                    <p className="font-black text-slate-900 text-sm mb-0.5 truncate">{h.value}</p>
                                    <p className="text-xs text-slate-500">{h.sub}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Contact Form + Map-like Info ─── */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Form */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 block">Send a Message</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
                            Drop Us a Line
                        </h2>
                        <p className="text-slate-500 mb-8">
                            Fill in the form and our support team will get back to you within 24 hours.
                        </p>

                        {sent ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center"
                            >
                                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">Message Sent!</h3>
                                <p className="text-slate-500 text-sm">We'll reply to your email within 24 hours.</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-6 text-sm font-bold text-blue-600 hover:underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
                                        { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                                    ].map(({ label, name, type, placeholder }) => (
                                        <div key={name}>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{label}</label>
                                            <input
                                                type={type}
                                                placeholder={placeholder}
                                                value={form[name]}
                                                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                                                required={name !== 'phone'}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Your Message</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Describe your issue, question, or feedback..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Right: Info cards */}
                    <motion.div
                        custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={fadeUp} className="space-y-5"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 block">Working Hours & Office</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8">
                            Our Support <span className="text-blue-600">Hours</span>
                        </h2>

                        {[
                            {
                                icon: <Clock className="w-5 h-5 text-blue-600" />,
                                title: 'General Support',
                                lines: ['Monday – Saturday', '8:00 AM – 10:00 PM IST'],
                            },
                            {
                                icon: <Phone className="w-5 h-5 text-red-600" />,
                                title: 'Emergency Helpline',
                                lines: ['Available 24 × 7', 'For urgent situations only'],
                            },
                            {
                                icon: <Mail className="w-5 h-5 text-emerald-600" />,
                                title: 'Email Response Time',
                                lines: ['Within 24 Business Hours', 'support@localfix.in'],
                            },
                            {
                                icon: <MapPin className="w-5 h-5 text-violet-600" />,
                                title: 'Head Office',
                                lines: ['Chandigarh, Punjab', 'India — 160001'],
                            },
                        ].map(({ icon, title, lines }) => (
                            <div key={title} className="flex gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                    {icon}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 text-sm mb-1">{title}</p>
                                    {lines.map(l => <p key={l} className="text-slate-500 text-sm">{l}</p>)}
                                </div>
                            </div>
                        ))}

                        {/* Trust badge */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                            <div className="flex items-start gap-4">
                                <ShieldCheck className="w-8 h-8 shrink-0 mt-1" />
                                <div>
                                    <p className="font-black text-lg mb-1">100% Satisfaction Guarantee</p>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                        If you're not satisfied with any service, we re-do it free or refund you — no questions asked.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={fadeUp} className="text-center mb-12"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 block">Common Questions</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Frequently Asked <span className="text-blue-600">Questions</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <motion.div
                                key={i}
                                custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                variants={fadeUp}
                            >
                                <FAQItem q={faq.q} a={faq.a} />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        custom={7} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={fadeUp}
                        className="mt-10 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-5"
                    >
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                            <strong>Still have questions?</strong> Call our helpline at <a href="tel:+919876543210" className="font-black underline">+91 98765 43210</a> or email <a href="mailto:support@localfix.in" className="font-black underline">support@localfix.in</a> and we'll be happy to assist.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ─── Bottom CTA ─── */}
            <section className="py-16 bg-slate-900 text-center px-6">
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-900/40">
                        <Hammer className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Ready to Book a Service?
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Join thousands of happy customers who trust LocalFix for every home need.
                    </p>
                    <a
                        href="/services"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-full transition-all shadow-lg shadow-blue-900/40 group"
                    >
                        Explore Services
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </section>
        </div>
    );
};

export default ContactPage;
