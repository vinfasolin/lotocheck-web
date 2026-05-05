export const getErrorMessage = (e, f='Não foi possível concluir a operação.') => e?.response?.data?.message || e?.message || f
export const getValidationErrors = e => e?.response?.data?.errors || {}
