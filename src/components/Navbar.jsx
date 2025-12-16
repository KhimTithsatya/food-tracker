import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 p-4 shadow mb-6 flex gap-6">
      <Link href="/" className="font-semibold text-gray-800 dark:text-white">
        Dashboard
      </Link>

      <Link href="/add-food" className="text-gray-800 dark:text-white">
        Add Food
      </Link>

      <Link href="/history" className="text-gray-800 dark:text-white">
        History
      </Link>
    </nav>
  );
}
