import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import * as api from '../utils/api';
import { Event } from '../data/mockData';
import { CreditCard, Lock, CheckCircle, Calendar, MapPin, Ticket, User, Mail, Phone, Shield } from 'lucide-react';

interface CheckoutProps {
  user?: any;
}

export default function Checkout({ user }: CheckoutProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const eventData = await api.getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/competitions');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const pricePerTicket = parseInt(event.price.replace(/[^0-9]/g, ''));
  const subtotal = pricePerTicket * ticketCount;
  const convenienceFee = Math.round(subtotal * 0.05);
  const total = subtotal + convenienceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Process payment and create booking
      setProcessing(true);
      try {
        const bookingData = {
          userId: user.id,
          eventId: event.id,
          eventName: event.title,
          ticketCount,
          totalAmount: `₹${total}`,
          contactName: formData.name,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          paymentMethod,
        };

        await api.createBooking(user.accessToken, bookingData);
        
        setTimeout(() => {
          navigate(`/registration-confirmation/${id}`);
        }, 1000);
      } catch (error) {
        console.error('Booking error:', error);
        alert('Failed to complete booking. Please try again.');
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  1
                </div>
                <span className="text-gray-900 dark:text-white hidden sm:inline">Details</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  2
                </div>
                <span className="text-gray-900 dark:text-white hidden sm:inline">Payment</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                  3
                </div>
                <span className="text-gray-900 dark:text-white hidden sm:inline">Confirm</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-gray-900 dark:text-white mb-6 text-2xl flex items-center gap-2">
                      <User className="text-purple-500" size={24} />
                      Contact Details
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Number of Tickets
                        </label>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                            className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-2xl text-gray-900 dark:text-white w-12 text-center">{ticketCount}</span>
                          <button
                            type="button"
                            onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                            className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-gray-900 dark:text-white mb-6 text-2xl flex items-center gap-2">
                      <CreditCard className="text-purple-500" size={24} />
                      Payment Method
                    </h2>

                    {/* Payment Method Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          paymentMethod === 'upi'
                            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          paymentMethod === 'netbanking'
                            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        Net Banking
                      </button>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={formData.cardExpiry}
                              onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={formData.cardCvv}
                              onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={formData.upiId}
                          onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                          placeholder="yourname@upi"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                          Select Bank
                        </label>
                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white">
                          <option>State Bank of India</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}

                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                        <Shield size={20} />
                        <span className="text-sm">Your payment is secured with 256-bit SSL encryption</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                  >
                    {step === 1 ? (
                      <>Continue to Payment</>
                    ) : (
                      <>
                        <Lock size={20} />
                        Pay ₹{total}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
                <h3 className="text-gray-900 dark:text-white mb-6 text-xl">Order Summary</h3>
                
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-gray-900 dark:text-white mb-3">{event.title}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin size={16} />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{ticketCount} × Ticket</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-gray-900 dark:text-white text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl">
                  <div className="flex items-start gap-2 text-sm text-purple-800 dark:text-purple-300">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Instant ticket delivery via email</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}