import { ref } from 'vue';

const isLoading = ref(false);
const loadingMessage = ref('');

export function useLoader() {
    const show = (message = 'Cargando...') => {
        loadingMessage.value = message;
        isLoading.value = true;
    };

    const hide = () => {
        isLoading.value = false;
        loadingMessage.value = '';
    };

    const toggle = (message) => {
        if (isLoading.value) {
            hide();
        } else {
            show(message);
        }
    };

    return {
        isLoading,
        loadingMessage,
        show,
        hide,
        toggle
    };
}
