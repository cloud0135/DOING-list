import { useTodos } from '../features/todos/todoContext'

const warningMessages = {
  recovered: '저장된 Todo 데이터에 문제가 있어 복구 사본을 남기고 안전한 목록으로 열었습니다.',
  unavailable: '브라우저 저장 공간을 사용할 수 없어 변경 내용이 사라질 수 있습니다.',
}

export function StorageNotice() {
  const { storageWarning } = useTodos()
  if (storageWarning === null) return null

  return (
    <div className="rounded-xl border border-accent bg-accent-soft px-4 py-3 text-sm text-ink" role="alert">
      {warningMessages[storageWarning]}
    </div>
  )
}
