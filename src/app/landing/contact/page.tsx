'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#111827] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/landing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/icon-192.png" alt="AuditUs" width={32} height={32} className="w-8 h-8 rounded-xl" />
              <span className="font-extrabold text-white text-lg">AuditUs</span>
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-[#7F65D0] mt-2">We&apos;d love to hear from you.</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {!submitted ? (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#e5e7eb]">
            <h2 className="text-2xl font-extrabold text-[#111827] mb-2">Send us a message</h2>
            <p className="text-[#6b7280] mb-8">Fill out the form below and we&apos;ll get back to you within 48 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Your name</label>
                <Input
                  placeholder="María García"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-12 rounded-xl border-[#e5e7eb] bg-[#F8FAFC] text-[#111827] placeholder:text-[#6b7280]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Email address</label>
                <Input
                  type="email"
                  placeholder="maria@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-12 rounded-xl border-[#e5e7eb] bg-[#F8FAFC] text-[#111827] placeholder:text-[#6b7280]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">What&apos;s on your mind?</label>
                <Textarea
                  placeholder="Tell us about a bug, feature request, or just say hi..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="min-h-[140px] rounded-xl border-[#e5e7eb] bg-[#F8FAFC] text-[#111827] placeholder:text-[#6b7280]/50 resize-none"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-14 bg-[#BA528E] hover:bg-[#a0457a] text-white rounded-xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-rose-500/30">
                Send message
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-[#4338CA]/10 border border-[#4338CA]/30 rounded-3xl p-10 text-center">
            <Image src="/icon-192.png" alt="AuditUs" width={64} height={64} className="w-16 h-16 rounded-full mx-auto mb-5" />
            <h2 className="text-2xl font-extrabold text-[#111827] mb-2">Message sent!</h2>
            <p className="text-[#6b7280] mb-6">Thanks for reaching out. We&apos;ll get back to you within 48 hours.</p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
              className="text-[#4338CA] font-bold hover:underline"
            >
              Send another message
            </button>
          </div>
        )}

        {/* Alternative contact */}
        <div className="mt-10 text-center">
          <p className="text-[#6b7280] text-sm">Prefer email directly?</p>
          <a href="mailto:hello@auditus.fun" className="text-[#4338CA] font-bold text-lg hover:underline">hello@auditus.fun</a>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-indigo-100">
          <Link href="/landing" className="text-[#4338CA] font-bold hover:underline">
            &larr; Back to AuditUs
          </Link>
        </div>
      </main>
    </div>
  );
}