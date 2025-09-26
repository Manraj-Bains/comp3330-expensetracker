import { AppCard } from './components/AppCard'
import { ThemeToggle } from "./components/theme-toggle";

export default function App() {
  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="mx-auto max-w-3xl p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">COMP3330 – Frontend Setup</h1>
          <ThemeToggle />
        </header>
        <p className="mt-2 text-sm text-muted-foreground">Vite • React • Tailwind • ShadCN</p>
        <AppCard />
      </div>
    </main>
  );
}
