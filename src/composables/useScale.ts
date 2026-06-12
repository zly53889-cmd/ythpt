import { ref, onMounted, onUnmounted, computed } from 'vue';

export function useCanvasScale(targetWidth = 1920, targetHeight = 1080) {
  const windowSize = ref({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  const scale = computed(() => {
    const scaleX = windowSize.value.width / targetWidth;
    const scaleY = windowSize.value.height / targetHeight;
    return Math.min(scaleX, scaleY);
  });

  const scaleX = computed(() => windowSize.value.width / targetWidth);
  const scaleY = computed(() => windowSize.value.height / targetHeight);

  return { scale, scaleX, scaleY };
}
