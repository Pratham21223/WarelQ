export default function StatusBadge({ status }) {
  const variants = {
    draft: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      dot: 'bg-gray-500',
      label: 'Draft'
    },
    waiting: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      label: 'Waiting'
    },
    validated: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
      label: 'Validated'
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500',
      label: 'Cancelled'
    }
  };

  const variant = variants[status] || variants.draft;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${variant.bg} ${variant.text}`}>
      <span className={`w-2 h-2 rounded-full ${variant.dot} animate-pulse`}></span>
      {variant.label}
    </span>
  );
}
