import React, { useState } from 'react';
import { KeyRound, Mail, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { FormField, Input, PasswordInput } from '../common/FormComponents';
import { useERP } from '../../context/ERPContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { requestPasswordReset, resetPasswordWithToken, addToast } = useERP();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetState = () => {
    setStep(1);
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your corporate email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setIsLoading(false);
      setStep(2);
      // Auto-populate a dummy demo token for smooth evaluation
      setToken('MSS-8849');
    } catch {
      setIsLoading(false);
      setError('Failed to initiate password reset.');
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter the 6-digit recovery authorization token.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await resetPasswordWithToken(email, token, newPassword);
    setIsLoading(false);

    if (result.success) {
      addToast('Password successfully reset. You can now login.', 'success', 'Password Updated');
      handleResetState();
    } else {
      setError(result.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetState}
      title="Secure Password Recovery"
      subtitle="Mountain Security Services Personnel Access Recovery"
      icon={<KeyRound className="w-5 h-5 text-red-500" />}
      maxWidth="md"
    >
      <div className="py-2">
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered Mountain Security Services email address. A one-time security recovery token will be generated to verify your identity.
            </p>

            <FormField label="Corporate Email Address" required error={error}>
              <Input
                type="email"
                placeholder="e.g. robert.vance@mountainsecurity.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={handleResetState}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Dispatch Recovery Token
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Security Token Dispatched</strong>
                <p className="mt-0.5 text-emerald-700">
                  A verification token has been generated for <strong>{email}</strong>. For demonstration, we have pre-filled the authorization token below.
                </p>
              </div>
            </div>

            <FormField label="Recovery Security Token" required error={error} helperText="Enter token formatted as MSS-XXXX">
              <Input
                type="text"
                placeholder="MSS-8849"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setError('');
                }}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                required
              />
            </FormField>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Verify & Proceed
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4">
            <p className="text-xs text-slate-600">
              Create a new secure password meeting MSS enterprise security complexity standards.
            </p>

            <FormField label="New Password" required error={error} helperText="Minimum 8 characters with letters & numbers">
              <PasswordInput
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </FormField>

            <FormField label="Confirm New Password" required>
              <PasswordInput
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </FormField>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Save Password & Invalidate Token
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
