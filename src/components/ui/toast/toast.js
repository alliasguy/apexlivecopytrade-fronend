import Swal from 'sweetalert2';
import './toast.css';

/**
 * Centralizes the Swal.mixin toast config that was previously copy-pasted
 * (with the exact same settings, verbatim) into nearly every page component
 * - see AUDIT.md §4. Import { toast } and call toast.success('...') etc.
 * instead of redefining Swal.mixin locally.
 */
const base = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: { popup: 'ui-toast-popup' },
  didOpen: (el) => {
    el.addEventListener('mouseenter', Swal.stopTimer);
    el.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const toast = {
  success: (title) => base.fire({ icon: 'success', title }),
  error: (title) => base.fire({ icon: 'error', title }),
  warning: (title) => base.fire({ icon: 'warning', title }),
  info: (title) => base.fire({ icon: 'info', title }),
};

export default toast;
