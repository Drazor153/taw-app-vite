import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getHorarioDocDispo = async (rut) => {
  const res = await api.get("disponibilidad-docente", {
    params: { rutDocente: rut },
  });
  return res.data;
};

export const postDispo = (matrixDispo) =>
  api.post("actualizar-disponibilidad", matrixDispo);
