'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const float = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

import { useLanguage } from '@/hooks/useLanguage';

export default function LandingPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-dvh bg-[#F8FAFC]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <Image src="/icon-192.png" alt="AuditUs" width={32} height={32} className="w-8 h-8 rounded-xl" />
            <span className="font-extrabold text-[#111827] text-lg tracking-tight">AuditUs</span>
          </div>
        <div className="flex items-center gap-4">
          <Link href="/landing/privacy" className="text-sm text-[#6b7280] hover:text-[#4338CA] transition-colors font-medium">Privacy</Link>
          <Link href="/landing/terms" className="text-sm text-[#6b7280] hover:text-[#4338CA] transition-colors font-medium">Terms</Link>
          <Link href="/landing/contact" className="text-sm text-[#6b7280] hover:text-[#4338CA] transition-colors font-medium">Contact</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-8 pb-16 md:pb-24 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#4338CA]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#7F65D0]/10 rounded-full blur-3xl -z-10" />

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="inline-block mb-4">
          <Badge variant="outline" className="border-[#4338CA] text-[#4338CA] bg-[#4338CA]/5 px-4 py-1.5 text-xs font-bold tracking-wide">
            {t.landing.hero.badge}
          </Badge>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#111827] leading-[1.05] tracking-tight mb-6"
        >
          {t.landing.hero.title}
          <br />
          <span className="text-[#4338CA]">{t.landing.hero.titleAccent}</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg text-[#6b7280] max-w-lg mx-auto mb-10 leading-relaxed"
        >
          {t.landing.hero.desc}
        </motion.p>

        {/* Store buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Button className="bg-[#4338CA] hover:bg-[#3730a3] text-white gap-3 h-14 px-8 rounded-2xl font-bold text-base transition-all hover:scale-105 shadow-lg shadow-indigo-500/30">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            {t.landing.hero.ctaApp}
          </Button>
          <Button className="bg-[#4338CA] hover:bg-[#3730a3] text-white gap-3 h-14 px-8 rounded-2xl font-bold text-base transition-all hover:scale-105 shadow-lg shadow-indigo-500/30">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85C3.34 21.61 3 21.09 3 20.5zm16.5-1.5l-1.32-1.32-1.92-1.92-1.41 1.41 1.41 1.41-1.51 1.51 1.51 1.51 1.51-1.51 1.51 1.51-1.51 1.51-1.51-1.51-1.41 1.41 1.41 1.41 1.92-1.92 1.32-1.32 1.92-1.92-1.51-1.51-1.51 1.51z"/>
            </svg>
            {t.landing.hero.ctaGoogle}
          </Button>
          <Link
            href="/auth"
            className="border border-[#4338CA] text-[#4338CA] hover:bg-[#4338CA]/10 gap-3 h-14 px-8 rounded-2xl font-bold text-base transition-all hover:scale-105 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Jugar en web
          </Link>
        </motion.div>

        {/* Phone mockups - hide on small mobile */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="hidden md:flex relative justify-center items-end gap-6 mx-auto max-w-3xl"
        >
          <motion.div variants={float} animate="animate" className="relative">
            {/* Phone frame 1 */}
            <div className="w-52 h-[28rem] bg-[#111827] rounded-[3rem] p-2 shadow-2xl shadow-indigo-500/20">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-14 bg-[#4338CA] flex items-end px-5 pb-2">
                  <span className="text-white text-xs font-bold">AuditUs</span>
                </div>
                <div className="pt-16 px-5 space-y-4">
                  <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#e5e7eb]">
                    <p className="text-sm font-semibold text-[#111827]">Who in your group would survive a zombie apocalypse?</p>
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 w-16 bg-[#4338CA]/20 rounded-full" />
                      <div className="h-6 w-16 bg-[#7F65D0]/20 rounded-full" />
                      <div className="h-6 w-16 bg-[#BA528E]/20 rounded-full" />
                    </div>
                  </div>
                  <div className="bg-[#4338CA]/5 rounded-2xl p-4 border border-[#4338CA]/20">
                    <p className="text-xs text-[#4338CA] font-bold mb-1">75% voted</p>
                    <p className="text-sm text-[#6b7280]">María would make it. Obviously.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 bg-[#BA528E] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-lg"
            >
              Day 47 streak!
            </motion.div>
          </motion.div>

          <motion.div
            variants={float}
            animate="animate"
            className="relative z-10"
            style={{ animationDelay: '0.5s' }}
          >
            {/* Phone frame 2 */}
            <div className="w-56 h-[30rem] bg-[#4338CA] rounded-[3rem] p-2 shadow-2xl shadow-indigo-500/30">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-14 bg-[#7F65D0] flex items-end px-5 pb-2">
                  <span className="text-white text-xs font-bold">Leaderboard</span>
                </div>
                <div className="pt-16 px-5 space-y-3">
                  {[
                    { name: 'María', pts: '2,450', streak: '47', avatar: 'M' },
                    { name: 'Alex', pts: '2,180', streak: '32', avatar: 'A' },
                    { name: 'Javi', pts: '1,920', streak: '18', avatar: 'J' },
                  ].map((user, i) => (
                    <div key={user.name} className={`bg-[#F8FAFC] rounded-2xl p-4 flex items-center gap-3 ${i === 0 ? 'ring-2 ring-[#BA528E]' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${i === 0 ? 'bg-[#BA528E]' : i === 1 ? 'bg-[#6b7280]' : 'bg-[#7F65D0]/60'}`}>
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#111827]">{user.name}</p>
                        <p className="text-xs text-[#6b7280]">{user.streak} day streak</p>
                      </div>
                      <span className="text-sm font-extrabold text-[#4338CA]">{user.pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute -top-4 -left-6 bg-[#4338CA] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-lg"
            >
              #1 this week!
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features - Scroll-driven */}
      <section className="relative px-4 md:px-6 py-12 md:py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 tracking-tight">{t.landing.features.title}</h2>
          <p className="text-base md:text-lg text-[#6b7280] max-w-md mx-auto">{t.landing.features.desc}</p>
        </motion.div>

        {/* Steps - Full width cards with scroll animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {[
            {
              step: '01',
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
              title: t.landing.features.step1.title,
              desc: t.landing.features.step1.desc,
              color: 'bg-[#4338CA]/10 text-[#4338CA]',
            },
            {
              step: '02',
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ),
              title: t.landing.features.step2.title,
              desc: t.landing.features.step2.desc,
              color: 'bg-[#7F65D0]/15 text-[#7F65D0]',
            },
            {
              step: '03',
              icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ),
              title: t.landing.features.step3.title,
              desc: t.landing.features.step3.desc,
              color: 'bg-[#BA528E]/15 text-[#BA528E]',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-white border border-[#e5e7eb] rounded-2xl md:rounded-3xl p-6 md:p-7 text-center relative overflow-hidden hover:shadow-lg hover:border-[#4338CA]/20 transition-all duration-500 h-full group">
                {/* Step watermark */}
                <span className="absolute top-3 right-4 md:top-5 md:right-6 text-4xl md:text-5xl font-black text-[#f1f5f9] group-hover:text-[#4338CA]/10 transition-colors duration-500">{feature.step}</span>
                {/* Icon */}
                <div className={`inline-flex w-12 h-12 md:w-14 md:h-14 rounded-2xl items-center justify-center mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-[#111827] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed line-clamp-2">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-[#111827]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Loved by friend groups everywhere</h2>
            <p className="text-base md:text-lg text-[#7F65D0]">Real people. Real friendships. Real drama.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { quote: 'Found out I was my group\'s backup plan for everything. Thanks AuditUs.', name: 'Laura, 28' },
              { quote: 'The "who would you trust with your life" question got intense fast.', name: 'Dani, 24' },
              { quote: 'My streak is 89 days. I don\'t miss.', name: 'Mike, 31' },
              { quote: 'Javi thought he was the group\'s favorite. The results said otherwise.', name: 'Cris, 26' },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8">
                  <p className="text-base md:text-lg font-medium text-white/90 leading-relaxed mb-4">&ldquo;{review.quote}&rdquo;</p>
                  <p className="text-sm font-bold text-[#7F65D0]">{review.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="px-6 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-5 tracking-tight">{t.landing.cta.title}</h2>
          <p className="text-base md:text-lg text-[#6b7280] mb-8">{t.landing.cta.desc}</p>

          {!submitted ? (
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t.landing.cta.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl bg-white border-[#e5e7eb] text-[#111827] placeholder:text-[#6b7280]/50 text-base font-medium"
                required
              />
              <Button type="submit" className="h-14 bg-[#BA528E] hover:bg-[#a0457a] text-white rounded-2xl font-bold text-base px-8 transition-all hover:scale-105 shadow-lg shadow-rose-500/30">
                {t.landing.cta.btn}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#4338CA]/10 border border-[#4338CA]/30 rounded-2xl p-6 max-w-md mx-auto"
            >
              <p className="text-[#4338CA] font-bold text-lg">{t.landing.cta.success}</p>
              <p className="text-[#6b7280] text-sm mt-1">{t.landing.cta.successDesc}</p>
            </motion.div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-8">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4338CA]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span className="text-sm text-[#6b7280] font-medium">Free forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4338CA]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="text-sm text-[#6b7280] font-medium">No spam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4338CA]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <span className="text-sm text-[#6b7280] font-medium">No credit card</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white/70 py-10 md:py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Image src="/icon-192.png" alt="AuditUs" width={32} height={32} className="w-8 h-8 rounded-xl" />
              <span className="font-extrabold text-white text-lg">AuditUs</span>
            </div>
            <div className="flex gap-6 md:gap-8 text-sm">
              <Link href="/landing/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/landing/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/landing/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 md:pt-8 text-center text-xs">
            <p>&copy; {new Date().getFullYear()} AuditUs. All rights reserved. Free app with ads.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}