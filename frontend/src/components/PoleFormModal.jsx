import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const emptyForm = {
  poleNumber: '',
  area: '',
  village: '',
  feeder: '',
  transformer: '',
  latitude: '',
  longitude: ''
};

const PoleFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude)
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass w-full max-w-lg rounded-2xl p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">
                {initialData ? 'Edit Pole' : 'Add New Pole'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {[
                ['poleNumber', 'Pole Number'],
                ['feeder', 'Feeder'],
                ['area', 'Area / Sector'],
                ['village', 'Village'],
                ['transformer', 'Transformer'],
                ['latitude', 'Latitude'],
                ['longitude', 'Longitude']
              ].map(([name, label]) => (
                <div key={name} className={name === 'poleNumber' ? 'col-span-2' : ''}>
                  <label className="mb-1 block text-xs font-medium text-slate-400">{label}</label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={name !== 'transformer'}
                    type={name === 'latitude' || name === 'longitude' ? 'number' : 'text'}
                    step="any"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-grid-blue"
                  />
                </div>
              ))}

              <div className="col-span-2 mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-grid-blue px-5 py-2 text-sm font-semibold text-grid-dark hover:brightness-110"
                >
                  {initialData ? 'Save Changes' : 'Add Pole'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PoleFormModal;
