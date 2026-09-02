import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Edit,
  Printer,
  Calendar,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { MSSLogo } from '../branding/MSSLogo';
import { Modal } from '../common/Modal';
import { FormField, Input, Textarea } from '../common/FormComponents';
import { useERP } from '../../context/ERPContext';
import { Company } from '../../types';

export const CompanyProfileView: React.FC = () => {
  const { company, updateCompanyProfile, hasPermission, isSuperAdmin } = useERP();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Company>(company);
  const [isSaving, setIsSaving] = useState(false);

  const canEdit = isSuperAdmin() || hasPermission('company.edit');

  const handleOpenEdit = () => {
    setFormData(company);
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateCompanyProfile(formData);
    setIsSaving(false);
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Edit CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Official Corporate Profile & Credentials
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Master organizational identity, state PPO licensing, corporate governance, and 24/7 dispatch credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl shadow-2xs transition-colors inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
            >
              <Edit className="w-4 h-4 text-red-400" />
              <span>Edit Corporate Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Corporate Letterhead / Dossier Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Document Header with MSS Official Logo */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-slate-200 min-w-0 max-w-full">
          <div className="min-w-0 flex-1">
            <MSSLogo mode="document-header" />
          </div>
          <div className="text-left lg:text-right space-y-1 text-xs text-slate-600 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              State Licensed & Bonded
            </div>
            <p className="font-mono text-slate-900 font-bold mt-1">PPO License: {company.licenseNumber}</p>
            <p className="font-mono text-slate-500">State Reg: {company.registrationNumber}</p>
            <p className="font-mono text-slate-500">Tax ID / EIN: {company.taxRegistrationNumber || company.taxId}</p>
          </div>
        </div>

        {/* Corporate Motto & Overview */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Corporate Motto & Tagline
            </span>
            <p className="text-base font-bold text-slate-900 font-['Space_Grotesk'] mt-0.5">
              &quot;{company.tagline}&quot;
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Operational Status
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              Active 24/7 Security Operations
            </span>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Box 1: Corporate Headquarters */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Headquarters</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {company.address}
            </p>
            <div className="pt-2 text-[11px] text-slate-400 font-mono">
              Established: {company.establishedYear} • Colorado, USA
            </div>
          </div>

          {/* Box 2: Contact Channels */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
              <Phone className="w-4 h-4 text-red-600" />
              <span>Dispatch & Contact</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Corporate Line:</span>
                <strong className="font-mono text-slate-800">{company.phone}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">24/7 Emergency:</span>
                <strong className="font-mono text-red-600 font-bold">{company.emergencyPhone || company.emergencyHotline}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Official Email:</span>
                <strong className="font-mono text-slate-800">{company.email}</strong>
              </div>
            </div>
          </div>

          {/* Box 3: Regulatory Compliance */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
              <Award className="w-4 h-4 text-red-600" />
              <span>Licensing & Insurance</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>$5,000,000 General Liability Bond</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>BSIS Armed Guard Certified</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Workers&apos; Compensation Full Coverage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Security Service Capabilities */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] uppercase tracking-wider mb-3">
            Authorized Security Service Lines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: 'Armed & Unarmed Site Guarding',
                desc: 'Static post and access control guarding for commercial, industrial, and high-risk residential sites.',
              },
              {
                title: '24/7 Mobile Patrol & Alarm Response',
                desc: 'Dedicated marked patrol vehicles with GPS tracking, scheduled spot checks, and immediate alarm dispatch.',
              },
              {
                title: 'Executive & Dignitary Protection',
                desc: 'Close personal protection details by former law enforcement and military tactical personnel.',
              },
              {
                title: 'High-Value Asset Escort & Logistics',
                desc: 'Armored transport and secure chain-of-custody transfer for currency, bullion, and controlled assets.',
              },
              {
                title: 'Critical Infrastructure & Site Securing',
                desc: 'Regulatory compliance safeguarding for power stations, data facilities, and healthcare campuses.',
              },
              {
                title: 'Integrated Electronic Surveillance',
                desc: 'Central station CCTV monitoring, body-worn camera management, and biometric access administration.',
              },
            ].map((svc, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <h4 className="text-xs font-bold text-slate-900 font-['Space_Grotesk']">{svc.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Company Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Corporate Profile"
        subtitle="Mountain Security Services Master Organizational Record"
        icon={<Building2 className="w-5 h-5 text-red-500" />}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Official Company Name" required>
              <Input
                value={formData.officialName}
                onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Short / Display Name" required>
              <Input
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                required
              />
            </FormField>

            <FormField label="PPO License Number" required>
              <Input
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
              />
            </FormField>

            <FormField label="State Registration / Filing" required>
              <Input
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Corporate Phone" required>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </FormField>

            <FormField label="24/7 Emergency Dispatch Hotline" required>
              <Input
                value={formData.emergencyHotline}
                onChange={(e) => setFormData({ ...formData, emergencyHotline: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Official Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Website URL" required>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Corporate Motto / Tagline" required>
            <Input
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Headquarters Address" required>
            <Textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
            >
              {isSaving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Corporate Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
