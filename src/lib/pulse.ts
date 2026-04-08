import { toast } from "sonner";

export const pulse = {
  success: (message: string) => {
    toast.success(message, {
      description: "Operación completada con éxito.",
    });
  },
  error: (message: string) => {
    toast.error(message, {
      description: "Hubo un problema al procesar la solicitud.",
    });
  },
  info: (message: string) => {
    toast(message, {
      description: "Información relevante para tu círculo.",
    });
  },
  vote: (username: string) => {
    toast(`¡Tu voto ha sido registrado!`, {
      description: `Has votado por ${username}. Pulse activado.`,
      icon: "🔥",
    });
  },
};
