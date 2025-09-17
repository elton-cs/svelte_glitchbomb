<script lang="ts">
    interface Props {
        size?: "sm" | "md" | "lg";
        class?: string;
    }

    let { size = "md", class: custom_class = "" }: Props = $props();

    const size_classes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };
</script>

<svg
    class="inline-block {size_classes[size]} {custom_class}"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
>
    <rect x="3.38" y="3.38" width="17.25" height="17.25" rx="2.18" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <rect x="7.21" y="7.21" width="9.58" height="9.58" rx="1.92" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="7.21" y1="0.5" x2="7.21" y2="2.42" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="12" y1="0.5" x2="12" y2="2.42" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="16.79" y1="0.5" x2="16.79" y2="2.42" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="7.21" y1="21.58" x2="7.21" y2="23.5" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="12" y1="21.58" x2="12" y2="23.5" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="16.79" y1="21.58" x2="16.79" y2="23.5" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="0.5" y1="16.79" x2="2.42" y2="16.79" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="0.5" y1="12" x2="2.42" y2="12" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="0.5" y1="7.21" x2="2.42" y2="7.21" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="21.58" y1="16.79" x2="23.5" y2="16.79" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="21.58" y1="12" x2="23.5" y2="12" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
    <line x1="21.58" y1="7.21" x2="23.5" y2="7.21" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.92"/>
</svg>