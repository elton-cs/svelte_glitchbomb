<script lang="ts">
  interface Props {
    class?: string;
    size?: "sm" | "md" | "lg";
  }

  let { class: className = "", size = "md" }: Props = $props();

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };
</script>

<svg
  class="{sizeClasses[size]} {className}"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    x="3.38"
    y="3.38"
    width="17.25"
    height="17.25"
    rx="2.18"
    stroke="currentColor"
    stroke-width="1.92"
    fill="none"
  />
  <rect
    x="7.21"
    y="7.21"
    width="9.58"
    height="9.58"
    rx="1.92"
    stroke="currentColor"
    stroke-width="1.92"
    fill="none"
  />
  <line
    x1="7.21"
    y1="0.5"
    x2="7.21"
    y2="2.42"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="12"
    y1="0.5"
    x2="12"
    y2="2.42"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="16.79"
    y1="0.5"
    x2="16.79"
    y2="2.42"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="7.21"
    y1="21.58"
    x2="7.21"
    y2="23.5"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="12"
    y1="21.58"
    x2="12"
    y2="23.5"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="16.79"
    y1="21.58"
    x2="16.79"
    y2="23.5"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="0.5"
    y1="16.79"
    x2="2.42"
    y2="16.79"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="0.5"
    y1="12"
    x2="2.42"
    y2="12"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="0.5"
    y1="7.21"
    x2="2.42"
    y2="7.21"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="21.58"
    y1="16.79"
    x2="23.5"
    y2="16.79"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="21.58"
    y1="12"
    x2="23.5"
    y2="12"
    stroke="currentColor"
    stroke-width="1.92"
  />
  <line
    x1="21.58"
    y1="7.21"
    x2="23.5"
    y2="7.21"
    stroke="currentColor"
    stroke-width="1.92"
  />
</svg>
