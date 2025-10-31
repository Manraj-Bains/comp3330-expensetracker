// frontend/src/router.tsx
import ExpensesListPage from './routes/expenses.list'
import ExpenseDetailPage from './routes/expenses.detail'
import ExpensesNewPage from './routes/expenses.new'

import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'

// root layout
const rootRoute = createRootRoute({ component: () => <App /> })

// /
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <p>Home Page</p>,
})

// /expenses (list)
const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expenses',
  component: ExpensesListPage,
})

// /expenses/$id (detail)
const expenseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expenses/$id',
  component: () => {
    const { id } = expenseDetailRoute.useParams()
    return <ExpenseDetailPage id={Number(id)} />
  },
})

// /expenses/new (form)
const expensesNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expenses/new',
  component: ExpensesNewPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  expensesRoute,
  expenseDetailRoute,
  expensesNewRoute,
])

export const router = createRouter({ routeTree })

router.update({
  defaultNotFoundComponent: () => <p>Page not found</p>,
  defaultErrorComponent: ({ error }) => <p>Error: {(error as Error).message}</p>,
})
