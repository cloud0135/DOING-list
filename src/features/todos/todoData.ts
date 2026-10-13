export type ChecklistItem = {
  id: string
  title: string
  completed: boolean
}

export type Repository = {
  id: number
  name: string
  description: string
  language: string
  url: string | null
}

export type Todo = {
  id: number
  title: string
  dueDate: string | null
  checklist: ChecklistItem[]
  repository: Repository | null
}

export type NewTodoInput = {
  title: string
  dueDate: string | null
  checklistTitles: string[]
  repository: Repository | null
}

export type TodoChanges = Pick<Todo, 'title' | 'dueDate' | 'checklist'>

function dateAfter(days: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const initialTodos: Todo[] = [
  {
    id: 1,
    title: 'DOING-list 개발 완성',
    dueDate: dateAfter(1),
    checklist: [
      { id: 'auth-flow', title: '로그인 흐름 정리', completed: true },
      { id: 'repo-list', title: '공개 리포지터리 조회 흐름 정리', completed: false },
      { id: 'todo-link', title: 'Todo 연결 흐름 점검', completed: false },
    ],
    repository: null,
  },
  {
    id: 2,
    title: '해커톤 팀 프로젝트',
    dueDate: dateAfter(4),
    checklist: [
      { id: 'layout', title: '서비스 아이디어 정리', completed: true },
      { id: 'deadline', title: '팀 역할 분담', completed: true },
      { id: 'detail', title: '발표 자료 제작', completed: false },
    ],
    repository: null,
  },
  {
    id: 3,
    title: '개인 프로젝트',
    dueDate: null,
    checklist: [
      { id: 'intro', title: '프로젝트 소개 정리', completed: true },
      { id: 'roadmap', title: 'README와 배포 점검', completed: true },
    ],
    repository: null,
  },
]

export const previewRepositories: Repository[] = [
  {
    id: 1,
    name: 'DOING-list',
    description: 'Todo와 GitHub 리포지터리를 연결하는 프로젝트',
    language: 'TypeScript',
    url: 'https://github.com/cloud0135/DOING-list',
  },
  {
    id: 2,
    name: 'portfolio-site',
    description: '개인 포트폴리오 화면을 구성하는 예시 프로젝트',
    language: 'React',
    url: null,
  },
  {
    id: 3,
    name: 'study-notes',
    description: '개발 학습 내용을 정리하는 예시 프로젝트',
    language: 'Markdown',
    url: null,
  },
]

export function getProgress(todo: Todo) {
  const total = todo.checklist.length
  const completed = todo.checklist.filter((item) => item.completed).length
  return { total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) }
}

export function isTodoComplete(todo: Todo) {
  const { total, completed } = getProgress(todo)
  return total > 0 && completed === total
}

export function compareDeadlines(a: Todo, b: Todo) {
  if (a.dueDate === null) return b.dueDate === null ? a.id - b.id : 1
  if (b.dueDate === null) return -1
  return a.dueDate.localeCompare(b.dueDate) || a.id - b.id
}

export function dDayLabel(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  const today = new Date()
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const dueUtc = Date.UTC(year, month - 1, day)
  const remaining = Math.round((dueUtc - todayUtc) / 86_400_000)

  if (remaining === 0) return 'D-Day'
  return remaining > 0 ? `D-${remaining}` : `D+${Math.abs(remaining)}`
}
