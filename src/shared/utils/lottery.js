export const LOTTERY_TYPES = [
  {
    value: 'megasena',
    label: 'Mega-Sena',
    min: 6,
    max: 15,
    from: 1,
    to: 60,
    prizeHits: [4, 5, 6],
  },
  {
    value: 'quina',
    label: 'Quina',
    min: 5,
    max: 15,
    from: 1,
    to: 80,
    prizeHits: [2, 3, 4, 5],
  },
  {
    value: 'lotofacil',
    label: 'Lotofácil',
    min: 15,
    max: 20,
    from: 1,
    to: 25,
    prizeHits: [11, 12, 13, 14, 15],
  },
  {
    value: 'lotomania',
    label: 'Lotomania',
    min: 50,
    max: 50,
    from: 0,
    to: 99,
    prizeHits: [0, 15, 16, 17, 18, 19, 20],
  },
]

export function padNumber(value) {
  return String(value).padStart(2, '0')
}

export function getLotteryRule(type) {
  return LOTTERY_TYPES.find((lottery) => lottery.value === type) || LOTTERY_TYPES[0]
}

export function buildNumberRange(type) {
  const rule = getLotteryRule(type)

  return Array.from(
    {
      length: rule.to - rule.from + 1,
    },
    (_, index) => padNumber(rule.from + index),
  )
}

export function getLotteryLabel(type) {
  return getLotteryRule(type).label
}

export function isLotomania(type) {
  return type === 'lotomania'
}

export function getLotteryRangeText(type) {
  const rule = getLotteryRule(type)

  return `${padNumber(rule.from)} a ${padNumber(rule.to)}`
}

export function getLotterySelectionText(type) {
  const rule = getLotteryRule(type)

  if (rule.min === rule.max) {
    return `Escolha exatamente ${rule.min} números`
  }

  return `Escolha de ${rule.min} a ${rule.max} números`
}