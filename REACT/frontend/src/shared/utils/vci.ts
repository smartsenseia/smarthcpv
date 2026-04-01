export function getInstructions(normaViolada: boolean, iaDetectouAnomalia: boolean) {
  if (normaViolada) {
    return [
      "Interromper a operação da máquina, se possível.",
      "Reduzir tempo de exposição do operador.",
      "Verificar necessidade de manutenção",
    ];
  }
  if (iaDetectouAnomalia) {
    return [
      "Programar inspeção técnica preventiva.",
      "Verificar fixação, desgaste e condições do sistema móvel.",
      "Acompanhar tendência nas próximas horas.",
    ];
  }
  return [
    "Operação dentro dos parâmetros esperados.",
    "Manter monitoramento contínuo.",
    "Seguir plano de inspeção de rotina.",
  ];
}
