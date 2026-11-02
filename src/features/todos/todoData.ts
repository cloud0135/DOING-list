export type ChecklistItem = {
  id: string
  title: string
  completed: boolean
}

export type Repository = {
  id: number
  name: string
  owner: string
  description: string
  language: string
  url: string | null
  defaultBranch: string
}

export type Todo = {
  id: string
  title: string
  isCompleted: boolean
  dueDate: string | null
  createdAt: string
  updatedAt: string
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
    id: '11111111-1111-4111-8111-111111111111',
    title: 'DOING-list 개발 완성',
    isCompleted: false,
    dueDate: dateAfter(1),
    createdAt: '2026-10-13T04:00:00.000Z',
    updatedAt: '2026-10-13T04:00:00.000Z',
    checklist: [
      { id: '11111111-1111-4111-8111-111111111101', title: '로그인 흐름 정리', completed: true },
      { id: '11111111-1111-4111-8111-111111111102', title: '공개 리포지터리 조회 흐름 정리', completed: false },
      { id: '11111111-1111-4111-8111-111111111103', title: 'Todo 연결 흐름 점검', completed: false },
    ],
    repository: null,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: '해커톤 팀 프로젝트',
    isCompleted: false,
    dueDate: dateAfter(4),
    createdAt: '2026-10-12T04:00:00.000Z',
    updatedAt: '2026-10-12T04:00:00.000Z',
    checklist: [
      { id: '22222222-2222-4222-8222-222222222201', title: '서비스 아이디어 정리', completed: true },
      { id: '22222222-2222-4222-8222-222222222202', title: '팀 역할 분담', completed: true },
      { id: '22222222-2222-4222-8222-222222222203', title: '발표 자료 제작', completed: false },
    ],
    repository: null,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    title: '개인 프로젝트',
    isCompleted: true,
    dueDate: null,
    createdAt: '2026-10-06T04:00:00.000Z',
    updatedAt: '2026-10-06T04:00:00.000Z',
    checklist: [
      { id: '33333333-3333-4333-8333-333333333301', title: '프로젝트 소개 정리', completed: true },
      { id: '33333333-3333-4333-8333-333333333302', title: 'README와 배포 점검', completed: true },
    ],
    repository: null,
  },
]

export const previewRepositories: Repository[] = [
  {
    id: 1,
    name: 'DOING-list',
    owner: 'cloud0135',
    description: 'Todo와 GitHub 리포지터리를 연결하는 프로젝트',
    language: 'TypeScript',
    url: 'https://github.com/cloud0135/DOING-list',
    defaultBranch: 'main',
  },
  {
    id: 2,
    name: 'portfolio-site',
    owner: 'example-user',
    description: '개인 포트폴리오 화면을 구성하는 예시 프로젝트',
    language: 'React',
    url: null,
    defaultBranch: 'main',
  },
  {
    id: 3,
    name: 'study-notes',
    owner: 'example-user',
    description: '개발 학습 내용을 정리하는 예시 프로젝트',
    language: 'Markdown',
    url: null,
    defaultBranch: 'main',
  },
]

export function getProgress(todo: Todo) {
  const total = todo.checklist.length
  const completed = todo.checklist.filter((item) => item.completed).length
  return { total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) }
}

export function isTodoComplete(todo: Todo) {
  return todo.isCompleted
}

export function compareDeadlines(a: Todo, b: Todo) {
  const compareCreatedAt = () => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)

  if (a.dueDate === null) return b.dueDate === null ? compareCreatedAt() : 1
  if (b.dueDate === null) return -1
  return a.dueDate.localeCompare(b.dueDate) || compareCreatedAt()
}

export function compareCreatedAt(a: Todo, b: Todo) {
  return b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)
}

export function compareTitles(a: Todo, b: Todo) {
  return a.title.localeCompare(b.title, 'ko')
    || a.createdAt.localeCompare(b.createdAt)
    || a.id.localeCompare(b.id)
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
