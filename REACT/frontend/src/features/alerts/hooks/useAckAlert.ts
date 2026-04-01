// src/features/alerts/hooks/useAckAlert.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AlertAcknowledgePayload } from "../types";
import { acknowledgeAlert } from "@/features/alerts/api/alerts.api";
import { alertsKeys } from "@/features/alerts/api/alerts.keys";


/**
 * Hook para ACK (acknowledge) de alerta.
 *
 * - Executa a ação de acknowledge no backend (FastAPI)
 * - Invalida listas/detalhes de alertas para manter UI consistente
 * - Encapsula loading/error/success
 *
 * Uso típico:
 * const { mutate: ackAlert, isLoading } = useAckAlert();
 * ackAlert({ alert_id, user_id, comment });
 */
export function useAckAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AlertAcknowledgePayload) =>
      acknowledgeAlert(payload),

    onSuccess: (_data, variables) => {
      // Invalida todas as listas de alertas (com quaisquer filtros)
      queryClient.invalidateQueries({
        queryKey: alertsKeys.all,
      });

      // Opcional: invalida o detalhe do alerta específico
      if (variables?.alert_id) {
        queryClient.invalidateQueries({
          queryKey: alertsKeys.detail(variables.alert_id),
        });
      }
    },
  });
}
