export function formatDate(v){ if(!v) return '-'; const d=new Date(v); return Number.isNaN(d.getTime()) ? v : new Intl.DateTimeFormat('pt-BR').format(d) }
export function formatDateTime(v){ if(!v) return '-'; const d=new Date(v); return Number.isNaN(d.getTime()) ? v : new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(d) }
