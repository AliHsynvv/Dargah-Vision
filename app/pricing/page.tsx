'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Building2, ArrowRight, HelpCircle, Box, Layers, Palette } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for trying out our AI design tools',
        price: 15,
        credits: 25,
        popular: false,
        features: [
            'Up to 25 image generations',
            'Access to all AI tools',
            'Standard processing speed',
            'Download in PNG format',
            'Email support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        description: 'Best for designers and small studios',
        price: 29,
        credits: 60,
        popular: true,
        features: [
            'Up to 60 image generations',
            'Priority processing queue',
            'HD quality exports',
            'Commercial usage rights',
            'Priority email support',
            'Access to new features early',
        ],
    },
    {
        id: 'studio',
        name: 'Studio',
        description: 'For agencies and professional teams',
        price: 49,
        credits: 120,
        popular: false,
        features: [
            'Up to 120 image generations',
            'Fastest processing speed',
            '4K quality exports',
            'Team collaboration (5 seats)',
            'Dedicated support',
            'Custom API access',
            'White-label options',
        ],
    },
]

const faqs = [
    {
        question: 'What is an image generation credit?',
        answer: 'Each time you generate an image using any of our AI tools, it uses one credit. Failed generations due to our system issues do not count against your credits.',
    },
    {
        question: 'Do credits expire?',
        answer: 'No, your credits never expire. Use them whenever you need, at your own pace.',
    },
    {
        question: 'Can I upgrade my plan?',
        answer: "Yes, you can upgrade anytime. You'll keep your remaining credits and gain the new plan's benefits immediately.",
    },
    {
        question: 'Is there a free trial?',
        answer: 'We offer 3 free generations for new users to try our platform before purchasing a plan.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers for Studio plans.',
    },
]

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
            </div>

            <main className="relative pt-28 pb-20 px-6">
                {/* Header */}
                <section className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">Simple, transparent pricing</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                    >
                        Pay Only for What You{' '}
                        <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                            Create
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto mb-8"
                    >
                        No monthly subscriptions. No hidden fees. Just purchase credits and create stunning AI-powered designs.
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-3 p-1.5 rounded-full bg-white/5 border border-white/10"
                    >
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                                ? 'bg-white text-black'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            One-time
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billingCycle === 'yearly'
                                ? 'bg-white text-black'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            Monthly
                            <span className={`text-xs px-2 py-0.5 rounded-full ${billingCycle === 'yearly' ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-400'
                                }`}>
                                Save 20%
                            </span>
                        </button>
                    </motion.div>
                </section>

                {/* Pricing Cards */}
                <section className="max-w-6xl mx-auto mb-24">
                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.1 }}
                                className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${plan.popular
                                    ? 'bg-white text-black border-2 border-white shadow-2xl shadow-white/10 scale-105'
                                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                                    }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.popular ? 'bg-black/10' : 'bg-white/10'
                                        }`}>
                                        {plan.id === 'starter' && <Zap className="w-6 h-6" />}
                                        {plan.id === 'pro' && <Sparkles className="w-6 h-6" />}
                                        {plan.id === 'studio' && <Building2 className="w-6 h-6" />}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className={`text-sm ${plan.popular ? 'text-black/60' : 'text-white/50'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold">
                                            ${billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}
                                        </span>
                                        {billingCycle === 'yearly' && (
                                            <span className={`text-lg line-through ${plan.popular ? 'text-black/30' : 'text-white/30'}`}>
                                                ${plan.price}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm mt-1 ${plan.popular ? 'text-black/60' : 'text-white/50'}`}>
                                        {plan.credits} image credits
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="flex-1 mb-8">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-green-600' : 'text-green-400'
                                                    }`} />
                                                <span className={`text-sm ${plan.popular ? 'text-black/70' : 'text-white/60'}`}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <button
                                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${plan.popular
                                        ? 'bg-black text-white hover:bg-black/90'
                                        : 'bg-white text-black hover:bg-white/90'
                                        }`}
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Features Comparison */}
                <section className="max-w-4xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">All Plans Include</h2>
                        <p className="text-white/50">Every plan gives you access to our full suite of AI tools</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Box className="w-6 h-6" />, title: '2D to 3D Conversion', desc: 'Transform floor plans', gradient: 'from-purple-500/20 to-pink-500/20' },
                            { icon: <Sparkles className="w-6 h-6" />, title: 'AI Interior Design', desc: 'Generate stunning interiors', gradient: 'from-amber-500/20 to-orange-500/20' },
                            { icon: <Layers className="w-6 h-6" />, title: 'Furniture Planning', desc: 'Smart placement', gradient: 'from-green-500/20 to-emerald-500/20' },
                            { icon: <Palette className="w-6 h-6" />, title: 'Reference Design', desc: 'Style matching', gradient: 'from-blue-500/20 to-cyan-500/20' },
                        ].map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
                            >
                                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-white/50">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-white/50">Got questions? We&apos;ve got answers</p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="border border-white/10 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-medium">{faq.question}</span>
                                    <HelpCircle className={`w-5 h-5 text-white/40 transition-transform ${openFaq === idx ? 'rotate-180' : ''
                                        }`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-5 pb-5">
                                        <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20"
                    >
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Designs?</h2>
                        <p className="text-white/50 mb-8">Start with 3 free generations. No credit card required.</p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Try Free Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </section>
            </main>
        </div>
    )
}
