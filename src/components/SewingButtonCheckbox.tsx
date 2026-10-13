type ButtonShape = 'round' | 'heart' | 'flower' | 'star'

type SewingButtonCheckboxProps = {
  checked: boolean
  id: string
  itemIndex: number
  label: string
  onChange: () => void
  size?: 'small' | 'regular'
  todoId: number
}

const shapeOrder: ButtonShape[] = ['round', 'heart', 'flower', 'star']

const spritePositions: Record<ButtonShape, string> = {
  round: '7% 7%',
  heart: '93% 7%',
  flower: '7% 90%',
  star: '93% 90%',
}

function ButtonOutline({ shape }: { shape: ButtonShape }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 size-full text-button-outline"
      fill="none"
      stroke="currentColor"
      strokeDasharray="2.6 3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 48 48"
    >
      <g transform="translate(24 24) scale(1.1) translate(-24 -24)">
        {shape === 'round' && <circle cx="24" cy="24" r="18" />}
        {shape === 'heart' && <path d="M24 41C18 36 5 27 5 17c0-7 5-11 11-11 4 0 7 2 8 6 1-4 4-6 8-6 6 0 11 4 11 11 0 10-13 19-19 24Z" />}
        {shape === 'flower' && <path d="M24 5c5 0 8 4 8 8 4-3 9-1 11 3 2 5-1 9-5 11 4 3 4 8 1 12-4 4-9 3-13 0-3 4-8 5-12 2-4-3-4-8-1-12-5-2-8-6-6-11 2-5 7-7 12-5 0-4 1-8 5-8Z" />}
        {shape === 'star' && <path d="m24 4 5.4 12.5L43 18l-10.3 9 3.1 14L24 33.6 12.2 41l3.1-14L5 18l13.6-1.5L24 4Z" />}
      </g>
    </svg>
  )
}

export function SewingButtonCheckbox({ checked, id, itemIndex, label, onChange, size = 'regular', todoId }: SewingButtonCheckboxProps) {
  const shape = shapeOrder[(todoId + itemIndex - 1) % shapeOrder.length]

  return (
    <span className={`relative inline-block shrink-0 rounded-lg focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink ${size === 'small' ? 'size-10' : 'size-12'}`}>
      <input
        aria-label={label}
        checked={checked}
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
        id={id}
        onChange={onChange}
        type="checkbox"
      />
      <span className={`absolute inset-0 transition-opacity duration-200 ${checked ? 'opacity-0' : 'opacity-100'}`}>
        <ButtonOutline shape={shape} />
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-no-repeat transition-all duration-200 motion-reduce:transition-none ${checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}icons/sewing-buttons-atlas.png)`,
          backgroundPosition: spritePositions[shape],
          backgroundSize: '240% 240%',
        }}
      />
    </span>
  )
}
