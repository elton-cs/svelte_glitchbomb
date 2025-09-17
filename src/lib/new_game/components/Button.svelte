<script lang="ts">
  interface Props {
    onclick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    class?: string;
  }

  let {
    onclick,
    disabled = false,
    variant = 'primary',
    size = 'medium',
    class: className = ''
  }: Props = $props();

  let { children } = $props();

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-black text-white border-white hover:bg-white hover:text-black',
    secondary: 'bg-white text-black border-white hover:bg-black hover:text-white'
  };

  // Disabled classes
  const disabledClasses = 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed';

  // Combine all classes
  const buttonClasses = `
    w-full font-bold uppercase tracking-wide border-2 transition-colors
    ${disabled ? disabledClasses : variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();
</script>

<button
  {onclick}
  {disabled}
  class={buttonClasses}
>
  {@render children()}
</button>