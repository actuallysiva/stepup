export function resolveImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/120';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return url.startsWith('/') ? url : `/${url}`;
}

export function formatPrice(value) {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}

export function combineOtp(inputs) {
  return inputs.map((el) => el?.value || '').join('');
}

export function readOtpFromRefs(refs) {
  return refs.map((el) => el?.value || '').join('');
}

export function handleOtpInput(e, index, refs) {
  const val = e.target.value.replace(/\D/g, '').slice(-1);
  e.target.value = val;
  if (val && index < refs.length - 1) {
    refs[index + 1]?.focus();
  }
}

export function handleOtpKeyDown(e, index, refs) {
  if (e.key === 'Backspace' && !e.target.value && index > 0) {
    refs[index - 1]?.focus();
  }
}
