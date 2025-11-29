<!-- Icon/Ground.vue -->
<template>
    <svg width="256" height="256" viewBox="0 0 32 32" style="image-rendering: pixelated;">
        <rect width="32" height="32" fill="#4a7c59" />
        <rect x="0" y="0" width="32" height="32" fill="url(#floorPattern)" />
        <defs>
            <pattern id="floorPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#4a7c59" />
                <rect x="0" y="0" width="8" height="1" fill="#5a8c69" />
                <rect x="0" y="0" width="1" height="8" fill="#5a8c69" />
            </pattern>
        </defs>
    </svg>
</template>
