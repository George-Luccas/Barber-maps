
export const getDefaultServiceImage = (serviceName: string): string => {
  const name = serviceName.toLowerCase();

  // Haircut variations
  if (
    name.includes("corte") ||
    name.includes("cabelo") ||
    name.includes("degrade") ||
    name.includes("degradê") ||
    name.includes("social") ||
    name.includes("tesoura") ||
    name.includes("máquina") ||
    name.includes("maquina") ||
    name.includes("infantil")
  ) {
    return "/services/haircut.png";
  }

  // Combo variations
  if (
    name.includes("combo") ||
    (name.includes("cabelo") && name.includes("barba")) ||
    (name.includes("corte") && name.includes("barba"))
  ) {
    return "/services/combo.png";
  }

  // Beard variations
  if (
    name.includes("barba") ||
    name.includes("barboterapia") ||
    name.includes("pezinho") ||
    name.includes("acabamento")
  ) {
    return "/services/beard.png";
  }

  // Eyebrow variations
  if (
    name.includes("sobrancelha") ||
    name.includes("monocelha") ||
    name.includes("fio a fio")
  ) {
    return "/services/eyebrows.png";
  }

  // Fallback
  return "/services/other.png";
};
