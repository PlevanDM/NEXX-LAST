import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import type { BookingFormData } from '../../lib/types';

export interface BookingFormProps {
  prefilledService?: string;
  prefilledDevice?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  prefilledService,
  prefilledDevice,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    device: prefilledDevice || '',
    service: prefilledService || '',
    comment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Будь ласка, введіть ваше ім\'я');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Будь ласка, введіть номер телефону');
      return false;
    }
    // Basic phone validation
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage('Некоректний номер телефону');
      return false;
    }
    if (!formData.device.trim()) {
      setErrorMessage('Будь ласка, виберіть пристрій');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send to RO App API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          device: '',
          service: '',
          comment: '',
        });
        if (onSuccess) onSuccess();
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Помилка при відправці заявки');
        if (onError) onError(data.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Помилка з\'єднання. Спробуйте ще раз.');
      if (onError) onError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Записатися на ремонт
          </h3>
          <p className="text-sm text-slate-600">
            Заповніть форму і ми зв'яжемося з вами протягом 5 хвилин
          </p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Ваше ім'я *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Іван Петренко"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Телефон *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+380 12 345 6789"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Device */}
        <div>
          <label htmlFor="device" className="block text-sm font-medium text-slate-700 mb-1">
            Пристрій *
          </label>
          <select
            id="device"
            name="device"
            value={formData.device}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Виберіть пристрій</option>
            <option value="iPhone">iPhone</option>
            <option value="iPad">iPad</option>
            <option value="MacBook">MacBook</option>
            <option value="Apple Watch">Apple Watch</option>
            <option value="iMac">iMac</option>
            <option value="Android">Android</option>
            <option value="Laptop">Ноутбук (Windows)</option>
            <option value="Інше">Інше</option>
          </select>
        </div>

        {/* Service (optional) */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">
            Послуга (опціонально)
          </label>
          <input
            type="text"
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            placeholder="Наприклад: Заміна екрану"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-1">
            Коментар (опціонально)
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={3}
            placeholder="Опишіть проблему..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Error Message */}
        {submitStatus === 'error' && errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <i className="fa fa-exclamation-circle mr-2"></i>
            {errorMessage}
          </div>
        )}

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <i className="fa fa-check-circle mr-2"></i>
            Дякуємо! Ваша заявка прийнята. Ми зв'яжемося з вами найближчим часом.
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          icon={isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}
        >
          {isSubmitting ? 'Відправка...' : 'Відправити заявку'}
        </Button>

        <p className="text-xs text-slate-500 text-center">
          Натискаючи кнопку, ви погоджуєтесь з{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            політикою конфіденційності
          </a>
        </p>
      </form>
    </Card>
  );
};

export default BookingForm;
